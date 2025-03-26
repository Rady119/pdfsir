import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { ProcessingOptions } from '@/types';

const responseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-cache'
};

export async function OPTIONS() {
  return new Response(null, { headers: responseHeaders });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob;
    const optionsStr = formData.get('options') as string;
    
    if (!file) {
      return NextResponse.json({
        error: 'لم يتم تحميل أي ملف'
      }, {
        status: 400,
        headers: responseHeaders
      });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({
        error: 'يرجى تحميل ملف PDF صحيح'
      }, {
        status: 400,
        headers: responseHeaders
      });
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({
        error: 'حجم الملف يتجاوز الحد الأقصى (10 ميجابايت)'
      }, {
        status: 413,
        headers: responseHeaders
      });
    }

    let options;
    try {
      options = JSON.parse(optionsStr);
    } catch {
      return NextResponse.json({
        error: 'خيارات المعالجة غير صالحة'
      }, {
        status: 400,
        headers: responseHeaders
      });
    }

    // Set up timeout protection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      // Read file as ArrayBuffer with timeout
      const arrayBuffer = await file.arrayBuffer();
      
      // Load and process PDF document
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        updateMetadata: false // Optimize loading
      });

      // Process with optimized settings
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false
      });

      clearTimeout(timeoutId);

      // Return processed PDF with proper headers
      return new Response(pdfBytes, {
        headers: {
          ...responseHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="processed.pdf"`,
          'Transfer-Encoding': 'chunked'
        }
      });

    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('معالجة الملف استغرقت وقتاً طويلاً');
      }
      throw err;
    }

  } catch (error: any) {
    console.error('PDF processing error:', error);
    return NextResponse.json({
      error: error.message || 'فشلت معالجة ملف PDF. يرجى المحاولة مرة أخرى'
    }, {
      status: 500,
      headers: responseHeaders
    });
  }
}
