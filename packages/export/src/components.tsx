/**
 * Export Components
 */

import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileJson } from 'lucide-react';
import { useExport } from './hooks';
import type { ExportColumn, ExportOptions } from './exporter';

export interface ExportButtonProps<T extends Record<string, any>> {
  data: T[];
  columns: ExportColumn[];
  format: 'csv' | 'pdf' | 'json' | 'excel';
  options?: ExportOptions;
  children?: string;
  className?: string;
}

export function ExportButton<T extends Record<string, any>>({
  data,
  columns,
  format,
  options,
  children,
  className = '',
}: ExportButtonProps<T>) {
  const { isExporting, exportToCSV, exportToPDF, exportToJSON, exportToExcel } = useExport(
    data,
    columns
  );

  const handleExport = () => {
    switch (format) {
      case 'csv':
        exportToCSV(options);
        break;
      case 'pdf':
        exportToPDF(options);
        break;
      case 'json':
        exportToJSON(options);
        break;
      case 'excel':
        exportToExcel(options);
        break;
    }
  };

  const icons = {
    csv: FileSpreadsheet,
    pdf: FileText,
    json: FileJson,
    excel: FileSpreadsheet,
  };

  const Icon = icons[format];

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`
        px-4 py-2 rounded-lg bg-coral text-white
        hover:bg-coral-dark disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-2 transition-colors
        ${className}
      `}
    >
      <Icon className="w-4 h-4" />
      {children || `Export ${format.toUpperCase()}`}
    </button>
  );
}

export interface ExportMenuProps<T extends Record<string, any>> {
  data: T[];
  columns: ExportColumn[];
  options?: ExportOptions;
  className?: string;
}

export function ExportMenu<T extends Record<string, any>>({
  data,
  columns,
  options,
  className = '',
}: ExportMenuProps<T>) {
  const { isExporting, exportToCSV, exportToPDF, exportToJSON, exportToExcel } = useExport(
    data,
    columns
  );

  const exportFormats = [
    { format: 'csv' as const, label: 'CSV', icon: FileSpreadsheet, action: exportToCSV },
    { format: 'excel' as const, label: 'Excel', icon: FileSpreadsheet, action: exportToExcel },
    { format: 'pdf' as const, label: 'PDF', icon: FileText, action: exportToPDF },
    { format: 'json' as const, label: 'JSON', icon: FileJson, action: exportToJSON },
  ];

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white border rounded-lg shadow-lg p-2 space-y-1">
        <div className="px-3 py-2 text-sm font-medium text-gray-700 border-b">
          Export as
        </div>
        
        {exportFormats.map(({ format, label, icon: Icon, action }) => (
          <button
            key={format}
            onClick={() => action(options)}
            disabled={isExporting}
            className="
              w-full px-3 py-2 rounded text-left
              hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2 transition-colors
            "
          >
            <Icon className="w-4 h-4 text-gray-600" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export interface ExportDropdownProps<T extends Record<string, any>> {
  data: T[];
  columns: ExportColumn[];
  options?: ExportOptions;
  buttonLabel?: string;
  className?: string;
}

export function ExportDropdown<T extends Record<string, any>>({
  data,
  columns,
  options,
  buttonLabel = 'Export',
  className = '',
}: ExportDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          px-4 py-2 rounded-lg bg-coral text-white
          hover:bg-coral-dark transition-colors
          flex items-center gap-2
        "
      >
        <Download className="w-4 h-4" />
        {buttonLabel}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 z-20">
            <ExportMenu data={data} columns={columns} options={options} />
          </div>
        </>
      )}
    </div>
  );
}
