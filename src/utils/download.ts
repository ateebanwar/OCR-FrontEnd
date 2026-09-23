export function triggerBlobDownload(blob: Blob, filename: string): void {
  const cleanFilename = filename.toLowerCase().endsWith('.xlsx')
    ? filename
    : `${filename}.xlsx`;
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = cleanFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
