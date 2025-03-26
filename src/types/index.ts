import { mock } from "node:test";

export interface PDFFile {
  id: string;
  fileName: string;
  originalName?: string;
  path?: string;
  size: number;
  createdAt: Date;
  status: 'processed' | 'processing' | 'error';
  url?: string;
  thumbnailUrl?: string;
  processingType?: 'compress' | 'convert' | 'merge' | 'split';
  userId: string;
}

export interface UserProfile {
  id: string;
  email: string;
  subscription: string;
  usageLimit: number;
  usedStorage: number;
  totalFiles: number;
  createdAt: Date;
}
export interface ProcessingOptions {
  type: ToolType;
  settings: ToolSettings[ToolType];
}

export interface ToolSettings {
  compress: {
    quality: number;
  };
  split: {
    pageRange: string;
  };
  convert: {
    outputFormat: string;
    isImageToPdf?: boolean;
  };
  merge: {
    order: string[];
  };
}

export type ToolType = keyof ToolSettings;

export interface FileListProps {
  files: File[];
  currentPage: number;
  filesPerPage: number;
  onPageChange: (page: number) => void;
  onRemove: (index: number) => void;
  searchTerm?: string;
  onSearch?: (term: string) => void;
  sortBy?: 'name' | 'date' | 'size';
  onSort?: (sortBy: 'name' | 'date' | 'size') => void;
}

export interface MockFile {
  name: string;
  size: number;
  data: ArrayBuffer;
  id: string;
}
