import { PDFDocument } from 'pdf-lib'
import { ProcessingOptions } from '@/types'
import connectDB from './db'
import { PDFFile } from '@/types'
import JSZip from 'jszip'

export async function processPDF(
  file: File, 
  options: ProcessingOptions,
  onProgress?: (progress: number) => void
): Promise<Uint8Array | Blob> {
  try {
    onProgress?.(10)
    const arrayBuffer = await file.arrayBuffer()
    onProgress?.(30)

    if (options.type === 'convert' && options.settings && 'outputFormat' in options.settings) {
      const { outputFormat } = options.settings
      const formData = new FormData()
      formData.append('file', file)
      formData.append('format', outputFormat || 'docx')
      
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Conversion failed')
      }

      onProgress?.(80)
      return await response.blob()
    }

    if (arrayBuffer.byteLength === 0) {
      throw new Error('Empty PDF file')
    }

    const pdfDoc = await PDFDocument.load(arrayBuffer)
    onProgress?.(50) // PDF parsed

    if (pdfDoc.getPageCount() === 0) {
      throw new Error('PDF has no pages')
    }

    switch (options.type) {
      case 'compress':
        return await pdfDoc.save()
      case 'split':
        if (options.settings && 'pageRange' in options.settings) {
          const pageNumbers = options.settings.pageRange
            ? parsePageRange(options.settings.pageRange)
            : [0]
          const newDoc = await PDFDocument.create()
          const pages = await newDoc.copyPages(pdfDoc, pageNumbers)
          pages.forEach(page => newDoc.addPage(page))
          return await newDoc.save()
        }
        return await pdfDoc.save()
      case 'merge':
        // Placeholder for merge logic
        return await pdfDoc.save()
      default:
        throw new Error('Unsupported operation')
    }
    onProgress?.(100) // Processing complete
  } catch (error) {
    onProgress?.(0) // Reset on error
    console.error('PDF processing error:', error)
    throw error instanceof Error ? error : new Error('PDF processing failed')
  }
}

export async function processPDFBatch(
  files: File[],
  options: ProcessingOptions,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  onProgress?.(0)
  const pdfDocs = await Promise.all(
    files.map(async (file, index) => {
      const arrayBuffer = await file.arrayBuffer()
      onProgress?.(Math.round((index + 1) / files.length * 50))
      return await PDFDocument.load(arrayBuffer)
    })
  )

  const mergedPdf = await PDFDocument.create()
  
  for (let i = 0; i < pdfDocs.length; i++) {
    const pages = await mergedPdf.copyPages(pdfDocs[i], pdfDocs[i].getPageIndices())
    pages.forEach(page => mergedPdf.addPage(page))
    onProgress?.(Math.round(50 + ((i + 1) / pdfDocs.length * 50)))
  }

  return await mergedPdf.save()
}

export async function saveProcessedFile(
  userId: string,
  file: File,
  processedData: Uint8Array
): Promise<PDFFile> {
  await connectDB()
  
  const fileDoc: PDFFile = {
    id: crypto.randomUUID(),
    userId,
    fileName: file.name,
    originalName: file.name,
    path: `/uploads/${userId}/${file.name}`,
    size: processedData.length,
    createdAt: new Date(),
    status: 'processed',
    processingType: 'compress'
  }

  // Save to database logic here
  
  return fileDoc
}

export async function createDownloadZip(
  files: PDFFile[],
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const zip = new JSZip()
  
  files.forEach((file, index) => {
    if (file.originalName && file.path) {
      zip.file(file.originalName, fetch(file.path).then(res => res.blob()))
    } else {
      console.warn('Skipping file without name or path:', file.id)
    }
    onProgress?.((index + 1) / files.length * 100)
  })

  return await zip.generateAsync({ type: 'blob' })
}

function parsePageRange(range: string): number[] {
  return range.split(',').flatMap(part => {
    const [start, end] = part.split('-').map(num => parseInt(num) - 1)
    if (typeof end === 'undefined') return [start]
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  })
}
