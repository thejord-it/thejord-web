import { useState } from 'react';

interface JsonTreeProps {
  data: any;
  name?: string;
  level?: number;
}

function JsonTreeNode({ data, name, level = 0 }: JsonTreeProps) {
  const [expanded, setExpanded] = useState(level < 2);

  const indent = level * 20;
  const isObject = typeof data === 'object' && data !== null && !Array.isArray(data);
  const isArray = Array.isArray(data);
  const isPrimitive = !isObject && !isArray;

  const getTypeColor = (value: any): string => {
    if (value === null) return 'text-gray-400';
    if (typeof value === 'string') return 'text-green-400';
    if (typeof value === 'number') return 'text-blue-400';
    if (typeof value === 'boolean') return 'text-purple-400';
    return 'text-text-primary';
  };

  const getValueDisplay = (value: any): string => {
    if (value === null) return 'null';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'number') return value.toString();
    return '';
  };

  if (isPrimitive || data === null) {
    return (
      <div style={{ paddingLeft: `${indent}px` }} className="py-1 font-mono text-sm">
        {name && <span className="text-primary-light font-semibold">{name}: </span>}
        <span className={getTypeColor(data)}>{getValueDisplay(data)}</span>
      </div>
    );
  }

  const entries = isObject ? Object.entries(data) : data.map((item: any, index: number) => [index, item]);
  const count = entries.length;
  const icon = expanded ? '▼' : '▶';
  const bracket = isArray ? '[' : '{';
  const closeBracket = isArray ? ']' : '}';

  return (
    <div className="font-mono text-sm">
      <div
        style={{ paddingLeft: `${indent}px` }}
        className="py-1 cursor-pointer hover:bg-bg-elevated transition-colors flex items-center gap-2"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-secondary w-4">{icon}</span>
        {name && <span className="text-primary-light font-semibold">{name}: </span>}
        <span className="text-text-muted">
          {bracket}
          {!expanded && <span className="text-text-muted"> {count} items {closeBracket}</span>}
        </span>
      </div>

      {expanded && (
        <div>
          {entries.map(([key, value]: [string, any]) => (
            <JsonTreeNode key={key} data={value} name={String(key)} level={level + 1} />
          ))}
          <div style={{ paddingLeft: `${indent + 20}px` }} className="py-1 text-text-muted">
            {closeBracket}
          </div>
        </div>
      )}
    </div>
  );
}

export default function JsonTree({ data, name }: JsonTreeProps) {
  if (!data) {
    return (
      <div className="p-6 text-center text-text-muted">
        No data to display
      </div>
    );
  }

  return (
    <div className="p-6 bg-bg-dark rounded-lg overflow-auto max-h-96">
      <JsonTreeNode data={data} name={name} level={0} />
    </div>
  );
}
