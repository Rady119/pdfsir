import { NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'
import { ProcessingOptions } from '@/types'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as Blob
    const optionsStr = formData.get('options') as string
    const options = JSON.parse(optionsStr)

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    
    // Load PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    
    // For now, just return the PDF with minimal processing
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    })

    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="processed.pdf"`,
      },
    })

  } catch (error) {
    console.error('PDF processing error:', error)
    return NextResponse.json({ 
      error: 'PDF processing failed. Please try again.' 
    }, { 
      status: 500 
    })
  }
}
