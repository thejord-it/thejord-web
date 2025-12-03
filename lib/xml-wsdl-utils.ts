// XML Validation Result
export interface XMLValidation {
  valid: boolean;
  error?: string;
  line?: number;
  column?: number;
}

// XML Stats
export interface XMLStats {
  elements: number;
  attributes: number;
  textNodes: number;
  size: number;
  depth: number;
}

// WSDL Parsed Data
export interface WSDLOperation {
  name: string;
  input?: string;
  output?: string;
  documentation?: string;
}

export interface WSDLService {
  name: string;
  port?: string;
  address?: string;
}

export interface WSDLData {
  targetNamespace?: string;
  services: WSDLService[];
  operations: WSDLOperation[];
  types: string[];
  bindings: string[];
}

/**
 * Validate XML syntax
 */
export function validateXML(xmlString: string): XMLValidation {
  if (!xmlString || xmlString.trim() === '') {
    return {
      valid: false,
      error: 'Empty input'
    };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');

    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      const errorText = parserError.textContent || 'Unknown parsing error';

      // Try to extract line/column info
      const lineMatch = errorText.match(/line (\d+)/i);
      const colMatch = errorText.match(/column (\d+)/i);

      return {
        valid: false,
        error: errorText.split('\n')[0],
        line: lineMatch ? parseInt(lineMatch[1]) : undefined,
        column: colMatch ? parseInt(colMatch[1]) : undefined
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid XML'
    };
  }
}

/**
 * Format (prettify) XML with indentation
 */
export function formatXML(xmlString: string, indent: number = 2): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');

    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid XML');
    }

    const serializer = new XMLSerializer();
    let formatted = serializer.serializeToString(doc);

    // Add indentation
    const indentStr = ' '.repeat(indent);
    formatted = formatted.replace(/(<([^/>]+)>)([^<]*?)(<\/\2>)/g, (match, open, _tag, content, close) => {
      if (content.trim() === '') {
        return `${open}${close}`;
      }
      return match;
    });

    const lines: string[] = [];
    let currentIndent = 0;

    formatted.split(/>\s*</).forEach((node, index, array) => {
      let line = node;

      // Add < and > back
      if (index > 0) line = '<' + line;
      if (index < array.length - 1) line = line + '>';

      // Handle closing tags
      if (line.match(/^<\//)) {
        currentIndent = Math.max(0, currentIndent - 1);
      }

      // Add indentation
      lines.push(indentStr.repeat(currentIndent) + line.trim());

      // Handle opening tags (not self-closing)
      if (line.match(/^<[^/!?]/) && !line.match(/\/>$/)) {
        currentIndent++;
      }
    });

    return lines.join('\n');
  } catch (error) {
    throw new Error('Failed to format XML: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

/**
 * Minify XML by removing whitespace
 */
export function minifyXML(xmlString: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');

    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid XML');
    }

    // Remove all unnecessary whitespace
    const removeWhitespace = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent && node.textContent.trim() === '') {
          node.textContent = '';
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (let i = 0; i < node.childNodes.length; i++) {
          removeWhitespace(node.childNodes[i]);
        }
      }
    };

    removeWhitespace(doc);

    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc).replace(/>\s+</g, '><');
  } catch (error) {
    throw new Error('Failed to minify XML: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

/**
 * Convert XML to JSON
 */
export function xmlToJSON(xmlString: string): any {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');

    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid XML');
    }

    const xmlToJson = (node: Element): any => {
      const obj: any = {};

      // Handle attributes
      if (node.attributes && node.attributes.length > 0) {
        obj['@attributes'] = {};
        for (let i = 0; i < node.attributes.length; i++) {
          const attr = node.attributes[i];
          obj['@attributes'][attr.name] = attr.value;
        }
      }

      // Handle child nodes
      const children = node.childNodes;
      let hasElementChildren = false;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (child.nodeType === Node.ELEMENT_NODE) {
          hasElementChildren = true;
          const childElement = child as Element;
          const childName = childElement.nodeName;

          const childValue = xmlToJson(childElement);

          if (obj[childName]) {
            if (!Array.isArray(obj[childName])) {
              obj[childName] = [obj[childName]];
            }
            obj[childName].push(childValue);
          } else {
            obj[childName] = childValue;
          }
        } else if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent?.trim();
          if (text && !hasElementChildren) {
            return text;
          }
        }
      }

      return Object.keys(obj).length > 0 ? obj : null;
    };

    return {
      [doc.documentElement.nodeName]: xmlToJson(doc.documentElement)
    };
  } catch (error) {
    throw new Error('Failed to convert XML to JSON: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

/**
 * Convert JSON to XML
 */
export function jsonToXML(json: any, rootName: string = 'root'): string {
  const escapeXML = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const convert = (obj: any, indent: string = ''): string => {
    if (obj === null) return '';

    if (typeof obj !== 'object') {
      return escapeXML(String(obj));
    }

    if (Array.isArray(obj)) {
      return obj.map(item => `${indent}<item>\n${convert(item, indent + '  ')}\n${indent}</item>`).join('\n');
    }

    return Object.entries(obj).map(([key, value]) => {
      const tagName = key.replace(/[^a-zA-Z0-9_-]/g, '_');
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          return `${indent}<${tagName}>\n${convert(value, indent + '  ')}\n${indent}</${tagName}>`;
        }
        return `${indent}<${tagName}>\n${convert(value, indent + '  ')}\n${indent}</${tagName}>`;
      }
      return `${indent}<${tagName}>${escapeXML(String(value))}</${tagName}>`;
    }).join('\n');
  };

  return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${convert(json, '  ')}\n</${rootName}>`;
}

/**
 * Get XML statistics
 */
export function getXMLStats(xmlString: string): XMLStats {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');

    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      return { elements: 0, attributes: 0, textNodes: 0, size: 0, depth: 0 };
    }

    let elements = 0;
    let attributes = 0;
    let textNodes = 0;
    let maxDepth = 0;

    const traverse = (node: Node, depth: number = 0) => {
      maxDepth = Math.max(maxDepth, depth);

      if (node.nodeType === Node.ELEMENT_NODE) {
        elements++;
        const element = node as Element;
        attributes += element.attributes.length;
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        textNodes++;
      }

      for (let i = 0; i < node.childNodes.length; i++) {
        traverse(node.childNodes[i], depth + 1);
      }
    };

    traverse(doc);

    return {
      elements,
      attributes,
      textNodes,
      size: new Blob([xmlString]).size,
      depth: maxDepth
    };
  } catch (error) {
    return { elements: 0, attributes: 0, textNodes: 0, size: 0, depth: 0 };
  }
}

/**
 * Parse WSDL and extract service information
 */
export function parseWSDL(xmlString: string): WSDLData {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');

    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid WSDL/XML');
    }

    // Helper to get elements by tag name (handle namespaces)
    const getElements = (tagName: string): Element[] => {
      const elements = Array.from(doc.getElementsByTagName(tagName));

      // Try with common WSDL prefixes if not found
      if (elements.length === 0) {
        const prefixes = ['wsdl:', 's:', 'xs:', 'soap:', 'http:'];
        for (const prefix of prefixes) {
          const prefixedElements = Array.from(doc.getElementsByTagName(prefix + tagName));
          if (prefixedElements.length > 0) {
            return prefixedElements;
          }
        }
      }

      return elements;
    };

    // Extract target namespace
    const definitions = doc.documentElement;
    const targetNamespace = definitions.getAttribute('targetNamespace') || undefined;

    // Extract services
    const services: WSDLService[] = [];
    const serviceElements = getElements('service');

    serviceElements.forEach(service => {
      const serviceName = service.getAttribute('name') || 'Unknown Service';
      const ports = getElements('port');

      ports.forEach(port => {
        const portName = port.getAttribute('name') || undefined;
        const addresses = port.getElementsByTagNameNS('*', 'address');
        const address = addresses.length > 0 ? addresses[0].getAttribute('location') || undefined : undefined;

        services.push({
          name: serviceName,
          port: portName,
          address
        });
      });

      if (ports.length === 0) {
        services.push({ name: serviceName });
      }
    });

    // Extract operations
    const operations: WSDLOperation[] = [];
    const portTypes = getElements('portType');

    portTypes.forEach(portType => {
      const ops = Array.from(portType.getElementsByTagNameNS('*', 'operation'));

      ops.forEach(op => {
        const opName = op.getAttribute('name') || 'Unknown Operation';
        const inputs = op.getElementsByTagNameNS('*', 'input');
        const outputs = op.getElementsByTagNameNS('*', 'output');
        const docs = op.getElementsByTagNameNS('*', 'documentation');

        operations.push({
          name: opName,
          input: inputs.length > 0 ? inputs[0].getAttribute('message') || undefined : undefined,
          output: outputs.length > 0 ? outputs[0].getAttribute('message') || undefined : undefined,
          documentation: docs.length > 0 ? docs[0].textContent || undefined : undefined
        });
      });
    });

    // Extract types
    const types: string[] = [];
    const schemaElements = getElements('schema');

    schemaElements.forEach(schema => {
      const complexTypes = Array.from(schema.getElementsByTagNameNS('*', 'complexType'));
      const simpleTypes = Array.from(schema.getElementsByTagNameNS('*', 'simpleType'));
      const elements = Array.from(schema.getElementsByTagNameNS('*', 'element'));

      [...complexTypes, ...simpleTypes, ...elements].forEach(type => {
        const typeName = type.getAttribute('name');
        if (typeName && !types.includes(typeName)) {
          types.push(typeName);
        }
      });
    });

    // Extract bindings
    const bindings: string[] = [];
    const bindingElements = getElements('binding');

    bindingElements.forEach(binding => {
      const bindingName = binding.getAttribute('name');
      if (bindingName && !bindings.includes(bindingName)) {
        bindings.push(bindingName);
      }
    });

    return {
      targetNamespace,
      services,
      operations,
      types,
      bindings
    };
  } catch (error) {
    throw new Error('Failed to parse WSDL: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}
