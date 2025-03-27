'use client';

import { FileUpload } from '@/components/FileUpload';
import { ProcessingOptions } from '@/types';
import { FormEvent, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type ConversionFormat = 'docx' | 'pdf';

const MAX_FREE_CONVERSIONS = 3;

export default function ConvertPage() {
  const [selectedFormat, setSelectedFormat] = useState<ConversionFormat>('pdf');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [acceptedFiles, setAcceptedFiles] = useState<string>('.jpg,.jpeg,.png');
  const [conversionCount, setConversionCount] = useLocalStorage('conversionCount', 0);
  const [isSubscribed, setIsSubscribed] = useLocalStorage('isSubscribed', false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  useEffect(() => {
    setShowSubscription(conversionCount >= MAX_FREE_CONVERSIONS && !isSubscribed);
  }, [conversionCount, isSubscribed]);

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

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      setShowSubscription(false);
    } catch (err) {
      setError('فشل في الاشتراك. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleConvert = async (file: File) => {
    if (conversionCount >= MAX_FREE_CONVERSIONS && !isSubscribed) {
      setShowSubscription(true);
      return;
    }

    setIsConverting(true);
    setError('');
    setProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', selectedFormat);
      formData.append('isImageToPdf', String(selectedFormat === 'pdf'));

      console.log('Starting conversion...', {
        format: selectedFormat,
        fileSize: file.size,
        fileName: file.name,
        isImageToPdf: selectedFormat === 'pdf'
      });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), selectedFormat === 'docx' ? 150000 : 90000); // 2.5 minutes for DOCX, 1.5 minutes for others

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
        keepalive: true
      }).finally(() => clearTimeout(timeout));

      if (response.status === 504) {
        throw new Error('عملية التحويل استغرقت وقتاً طويلاً. يرجى المحاولة بملف أصغر حجماً أو تقسيم الملف إلى أجزاء أصغر');
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'حدث خطأ في التحويل');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const disposition = response.headers.get('content-disposition');
      const fileName = disposition
        ? decodeURIComponent(disposition.split('filename*=UTF-8\'\'')[1])
        : `converted.${selectedFormat}`;
        
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      const newCount = conversionCount + 1;
      setConversionCount(newCount);
      
      if (newCount >= MAX_FREE_CONVERSIONS && !isSubscribed) {
        setShowSubscription(true);
      }
    } catch (err: any) {
      console.error('Conversion error:', err);

      if (err.name === 'AbortError') {
        setError('عملية التحويل استغرقت وقتاً طويلاً. يرجى المحاولة مرة أخرى بملف أصغر حجماً');
      } else if (err.message.includes('ENOTFOUND')) {
        setError('فشل الاتصال بخدمة التحويل. يرجى التحقق من اتصال الإنترنت الخاص بك');
      } else if (err.message.includes('413')) {
        setError('حجم الملف كبير جداً. الحد الأقصى هو 10 ميجابايت');
      } else {
        setError(err.message || 'حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى');
      }

      setTimeout(() => setError(''), 8000);
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  const handleProgress = (value: number) => {
    setProgress(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Responsive Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">PDF Tools</h1>
            </div>
            <div className="flex items-center">
              {!isSubscribed && (
                <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300 text-right" dir="rtl">
                  التحويلات المتبقية: {MAX_FREE_CONVERSIONS - conversionCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto pt-24 sm:pt-28 pb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800 dark:text-white">
            {selectedFormat === 'pdf' ? 'Convert Images to PDF' : 'Convert PDF'}
          </h2>
          
          {/* Format Selection */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
              {selectedFormat === 'pdf' ? 'Convert from:' : 'Convert to:'}
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as ConversionFormat)}
              className="w-full px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 dark:focus:ring-yellow-500 transition duration-300"
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
          <div className="mb-6 sm:mb-8">
            <FileUpload
              onUpload={handleConvert}
              options={options}
              accept={acceptedFiles}
              onProgress={handleProgress}
              isProcessing={isConverting}
              processingText={`جاري التحويل... ${progress}%`}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 sm:mb-8">
              <div className="p-3 sm:p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-right" dir="rtl">
                {error}
              </div>
            </div>
          )}

          {/* Subscription Form */}
          {showSubscription && (
            <div className="mb-6 sm:mb-8">
              <div className="p-6 sm:p-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-right">
                  لقد استخدمت الحد الأقصى للتحويلات المجانية
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-right">
                  للاستمرار في استخدام الخدمة، يرجى الاشتراك عن طريق إدخال بريدك الإلكتروني
                </p>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="البريد الإلكتروني"
                    className="w-full px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 dark:focus:ring-yellow-500"
                    required
                    dir="rtl"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 sm:py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50"
                  >
                    {isSubscribing ? 'جاري الاشتراك...' : 'اشترك الآن'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Mobile Conversions Counter */}
          {!showSubscription && !isSubscribed && (
            <div className="sm:hidden mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center" dir="rtl">
                التحويلات المتبقية: {MAX_FREE_CONVERSIONS - conversionCount}
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold mb-3 text-lg text-gray-800 dark:text-white">Instructions:</h2>
            <ul className="list-disc list-inside space-y-2">
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
      </main>
    </div>
  );
}