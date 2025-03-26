'use client';

import { FileUpload } from '@/components/FileUpload';
import { ProcessingOptions } from '@/types';
import { FormEvent, useState } from 'react';
import { DocumentIcon, ArrowDownIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [isMerging, setIsMerging] = useState(false);

  const [fileOrder, setFileOrder] = useState<string[]>([]);

  const options: ProcessingOptions = {
    type: 'merge',
    settings: {
      order: fileOrder
    }
  };

  const handleUpload = async (uploadedFile: File) => {
    if (!uploadedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are allowed');
      return;
    }

    setFiles(prev => [...prev, uploadedFile]);
    setFileOrder(prev => [...prev, uploadedFile.name]);
    setError('');
    return Promise.resolve();
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFileOrder(prev => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async (e: FormEvent) => {
    e.preventDefault();
    if (files.length < 2) {
      setError('Please upload at least 2 PDF files to merge');
      return;
    }

    setIsMerging(true);
    setError('');
    setProgress(0);

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    try {
      const response = await fetch('/api/merge', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to merge PDFs');
      }

      // Create blob from response and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      // Clear files after successful merge
      setFiles([]);
    } catch (err: any) {
      console.error('Merge error:', err);
      setError(err.message);
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setIsMerging(false);
      setProgress(0);
    }
  };

  const handleProgress = (value: number) => {
    setProgress(value);
  };

  return (
    <div className="container px-4 mx-auto min-h-screen">
      <div className="max-w-xl mx-auto pt-20">
        <div className="mt-[1cm] backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">Merge PDFs</h2>

            {/* File List */}
            {files.length > 0 && (
              <div className="mb-6 space-y-3">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Files</h3>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <DocumentIcon className="h-5 w-5 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
                        {file.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                      aria-label="Remove file"
                    >
                      <TrashIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* File Upload */}
            <FileUpload
              onUpload={handleUpload}
              options={options}
              accept=".pdf"
              onProgress={handleProgress}
              isProcessing={isMerging}
              processingText={`Merging PDFs... ${progress}%`}
            />

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-100/80 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
                {error}
              </div>
            )}

            {/* Merge Button */}
            {files.length >= 2 && (
              <button
                onClick={handleMerge}
                disabled={isMerging}
                className={`mt-6 w-full py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center space-x-2 ${
                  isMerging
                    ? 'bg-gray-400 cursor-not-allowed dark:bg-gray-600'
                    : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 dark:bg-yellow-500 dark:hover:bg-yellow-600'
                }`}
              >
                <span>{isMerging ? 'Merging...' : 'Merge PDFs'}</span>
                {!isMerging && <ArrowDownIcon className="h-5 w-5" />}
              </button>
            )}

            {/* Instructions */}
            <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Upload two or more PDF files</li>
                <li>Files will be merged in the order they are uploaded</li>
                <li>Maximum file size: 10MB per file</li>
                <li>The merged PDF will automatically download once ready</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}