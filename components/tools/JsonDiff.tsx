interface DiffResult {
  path: string;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  leftValue?: any;
  rightValue?: any;
}

interface JsonDiffProps {
  left: any;
  right: any;
}

function deepDiff(obj1: any, obj2: any, path: string = ''): DiffResult[] {
  const results: DiffResult[] = [];

  // Handle primitive types
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    if (obj1 === obj2) {
      return [{ path, type: 'unchanged', leftValue: obj1, rightValue: obj2 }];
    } else {
      return [{ path, type: 'modified', leftValue: obj1, rightValue: obj2 }];
    }
  }

  // Handle arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    const maxLen = Math.max(obj1.length, obj2.length);
    for (let i = 0; i < maxLen; i++) {
      const newPath = `${path}[${i}]`;
      if (i >= obj1.length) {
        results.push({ path: newPath, type: 'added', rightValue: obj2[i] });
      } else if (i >= obj2.length) {
        results.push({ path: newPath, type: 'removed', leftValue: obj1[i] });
      } else {
        results.push(...deepDiff(obj1[i], obj2[i], newPath));
      }
    }
    return results;
  }

  // Handle objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = new Set([...keys1, ...keys2]);

  allKeys.forEach(key => {
    const newPath = path ? `${path}.${key}` : key;

    if (!(key in obj1)) {
      results.push({ path: newPath, type: 'added', rightValue: obj2[key] });
    } else if (!(key in obj2)) {
      results.push({ path: newPath, type: 'removed', leftValue: obj1[key] });
    } else {
      results.push(...deepDiff(obj1[key], obj2[key], newPath));
    }
  });

  return results;
}

function formatValue(value: any): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

function DiffRow({ diff }: { diff: DiffResult }) {
  const getBgColor = (type: string) => {
    switch (type) {
      case 'added': return 'bg-green-900/30 border-l-4 border-green-500';
      case 'removed': return 'bg-red-900/30 border-l-4 border-red-500';
      case 'modified': return 'bg-yellow-900/30 border-l-4 border-yellow-500';
      default: return 'bg-bg-elevated border-l-4 border-transparent';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'added': return '+ ';
      case 'removed': return '- ';
      case 'modified': return '~ ';
      default: return '  ';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'added': return 'text-green-400';
      case 'removed': return 'text-red-400';
      case 'modified': return 'text-yellow-400';
      default: return 'text-text-muted';
    }
  };

  if (diff.type === 'unchanged') return null;

  return (
    <div className={`px-4 py-2 ${getBgColor(diff.type)} font-mono text-sm`}>
      <div className="flex items-start gap-3">
        <span className={`${getTextColor(diff.type)} font-bold`}>{getIcon(diff.type)}</span>
        <span className="text-primary-light font-semibold min-w-[200px]">{diff.path}</span>
        <div className="flex-1">
          {diff.type === 'modified' && (
            <div className="space-y-1">
              <div className="text-red-400">
                <span className="text-text-muted mr-2">Old:</span>
                {formatValue(diff.leftValue)}
              </div>
              <div className="text-green-400">
                <span className="text-text-muted mr-2">New:</span>
                {formatValue(diff.rightValue)}
              </div>
            </div>
          )}
          {diff.type === 'added' && (
            <span className="text-green-400">{formatValue(diff.rightValue)}</span>
          )}
          {diff.type === 'removed' && (
            <span className="text-red-400">{formatValue(diff.leftValue)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JsonDiff({ left, right }: JsonDiffProps) {
  if (!left || !right) {
    return (
      <div className="p-8 text-center text-text-muted">
        <p className="text-lg">Enter valid JSON in both editors to compare</p>
      </div>
    );
  }

  const diffs = deepDiff(left, right);
  const changesCount = diffs.filter(d => d.type !== 'unchanged').length;

  return (
    <div className="bg-bg-dark rounded-lg overflow-hidden">
      <div className="bg-bg-elevated px-6 py-3 border-b border-border flex justify-between items-center">
        <h3 className="font-semibold text-text-primary">Differences Found</h3>
        <div className="flex gap-4 text-sm">
          <span className="text-green-400">
            + {diffs.filter(d => d.type === 'added').length} added
          </span>
          <span className="text-red-400">
            - {diffs.filter(d => d.type === 'removed').length} removed
          </span>
          <span className="text-yellow-400">
            ~ {diffs.filter(d => d.type === 'modified').length} modified
          </span>
        </div>
      </div>

      <div className="max-h-96 overflow-auto">
        {changesCount === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">✓</div>
            <p className="text-accent-light font-semibold text-lg">Objects are identical!</p>
            <p className="text-text-muted mt-2">No differences found between the two JSON objects.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {diffs.map((diff, index) => (
              <DiffRow key={index} diff={diff} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
