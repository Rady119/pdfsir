import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge';
export const preferredRegion = 'fra1';


// Configure response headers
const responseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-cache'
}

export async function OPTIONS() {
  return new Response(null, { headers: responseHeaders })
}

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!process.env.CONVERTAPI_SECRET) {
      throw new Error('CONVERTAPI_SECRET environment variable is not set')
    }

    const formData = await request.formData()
    const file = formData.get('file') as Blob
    const quality = Number(formData.get('quality') || '80')
    
    if (!file) {
      return NextResponse.json({ 
        error: 'No file provided' 
      }, { 
        status: 400,
        headers: responseHeaders 
      })
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({
        error: 'حجم الملف يتجاوز الحد الأقصى (10 ميجابايت)'
      }, { 
        status: 413,
        headers: responseHeaders 
      })
    }

    try {
      console.log('Starting PDF compression...')
      
      // Create URL with parameters for PDF compression
      const secret = process.env.CONVERTAPI_SECRET
      const apiUrl = `https://v2.convertapi.com/compress/pdf?Secret=${secret}&StoreFile=true`
      
      // Create form data with compression parameters
      const apiFormData = new FormData()
      apiFormData.append('File', file)
      apiFormData.append('StoreFile', 'true')
      // Convert quality (1-100) to compression level (1-10)
      const compressionLevel = Math.round(((100 - quality) / 100) * 9) + 1
      apiFormData.append('Level', compressionLevel.toString())
      
      // Make the API request
      console.log('Making compression request to ConvertAPI...')
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: apiFormData
      })

      // Log response details for debugging
      console.log('Response status:', response.status)
      console.log('Response type:', response.headers.get('content-type'))
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        throw new Error('فشل ضغط الملف')
      }

      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const responseData = await response.json()
        console.log('Received JSON response:', JSON.stringify(responseData, null, 2))
        
        if (!responseData.Files?.[0]?.Url) {
          throw new Error('لم يتم استلام رابط الملف المضغوط')
        }

        // Download compressed file
        console.log('Downloading from:', responseData.Files[0].Url)
        const fileResponse = await fetch(responseData.Files[0].Url)
        if (!fileResponse.ok) {
          throw new Error('فشل تحميل الملف المضغوط')
        }

        const compressedFile = await fileResponse.arrayBuffer()
        console.log('Downloaded file size:', compressedFile.byteLength)
        console.log('Compression ratio:', ((1 - (compressedFile.byteLength / file.size)) * 100).toFixed(1) + '%')

        return new Response(compressedFile, {
          headers: {
            ...responseHeaders,
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="compressed.pdf"`,
          },
        })
      } else {
        // Direct file response
        const compressedFile = await response.arrayBuffer()
        console.log('Received direct file response, size:', compressedFile.byteLength)
        console.log('Compression ratio:', ((1 - (compressedFile.byteLength / file.size)) * 100).toFixed(1) + '%')

        return new Response(compressedFile, {
          headers: {
            ...responseHeaders,
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="compressed.pdf"`,
          },
        })
      }

    } catch (compressionError: any) {
      console.error('Compression error:', compressionError)
      return NextResponse.json({
        error: compressionError.message || 'فشل ضغط الملف. الرجاء المحاولة مرة أخرى'
      }, { 
        status: 422,
        headers: responseHeaders 
      })
    }
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json({
      error: 'حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى'
    }, { 
      status: 500,
      headers: responseHeaders 
    })
  }
}
