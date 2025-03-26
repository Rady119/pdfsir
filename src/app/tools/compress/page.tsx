'use client'

import { useCallback, useState } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { ProcessingOptions, PDFFile } from '@/types'
import { useTranslation } from 'react-i18next'
import { FileList } from '@/components/FileList'

// Show error toast function
const showErrorToast = (message: string) => {
  const errorDiv = document.createElement('div')
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f44336;
    color: white;
    padding: 16px 24px;
    border-radius: 4px;
    z-index: 1000;
    direction: rtl;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `
  errorDiv.textContent = message
  document.body.appendChild(errorDiv)
  
  // Fade in
  setTimeout(() => {
    errorDiv.style.opacity = '1'
  }, 100)
  
  // Fade out and remove
  setTimeout(() => {
    errorDiv.style.opacity = '0'
    setTimeout(() => document.body.removeChild(errorDiv), 300)
  }, 4700)
}

export default function CompressPDFPage() {
  const { t } = useTranslation()
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [quality, setQuality] = useState(80)
  const [files, setFiles] = useState<File[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const filesPerPage = 5
  const [processedFiles, setProcessedFiles] = useState<PDFFile[]>([])

  const handleUpload = async (file: File) => {
    setError(null)
    try {
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        throw new Error('حجم الملف يتجاوز الحد الأقصى (10 ميجابايت)')
      }

      setProgress(10)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('quality', quality.toString())

      setProgress(30)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

      try {
        console.log('Starting compression request with quality:', quality)
        const response = await fetch('/api/compress', {
          method: 'POST',
          body: formData,
          signal: controller.signal,
          headers: {
            'Accept': 'application/json, application/pdf'
          }
        })

        clearTimeout(timeoutId)
        console.log('Response received:', response.status, response.headers.get('content-type'))

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'فشل الضغط')
        }

        setProgress(70)
        const blob = await response.blob()
        
        // Validate the response blob
        if (blob.size === 0) {
          throw new Error('الملف المضغوط فارغ')
        }

        // Calculate compression ratio
        const compressionRatio = ((1 - (blob.size / file.size)) * 100).toFixed(1)
        console.log(`Compression achieved: ${compressionRatio}%`)

        setProgress(90)

        // Create and trigger download
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = file.name.replace('.pdf', '_compressed.pdf')
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        setProgress(100)

        // Show success message with compression ratio
        const successDiv = document.createElement('div')
        successDiv.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #4caf50;
          color: white;
          padding: 16px 24px;
          border-radius: 4px;
          z-index: 1000;
          direction: rtl;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `
        successDiv.textContent = `تم ضغط الملف بنجاح! نسبة الضغط: ${compressionRatio}%`
        document.body.appendChild(successDiv)
        
        setTimeout(() => {
          successDiv.style.opacity = '1'
        }, 100)
        
        setTimeout(() => {
          successDiv.style.opacity = '0'
          setTimeout(() => document.body.removeChild(successDiv), 300)
        }, 4700)

      } catch (err: any) {
        if (err.name === 'AbortError') {
          throw new Error('معالجة الملف استغرقت وقتاً طويلاً. الرجاء تجربة ملف أصغر.')
        }
        throw err
      }
    } catch (error: any) {
      console.error('Processing error:', error)
      setProgress(0)
      setError(error.message || 'فشل معالجة الملف. الرجاء المحاولة مرة أخرى.')
      showErrorToast(error.message || 'فشل معالجة الملف. الرجاء المحاولة مرة أخرى.')
    }
  }

  const getQualityLabel = useCallback((value: number) => {
    if (value <= 30) return 'ضغط عالي (جودة منخفضة)'
    if (value <= 60) return 'ضغط متوسط'
    return 'ضغط منخفض (جودة عالية)'
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white text-right">
        ضغط ملفات PDF
      </h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-right">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <p className="text-gray-600 dark:text-gray-300 text-right">
          اختر مستوى الضغط المطلوب واختر ملف PDF لضغطه
        </p>
      </div>

      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 text-right mb-2">
            مستوى الضغط: {getQualityLabel(quality)}
          </label>
          <input 
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span>ضغط عالي</span>
            <span>جودة عالية</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {progress > 0 && progress < 100 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-lg mb-3">جاري ضغط الملف... {progress}%</div>
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}
        
        <FileUpload 
          onUpload={handleUpload} 
          options={{ 
            type: 'compress' as ProcessingOptions['type'],
            settings: { quality }
          }}
          onProgress={setProgress}
        />
      </div>

      <FileList 
        files={files}
        currentPage={currentPage}
        filesPerPage={filesPerPage}
        onPageChange={setCurrentPage}
        onRemove={(index: number) => setFiles(files.filter((_, i) => i !== index))}
      />
    </div>
  )
}