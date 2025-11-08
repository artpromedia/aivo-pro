/**
 * Export Hooks
 */

import { useState } from 'react';
import { DataExporter, type ExportColumn, type ExportOptions } from './exporter';

export function useExport<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn[]
) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = async (options?: ExportOptions) => {
    setIsExporting(true);
    try {
      DataExporter.toCSV(data, columns, options);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async (options?: ExportOptions) => {
    setIsExporting(true);
    try {
      DataExporter.toPDF(data, columns, options);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = async (options?: ExportOptions) => {
    setIsExporting(true);
    try {
      DataExporter.toJSON(data, options);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = async (options?: ExportOptions) => {
    setIsExporting(true);
    try {
      DataExporter.toExcel(data, columns, options);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportToCSV,
    exportToPDF,
    exportToJSON,
    exportToExcel,
  };
}
