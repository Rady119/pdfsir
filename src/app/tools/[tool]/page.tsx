'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { ProcessingOptions, ToolSettings, PDFFile, ToolType } from '@/types'
import { useTranslation } from 'react-i18next'
import { FileList } from '@/components/FileList'

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

export default function ToolPage() {
  const params = useParams()
  const tool = params?.tool as string
  
  // Validate tool type
  const validTools = ['merge', 'split', 'compress', 'convert']
  if (!validTools.includes(tool)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">
          الأداة غير موجودة
        </h1>
      </div>
    )
  }

  const { t } = useTranslation()
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const [settings, setSettings] = useState<ToolSettings[ToolType]>(() => {
    switch (tool as ToolType) {
      case 'compress':
        return { quality: 80 }
      case 'split':
        return { pageRange: '1-2' }
      case 'convert':
        return { outputFormat: 'docx' }
      case 'merge':
        return { order: [] }
      default:
        return { outputFormat: 'docx' }
    }
  })

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
      if (tool === 'convert' && settings && 'outputFormat' in settings) {
        formData.append('format', settings.outputFormat)
      }

      setProgress(30)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

      try {
        const response = await fetch('/api/convert', {
          method: 'POST',
          body: formData,
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'فشل التحويل')
        }

        setProgress(70)
        const blob = await response.blob()
        
        // Validate the response blob
        if (blob.size === 0) {
          throw new Error('الملف المحول فارغ')
        }

        setProgress(90)

        // Create and trigger download
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = file.name.replace('.pdf', '.docx')
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        setProgress(100)
      } catch (err: any) {
        if (err.name === 'AbortError') {
          throw new Error('معالجة الملف استغرقت وقتاً طويلاً. الرجاء تجربة ملف أصغر.')
        }
        throw err
      }
    } catch (error: any) {
      console.error('Processing error:', error)
      setProgress(0)
      
      // Handle specific error cases
      let errorMessage = error.message || 'فشل معالجة الملف. الرجاء المحاولة مرة أخرى.'
      setError(errorMessage)
      showErrorToast(errorMessage)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white capitalize">
        {t(`tools.${tool}.title`)}
      </h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-right">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <p className="text-gray-600 dark:text-gray-300 text-right">
          {t(`tools.${tool}.description`)}
        </p>
      </div>

      <div className="relative">
        {progress > 0 && progress < 100 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-lg mb-3">جاري التحويل... {progress}%</div>
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
          options={{ type: tool as ProcessingOptions['type'], settings }}
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
