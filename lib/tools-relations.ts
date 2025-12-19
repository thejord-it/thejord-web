// Related tools mapping for internal linking

export const TOOLS_RELATIONS: Record<string, string[]> = {
  'json-formatter': ['json-schema', 'diff-checker', 'xml-wsdl-viewer'],
  'base64': ['hash-generator', 'url-encoder'],
  'regex-tester': ['diff-checker', 'json-formatter'],
  'hash-generator': ['base64', 'uuid-generator'],
  'url-encoder': ['base64', 'json-formatter'],
  'markdown-converter': ['diff-checker', 'lorem-ipsum'],
  'color-converter': ['lorem-ipsum'],
  'lorem-ipsum': ['markdown-converter', 'diff-checker'],
  'diff-checker': ['json-formatter', 'regex-tester', 'markdown-converter'],
  'cron-builder': ['uuid-generator'],
  'json-schema': ['json-formatter', 'xml-wsdl-viewer'],
  'xml-wsdl-viewer': ['json-formatter', 'json-schema'],
  'pdf-tools': ['base64'],
  'uuid-generator': ['hash-generator', 'cron-builder']
}

export function getRelatedTools(slug: string): string[] {
  return TOOLS_RELATIONS[slug] || []
}
