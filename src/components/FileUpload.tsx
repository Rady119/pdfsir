'use client'

import { useState, useRef } from 'react'
import { ProcessingOptions } from '@/types'
import { CloudArrowUpIcon, DocumentIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

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
  const [isCompleted, setIsCompleted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setLoading(true)
    setError('')
    setIsCompleted(false)
    try {
      await onUpload(file)
      setIsCompleted(true)
      // Reset completion status after 3 seconds
      setTimeout(() => setIsCompleted(false), 3000)
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
      setIsCompleted(false)
      await onUpload(pdfFiles[0])
      setIsCompleted(true)
      // Reset completion status after 3 seconds
      setTimeout(() => setIsCompleted(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const getBorderColor = () => {
    if (isCompleted) return 'border-green-500'
    if (isDragging) return 'border-blue-400'
    if (isProcessing || loading) return 'border-yellow-400'
    return 'border-gray-200 hover:border-blue-400'
  }

  const getBackgroundColor = () => {
    if (isCompleted) return 'bg-green-50 dark:bg-green-900/20'
    if (isDragging) return 'bg-blue-50 dark:bg-blue-900/20'
    if (isProcessing || loading) return 'bg-yellow-50 dark:bg-yellow-900/20'
    return 'bg-white dark:bg-gray-800'
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
          relative w-full p-8 border-2 border-dashed rounded-xl
          transition-all duration-300 ease-in-out
          ${getBorderColor()}
          ${getBackgroundColor()}
          ${isProcessing || loading 
            ? 'opacity-90 cursor-wait' 
            : 'cursor-pointer transform hover:shadow-lg hover:scale-102 hover:shadow-blue-100 dark:hover:shadow-blue-900/30'
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
        
        <div className="text-center space-y-6">
          {isCompleted ? (
            <div className="flex justify-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500" />
            </div>
          ) : (
            <div className="flex justify-center">
              {isDragging ? (
                <DocumentIcon className="w-16 h-16 text-blue-500 animate-pulse" />
              ) : (
                <CloudArrowUpIcon className="w-16 h-16 text-blue-400" />
              )}
            </div>
          )}
          
          <div className="text-lg font-medium text-gray-700 dark:text-gray-200">
            {loading || isProcessing
              ? processingText || `Processing... ${progress}%`
              : isCompleted
                ? 'Conversion completed!'
                : isDragging
                  ? 'Drop your file here'
                  : 'Drag & drop your file here or click to browse'
            }
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Supports {accept.replace(/\./g, '').toUpperCase()} files up to 10MB
          </div>
        </div>

        {(loading || isProcessing) && (
          <div className="w-full mt-6">
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
