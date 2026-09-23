import React from 'react';
import {
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Cpu,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { NavTab } from '../../components/layout/Sidebar';

interface HomeScreenProps {
  onNavigate: (tab: NavTab) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-surface border border-border-strong/70 p-6 sm:p-10 shadow-card dark:shadow-card-dark">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-xs font-mono text-foreground-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CORE RECONCILIATION ENGINE READY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            Financial Document Intelligence
          </h1>

          <p className="text-sm sm:text-base text-foreground-muted leading-relaxed">
            Deterministic extraction, zero-tolerance mathematical reconciliation, and automated
            verification of invoices, receipts, and financial statements. Fully backed by authoritative
            second-pass verification and native Excel report generation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('generator')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Open Generator
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('about')}
            >
              System Specs
            </Button>
          </div>
        </div>

        {/* Subtle decorative geometric overlay */}
        <div className="absolute right-4 bottom-4 sm:right-8 sm:bottom-8 opacity-10 pointer-events-none select-none">
          <FileSpreadsheet className="w-48 h-48 text-foreground" />
        </div>
      </div>

      {/* Feature Pillars */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-subtle mb-4">
          Core Engine Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="default" hoverEffect>
            <div className="w-9 h-9 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-foreground mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Multi-Pass Verification
            </h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Tiered complexity analysis automatically determines model escalation, validating
              complex tabular layouts and nested tax breakdowns.
            </p>
          </Card>

          <Card variant="default" hoverEffect>
            <div className="w-9 h-9 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-foreground mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Zero Tolerance Math
            </h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Enforces exact line-item reconciliation down to 0.00. Identifies calculation
              discrepancies and prompts structured user reviews.
            </p>
          </Card>

          <Card variant="default" hoverEffect>
            <div className="w-9 h-9 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-foreground mb-3">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Verified XLSX Generation
            </h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Directly produces multi-tab Excel workbooks containing formulaic summaries,
              line-item ledger mappings, and audit trails.
            </p>
          </Card>
        </div>
      </div>

      {/* Quick Launch Checklist */}
      <Card variant="default" className="border-dashed">
        <h3 className="text-xs font-mono uppercase tracking-wider text-foreground-subtle mb-3">
          Workflow Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">1. Select PDF</p>
              <p className="text-foreground-muted text-[11px]">Upload invoice, bill, or statement</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">2. Deep OCR</p>
              <p className="text-foreground-muted text-[11px]">Reconciles subtotals, taxes & totals</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">3. User Review</p>
              <p className="text-foreground-muted text-[11px]">Resolve any ambiguous items</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">4. Export XLSX</p>
              <p className="text-foreground-muted text-[11px]">Download certified spreadsheet</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
