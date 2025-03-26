'use client';

import { FileUpload } from '@/components/FileUpload';
import { ProcessingOptions } from '@/types';
import { FormEvent, useEffect, useState } from 'react';

type ConversionFormat = 'docx' | 'pdf';

const MAX_FREE_CONVERSIONS = 3;

export default function ConvertPage() {
  const [selectedFormat, setSelectedFormat] = useState<ConversionFormat>('pdf');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [acceptedFiles, setAcceptedFiles] = useState<string>('.jpg,.jpeg,.png');
  const [conversionCount, setConversionCount] = useState(0);
  const [showSubscription, setShowSubscription] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  // Load conversion count from localStorage on mount
  useEffect(() => {
    const count = parseInt(localStorage.getItem('conversionCount') || '0');
    setConversionCount(count);
    setShowSubscription(count >= MAX_FREE_CONVERSIONS);
  }, []);

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
      localStorage.setItem('isSubscribed', 'true');
      setShowSubscription(false);
    } catch (err) {
      setError('فشل في الاشتراك. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleConvert = async (file: File) => {
    if (conversionCount >= MAX_FREE_CONVERSIONS && !localStorage.getItem('isSubscribed')) {
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
      const timeout = setTimeout(() => controller.abort(), 300000);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      }).finally(() => clearTimeout(timeout));

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
      localStorage.setItem('conversionCount', newCount.toString());
      
      if (newCount >= MAX_FREE_CONVERSIONS && !localStorage.getItem('isSubscribed')) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Responsive Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">PDF Tools</h1>
            </div>
            <div className="flex items-center">
              {!localStorage.getItem('isSubscribed') && (
                <span className="hidden sm:block text-sm text-gray-600 text-right" dir="rtl">
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
            {selectedFormat === 'pdf' ? 'Convert Images to PDF' : 'Convert PDF'}
          </h2>
          
          {/* Format Selection */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              {selectedFormat === 'pdf' ? 'Convert from:' : 'Convert to:'}
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as ConversionFormat)}
              className="w-full px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300"
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
              <div className="p-3 sm:p-4 bg-red-100 text-red-700 rounded-lg text-right" dir="rtl">
                {error}
              </div>
            </div>
          )}

          {/* Subscription Form */}
          {showSubscription && (
            <div className="mb-6 sm:mb-8">
              <div className="p-6 sm:p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-right">
                  لقد استخدمت الحد الأقصى للتحويلات المجانية
                </h3>
                <p className="text-gray-600 mb-4 text-right">
                  للاستمرار في استخدام الخدمة، يرجى الاشتراك عن طريق إدخال بريدك الإلكتروني
                </p>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="البريد الإلكتروني"
                    className="w-full px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
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
          {!showSubscription && !localStorage.getItem('isSubscribed') && (
            <div className="sm:hidden mb-6">
              <p className="text-sm text-gray-600 text-center" dir="rtl">
                التحويلات المتبقية: {MAX_FREE_CONVERSIONS - conversionCount}
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="text-sm text-gray-600 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold mb-3 text-lg">Instructions:</h2>
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