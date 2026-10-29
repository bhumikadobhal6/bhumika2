'use client';

import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface ConfigBannerProps {
  isConfigured: boolean;
}

export function ConfigBanner({ isConfigured }: ConfigBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isConfigured) return null;

  const envSample = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;

  const copyEnv = () => {
    navigator.clipboard.writeText(envSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Supabase Configuration Required for Live Operations
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Connect your Supabase project in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-xs">.env.local</code> to enable real user authentication and database persistence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-medium text-amber-800 hover:text-amber-950 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-100/70 hover:bg-amber-200/70 transition-colors"
          >
            {expanded ? 'Hide Guide' : 'Setup Guide'}
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-white bg-amber-700 hover:bg-amber-800 flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
          >
            Open Supabase
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {expanded && (
        <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-amber-200 text-xs text-amber-800 space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200/80">
              <span className="font-semibold text-amber-900 block mb-1">Step 1: Set Environment Variables</span>
              <p className="text-slate-600 mb-2">
                Add your project keys in <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">.env.local</code>:
              </p>
              <div className="relative font-mono bg-slate-900 text-slate-100 p-2.5 rounded-lg text-[11px] leading-tight overflow-x-auto">
                <pre>{envSample}</pre>
                <button
                  onClick={copyEnv}
                  className="absolute top-2 right-2 p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                  title="Copy"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200/80">
              <span className="font-semibold text-amber-900 block mb-1">Step 2: Run Database Migration</span>
              <p className="text-slate-600 mb-2">
                In Supabase Dashboard &rarr; <strong>SQL Editor</strong>, run the contents of:
              </p>
              <div className="flex items-center gap-2 font-mono bg-slate-100 text-slate-700 p-2 rounded-lg text-[11px]">
                <Terminal className="w-4 h-4 text-slate-500" />
                <span>supabase/migrations/001_initial_schema.sql</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                This provisions the <code className="font-semibold">assignments</code> table, indexes, updated_at trigger, and Row Level Security policies.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

