import React, { useState } from 'react';
import Card from './Card';
import { Code, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import Button from './Button';

/**
 * Raw JSON Inspector for Page 3 (/results).
 */
export default function RawJsonViewer({ rawJson }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = rawJson ? JSON.stringify(rawJson, null, 2) : '{}';

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      title="Raw FastAPI Payload Inspector"
      subtitle="Complete, unmodified JSON response returned by endpoint"
      headerAction={
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          size="sm"
          icon={isOpen ? ChevronUp : ChevronDown}
        >
          {isOpen ? 'COLLAPSE' : 'EXPAND JSON'}
        </Button>
      }
    >
      {isOpen && (
        <div className="mt-3">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border border-slate-800 rounded-t border-b-0">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              RESPONSE PAYLOAD // APPLICATION/JSON
            </span>

            <button
              onClick={handleCopy}
              className="text-xs font-mono text-slate-400 hover:text-slate-100 flex items-center gap-1 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY JSON</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-b text-xs font-mono text-slate-300 overflow-x-auto max-h-80 select-all leading-relaxed">
            {jsonString}
          </pre>
        </div>
      )}
    </Card>
  );
}
