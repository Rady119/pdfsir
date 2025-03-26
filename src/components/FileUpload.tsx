'use client'

import { useState, useRef } from 'react'
import { ProcessingOptions } from '@/types'

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>
  options: ProcessingOptions
  accept?: string
  onProgress?: (progress: number) => void
  isProcessing?: boolean
  processingText?: string
}

export function FileUpload({ 
  onUpload, 
  options, 
  accept = '.pdf', 
  onProgress,
  isProcessing = false,
  processingText = 'Processing...'
}: FileUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setLoading(true)
    setError('')
    try {
      await onUpload(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    const pdfFiles = droppedFiles.filter(file => file.type === 'application/pdf')
    
    if (pdfFiles.length === 0) {
      setError('Please drop PDF files only')
      return
    }

    try {
      setLoading(true)
      setError('')
      await onUpload(pdfFiles[0])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div 
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (!isDragging && !isProcessing) setIsDragging(true)
        }}
        onDragEnter={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (!isProcessing) setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
            setIsDragging(false)
          }
        }}
        onDrop={handleDrop}
        className={`
          w-full p-8 border-2 border-dashed rounded-lg 
          transition-all duration-200 ease-in-out
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 hover:border-blue-500 dark:border-gray-600'
          }
          ${isProcessing || loading 
            ? 'opacity-75 cursor-wait' 
            : 'cursor-pointer hover:shadow-lg hover:scale-105'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
          disabled={loading || isProcessing}
        />
        
        <div className="text-center space-y-4">
          <div className="text-5xl">
            {isDragging ? '📄' : '📁'}
          </div>
          <div className="text-lg">
            {loading || isProcessing
              ? processingText || `Processing... ${progress}%`
              : isDragging
                ? 'Drop your PDF here'
                : 'Drag & drop your PDF here or click to browse'
            }
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Supports PDF files up to 10MB
          </div>
        </div>

        {(loading || isProcessing) && (
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-4">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}
