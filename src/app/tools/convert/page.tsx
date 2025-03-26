'use client';

import { FileUpload } from '@/components/FileUpload';
import { ProcessingOptions } from '@/types';
import { FormEvent, useEffect, useState } from 'react';

type ConversionFormat = 'docx' | 'pdf';

export default function ConvertPage() {
  const [selectedFormat, setSelectedFormat] = useState<ConversionFormat>('pdf');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [acceptedFiles, setAcceptedFiles] = useState<string>('.jpg,.jpeg,.png');

  const formats = [
    { value: 'pdf' as ConversionFormat, label: 'PDF from Images', accept: '.jpg,.jpeg,.png' },
    { value: 'docx' as ConversionFormat, label: 'Word Document (.docx)', accept: '.pdf' }
  ] as const;

  // Update accepted files when format changes
  useEffect(() => {
    const format = formats.find(f => f.value === selectedFormat);
    setAcceptedFiles(format?.accept || '.pdf');
  }, [selectedFormat]);

  const options: ProcessingOptions = {
    type: 'convert',
    settings: {
      outputFormat: selectedFormat,
      isImageToPdf: selectedFormat === 'pdf'
    }
  };

  const handleConvert = async (file: File) => {
    setIsConverting(true);
    setError('');
    setProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', selectedFormat);
    formData.append('isImageToPdf', String(selectedFormat === 'pdf'));

    try {
      console.log('Starting conversion...', {
        format: selectedFormat,
        fileSize: file.size,
        fileName: file.name,
        isImageToPdf: selectedFormat === 'pdf'
      });

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (response.status === 422) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid file or conversion settings');
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Conversion failed');
      }

      // Create blob from response and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFormat === 'pdf' 
        ? `converted.pdf`
        : `converted.${selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err: any) {
      console.error('Conversion error:', err);
      if (err.message.includes('ENOTFOUND')) {
        setError('فشل الاتصال بخدمة التحويل. يرجى التحقق من اتصال الإنترنت الخاص بك');
      } else if (err.message.includes('413')) {
        setError('حجم الملف كبير جداً. الحد الأقصى هو 10 ميجابايت');
      } else {
        setError(err.message);
      }
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  const handleProgress = (value: number) => {
    setProgress(value);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-xl mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-8 text-center mt-[1cm]">
          {selectedFormat === 'pdf' ? 'Convert Images to PDF' : 'Convert PDF'}
        </h1>
        
        {/* Format Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {selectedFormat === 'pdf' ? 'Convert from:' : 'Convert to:'}
          </label>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as ConversionFormat)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300"
            disabled={isConverting}
          >
            {formats.map(format => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <FileUpload
          onUpload={handleConvert}
          options={options}
          accept={acceptedFiles}
          onProgress={handleProgress}
          isProcessing={isConverting}
          processingText={`جاري التحويل... ${progress}%`}
        />

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 text-sm text-gray-600">
          <h2 className="font-semibold mb-2">Instructions:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              {selectedFormat === 'pdf' 
                ? 'Select images (.jpg, .jpeg, .png) to convert to PDF'
                : 'Upload a PDF file to convert to the selected format'}
            </li>
            <li>Maximum file size: 10MB</li>
            <li>The converted file will automatically download once ready</li>
          </ul>
        </div>
      </div>
    </div>
  );
}