'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { PDFFile, UserProfile } from '@/types';
import { FileCard } from '@/components/FileCard';
import { UserStats } from '@/components/UserStats';
import { QuickActions } from '@/components/QuickActions';
import { Pagination } from '@/components/Pagination';
import { useTranslation } from 'react-i18next';

// Mock user profile for demonstration
const mockProfile: UserProfile = {
  id: '1',
  email: 'user@example.com',
  subscription: 'free',
  usageLimit: 5 * 1024 * 1024 * 1024, // 5GB
  usedStorage: 1.5 * 1024 * 1024 * 1024, // 1.5GB
  totalFiles: 25,
  createdAt: new Date()
};

// Mock files for demonstration
const mockFiles: PDFFile[] = Array.from({ length: 25 }, (_, i) => ({
  id: `${i + 1}`,
  fileName: `document${i + 1}.pdf`,
  size: 1024 * 1024 * (Math.random() * 5), // Random size up to 5MB
  createdAt: new Date(),
  status: ["error", "processed", "processing"][Math.floor(Math.random() * 3)] as "error" | "processed" | "processing",
  processingType: ["split", "compress", "convert", "merge"][Math.floor(Math.random() * 4)] as "split" | "compress" | "convert" | "merge",
  userId: "user123"
}));

export function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 6;
  const [files] = useState<PDFFile[]>(mockFiles);

  const totalPages = Math.ceil(files.length / filesPerPage);
  const currentFiles = files.slice(
    (currentPage - 1) * filesPerPage,
    currentPage * filesPerPage
  );

  const handleFileAction = (actionType: string) => {
    // Implement file actions (compress, convert, etc.)
    console.log(`Handle ${actionType} action`);
  };

  const handleRemoveFile = (id: string) => {
    // Implement file removal
    console.log(`Remove file ${id}`);
  };

  const handlePreviewFile = (id: string) => {
    // Implement file preview
    console.log(`Preview file ${id}`);
  };

  const handleDownloadFile = (id: string) => {
    // Implement file download
    console.log(`Download file ${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section with adjusted padding */}
        <div className="pt-24 pb-8"> {/* Increased top padding to move content below header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('WELCOME', { name: user?.email?.split('@')[0] })}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t(' To Your Personalized Dashboard')}
            </p>
          </div>
        </div>

        {/* User Stats */}
        <section className="mb-8">
          <UserStats profile={mockProfile} />
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('QuickActions')}
          </h2>
          <QuickActions onAction={handleFileAction} />
        </section>

        {/* Recent Files */}
        <section className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('RecentFiles')}
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentFiles.length > 0 ? (
                currentFiles.map((file) => (
                  <div key={file.id} className="px-6 py-4">
                    <FileCard
                      file={file}
                      onRemove={handleRemoveFile}
                      onPreview={handlePreviewFile}
                      onDownload={handleDownloadFile}
                    />
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('NoFiles')}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {files.length > filesPerPage && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}