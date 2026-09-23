import React from 'react';
import { Sparkles, Code2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/common/Card';

export const AboutScreen: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div className="pb-4 border-b border-border">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          About OCR Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted mt-0.5">
          High-precision financial document extraction, reconciliation, and automated Excel reporting
        </p>
      </div>

      {/* Main Info Card */}
      <Card variant="default" className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center font-bold text-base shadow-sm flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">OCR Intelligence</h2>
            <p className="text-xs font-mono text-foreground-muted uppercase tracking-wider">
              Developer: Ateeb Anwar
            </p>
            <p className="text-xs text-foreground-muted pt-1 leading-relaxed">
              An enterprise-grade document intelligence platform designed to extract, reconcile,
              and verify complex invoices, financial statements, and receipts with zero arbitrary tolerance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border text-xs">
          <div className="p-3.5 rounded-xl bg-surface-elevated/60 border border-border space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Code2 className="w-4 h-4 text-foreground-subtle" />
              <span>Technology Stack</span>
            </div>
            <p className="text-foreground-muted text-[11px] leading-relaxed">
              React 18, TypeScript (Strict), Vite, Tailwind CSS, Lucide Icons, Fastify Backend API,
              Multimodal Vision OCR.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-elevated/60 border border-border space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Security & Zero Secret Leaks</span>
            </div>
            <p className="text-foreground-muted text-[11px] leading-relaxed">
              All credentials, API keys, and validation rules remain server-side. The client executes
              strictly via short-lived HMAC tokens.
            </p>
          </div>
        </div>

        {/* Engine Highlights */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-foreground-subtle">
            Architectural Highlights
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-foreground-muted">
                <strong className="text-foreground font-medium">Deterministic Mathematical Reconciliation: </strong>
                Recalculates line-item unit prices, discounts, subtotal sums, taxes, and grand totals to 0.00.
              </span>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-foreground-muted">
                <strong className="text-foreground font-medium">Interactive Review Gate: </strong>
                Flags ambiguous terms or balance discrepancies for intentional operator resolution with server-side recalculation.
              </span>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-foreground-muted">
                <strong className="text-foreground font-medium">Native XLSX Generation: </strong>
                Produces verified multi-tab spreadsheets directly from the authoritative server engine.
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
