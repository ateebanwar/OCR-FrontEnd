import React from 'react';
import { ShieldCheck, AlertCircle, DollarSign } from 'lucide-react';
import { FinancialSummaryInfo } from '../../types/document';
import { formatCurrency } from '../../utils/formatters';

interface FinancialTotalsCardProps {
  financial: FinancialSummaryInfo;
}

export const FinancialTotalsCard: React.FC<FinancialTotalsCardProps> = ({ financial }) => {
  const {
    currency,
    subtotal,
    discountTotal,
    taxTotal,
    shippingCharges,
    additionalCharges,
    rounding,
    grandTotal,
    paidAmount,
    balanceDue,
    overallReconciliationStatus,
    reconciliationVerificationStatus,
    toleranceApplied,
  } = financial;

  return (
    <div className="rounded-2xl bg-surface border border-border-strong/70 p-6 shadow-card dark:shadow-card-dark space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-foreground">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Financial Reconciliation
            </h3>
            <p className="text-[11px] text-foreground-muted font-mono">
              Zero tolerance policy (Applied: {toleranceApplied.toFixed(1)})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {reconciliationVerificationStatus ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>RECONCILED</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-mono font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{overallReconciliationStatus}</span>
            </span>
          )}
        </div>
      </div>

      {/* Financial Ledger Table */}
      <div className="space-y-2 text-xs">
        {subtotal !== null && (
          <div className="flex items-center justify-between py-1.5 border-b border-border/50 text-foreground-muted">
            <span>Subtotal</span>
            <span className="font-mono text-foreground tabular-nums font-medium">
              {formatCurrency(subtotal, currency)}
            </span>
          </div>
        )}

        {discountTotal !== null && discountTotal > 0 && (
          <div className="flex items-center justify-between py-1.5 border-b border-border/50 text-emerald-600 dark:text-emerald-400">
            <span>Discount Applied</span>
            <span className="font-mono tabular-nums font-medium">
              -{formatCurrency(discountTotal, currency)}
            </span>
          </div>
        )}

        {taxTotal !== null && (
          <div className="flex items-center justify-between py-1.5 border-b border-border/50 text-foreground-muted">
            <span>Tax / VAT Total</span>
            <span className="font-mono text-foreground tabular-nums font-medium">
              {formatCurrency(taxTotal, currency)}
            </span>
          </div>
        )}

        {shippingCharges !== null && shippingCharges > 0 && (
          <div className="flex items-center justify-between py-1.5 border-b border-border/50 text-foreground-muted">
            <span>Shipping & Handling</span>
            <span className="font-mono text-foreground tabular-nums font-medium">
              {formatCurrency(shippingCharges, currency)}
            </span>
          </div>
        )}

        {additionalCharges !== null && additionalCharges > 0 && (
          <div className="flex items-center justify-between py-1.5 border-b border-border/50 text-foreground-muted">
            <span>Additional Surcharges</span>
            <span className="font-mono text-foreground tabular-nums font-medium">
              {formatCurrency(additionalCharges, currency)}
            </span>
          </div>
        )}

        {rounding !== null && rounding !== 0 && (
          <div className="flex items-center justify-between py-1.5 border-b border-border/50 text-foreground-muted">
            <span>Rounding Adjustment</span>
            <span className="font-mono text-foreground tabular-nums font-medium">
              {formatCurrency(rounding, currency)}
            </span>
          </div>
        )}

        {/* Grand Total */}
        <div className="flex items-center justify-between py-3 border-b-2 border-foreground text-sm font-bold text-foreground">
          <span>Grand Total</span>
          <span className="font-mono text-base tabular-nums">
            {formatCurrency(grandTotal, currency)}
          </span>
        </div>

        {/* Paid / Balance Due */}
        {paidAmount !== null && (
          <div className="flex items-center justify-between py-1.5 border-b border-border/50 text-foreground-muted">
            <span>Amount Paid</span>
            <span className="font-mono text-foreground tabular-nums font-medium">
              {formatCurrency(paidAmount, currency)}
            </span>
          </div>
        )}

        {balanceDue !== null && (
          <div className="flex items-center justify-between py-2 text-xs font-semibold text-foreground">
            <span>Balance Due</span>
            <span
              className={`font-mono tabular-nums text-sm ${
                balanceDue > 0 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
              }`}
            >
              {formatCurrency(balanceDue, currency)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
