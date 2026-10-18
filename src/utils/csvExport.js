export function exportToCSV(data, filename = 'export.csv') {
  if (!data || !data.length) {
    alert('No data available to export.');
    return;
  }

  // Get headers from the first object keys
  const headers = Object.keys(data[0]);

  // Create CSV rows
  const csvRows = [];

  // Add Header Row
  csvRows.push(headers.map(header => `"${header}"`).join(','));

  // Add Data Rows
  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + (row[header] ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  // Create Blob and Download
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}