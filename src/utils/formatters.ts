/**
 * Financial & Technical Formatting Utilities
 */

export function formatCurrency(
  amount: number | null | undefined,
  currency: string = 'USD'
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '—';
  }

  const cleanCurrency = currency?.trim().toUpperCase() || 'USD';

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cleanCurrency.length === 3 ? cleanCurrency : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${cleanCurrency} ${amount.toFixed(2)}`;
  }
}

export function formatNumber(
  num: number | null | undefined,
  decimals: number = 2
): string {
  if (num === null || num === undefined || isNaN(num)) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr || dateStr.trim() === '') {
    return '—';
  }

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
