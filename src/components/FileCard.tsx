'use client';

import { PDFFile } from '@/types';
import {
  DocumentIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface FileCardProps {
  file: PDFFile;
  onRemove: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
}

export function FileCard({ file, onRemove, onPreview, onDownload }: FileCardProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex items-start space-x-4 rtl:space-x-reverse">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            file.status === 'processed' ? 'bg-green-100 dark:bg-green-900' :
            file.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900' :
            'bg-red-100 dark:bg-red-900'
          }`}>
            <DocumentIcon className={`w-6 h-6 ${
              file.status === 'processed' ? 'text-green-600 dark:text-green-400' :
              file.status === 'processing' ? 'text-blue-600 dark:text-blue-400' :
              'text-red-600 dark:text-red-400'
            }`} />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {file.fileName}
            </p>
            <div className="rtl:flex-row-reverse flex items-center space-x-2 rtl:space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onPreview(file.id)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                title={currentLang === 'ar' ? 'معاينة' : 'Preview'}
              >
                <EyeIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDownload(file.id)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                title={currentLang === 'ar' ? 'تحميل' : 'Download'}
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => onRemove(file.id)}
                className="text-gray-400 hover:text-red-500"
                title={currentLang === 'ar' ? 'حذف' : 'Delete'}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(file.createdAt)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
            {file.processingType && (
              <>
                <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {file.processingType}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}