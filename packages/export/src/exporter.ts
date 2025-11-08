/**
 * Data Export Utilities
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn {
  key: string;
  label: string;
  width?: number;
}

export interface ExportOptions {
  filename?: string;
  title?: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter';
}

export class DataExporter {
  /**
   * Export data to CSV
   */
  static toCSV<T extends Record<string, any>>(
    data: T[],
    columns: ExportColumn[],
    options: ExportOptions = {}
  ): void {
    const filename = options.filename || 'export.csv';

    // Create CSV content
    const headers = columns.map(col => col.label).join(',');
    const rows = data.map(row =>
      columns.map(col => {
        const value = row[col.key];
        // Escape commas and quotes
        const stringValue = String(value ?? '');
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    );

    const csv = [headers, ...rows].join('\n');

    // Download
    this.downloadFile(csv, filename, 'text/csv');
  }

  /**
   * Export data to PDF
   */
  static toPDF<T extends Record<string, any>>(
    data: T[],
    columns: ExportColumn[],
    options: ExportOptions = {}
  ): void {
    const filename = options.filename || 'export.pdf';
    const title = options.title || 'Data Export';
    const orientation = options.orientation || 'portrait';
    const format = options.format || 'a4';

    const doc = new jsPDF({ orientation, format });

    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 20);

    // Add table
    autoTable(doc, {
      startY: 30,
      head: [columns.map(col => col.label)],
      body: data.map(row => columns.map(col => String(row[col.key] ?? ''))),
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [255, 123, 92], // coral
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
    });

    // Download
    doc.save(filename);
  }

  /**
   * Export data to JSON
   */
  static toJSON<T extends Record<string, any>>(
    data: T[],
    options: ExportOptions = {}
  ): void {
    const filename = options.filename || 'export.json';
    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, filename, 'application/json');
  }

  /**
   * Export data to Excel-compatible CSV with UTF-8 BOM
   */
  static toExcel<T extends Record<string, any>>(
    data: T[],
    columns: ExportColumn[],
    options: ExportOptions = {}
  ): void {
    const filename = options.filename || 'export.csv';

    // Create CSV with UTF-8 BOM for Excel
    const headers = columns.map(col => col.label).join(',');
    const rows = data.map(row =>
      columns.map(col => {
        const value = row[col.key];
        const stringValue = String(value ?? '');
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    );

    const csv = '\uFEFF' + [headers, ...rows].join('\n'); // BOM prefix

    this.downloadFile(csv, filename, 'text/csv');
  }

  /**
   * Download file helper
   */
  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Export table data from HTML table element
 */
export function exportTable(
  tableId: string,
  format: 'csv' | 'pdf' | 'excel',
  options: ExportOptions = {}
): void {
  const table = document.getElementById(tableId) as HTMLTableElement;
  if (!table) {
    throw new Error(`Table with id "${tableId}" not found`);
  }

  // Extract columns
  const headers = Array.from(table.querySelectorAll('thead th')).map(
    (th, index) => ({
      key: String(index),
      label: th.textContent?.trim() || '',
    })
  );

  // Extract data
  const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
    const cells = Array.from(tr.querySelectorAll('td'));
    return cells.reduce((acc, cell, index) => {
      acc[String(index)] = cell.textContent?.trim() || '';
      return acc;
    }, {} as Record<string, string>);
  });

  // Export based on format
  switch (format) {
    case 'csv':
      DataExporter.toCSV(rows, headers, options);
      break;
    case 'pdf':
      DataExporter.toPDF(rows, headers, options);
      break;
    case 'excel':
      DataExporter.toExcel(rows, headers, options);
      break;
  }
}
