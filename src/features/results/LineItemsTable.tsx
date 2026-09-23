import React, { useState } from 'react';
import { Table, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { LineItem } from '../../types/document';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface LineItemsTableProps {
  lineItems: LineItem[];
  currency: string;
}

export const LineItemsTable: React.FC<LineItemsTableProps> = ({
  lineItems,
  currency,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!lineItems || lineItems.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-surface border border-border-strong/70 p-6 shadow-card dark:shadow-card-dark space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-foreground">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Extracted Line Items ({lineItems.length})
            </h3>
            <p className="text-xs text-foreground-muted">
              Parsed line items with verified arithmetic subtotal checks
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-foreground-muted hover:text-foreground flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-surface-elevated transition-colors"
        >
          <span>{isOpen ? 'Collapse' : 'Expand'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[11px] font-mono text-foreground-subtle uppercase">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Discount</th>
                <th className="py-2.5 px-3 text-right">Tax Rate</th>
                <th className="py-2.5 px-3 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {lineItems.map((item, idx) => {
                const calculatedExpected = item.quantity * item.unitPrice - (item.discount || 0);
                const hasVariance =
                  item.lineSubtotal !== null &&
                  Math.abs(item.lineSubtotal - calculatedExpected) > 0.05;

                return (
                  <tr
                    key={idx}
                    className="hover:bg-surface-elevated/50 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono text-foreground-subtle">
                      {item.lineNumber || idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-foreground max-w-xs truncate">
                      {item.description}
                      {item.sku && (
                        <span className="block text-[10px] font-mono text-foreground-subtle">
                          SKU: {item.sku}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      {formatNumber(item.quantity, 0)} {item.unit || ''}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      {formatCurrency(item.unitPrice, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-foreground-subtle">
                      {item.discount ? `-${formatCurrency(item.discount, currency)}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-foreground-subtle">
                      {item.taxRate !== null ? `${(item.taxRate * 100).toFixed(0)}%` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold tabular-nums text-foreground">
                      <div className="flex items-center justify-end gap-1.5">
                        <span>{formatCurrency(item.lineTotal, currency)}</span>
                        {hasVariance ? (
                          <span title="Line arithmetic variance detected">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          </span>
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/70" />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
