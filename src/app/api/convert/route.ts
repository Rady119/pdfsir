import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const responseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-cache'
};

export async function OPTIONS() {
  return new Response(null, { headers: responseHeaders });
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ConvertAPIResponse {
  Files?: Array<{ Url: string }>;
}

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const convertApiSecret = process.env.CONVERTAPI_SECRET;
    if (!convertApiSecret) {
      throw new Error('CONVERTAPI_SECRET environment variable is not set');
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const format = formData.get('format');
    const isImageToPdf = formData.get('isImageToPdf') === 'true';
    
    if (!file) {
      return NextResponse.json({ 
        error: 'No file provided'
      }, { 
        status: 400,
        headers: responseHeaders 
      });
    }

    // Validate file type based on conversion direction
    if (isImageToPdf) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        return NextResponse.json({ 
          error: 'Invalid file type. Please provide a JPEG or PNG image'
        }, { 
          status: 400,
          headers: responseHeaders 
        });
      }
    } else {
      if (file.type !== 'application/pdf') {
        return NextResponse.json({ 
          error: 'Invalid file type. Please provide a PDF file'
        }, { 
          status: 400,
          headers: responseHeaders 
        });
      }
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({
        error: 'حجم الملف يتجاوز الحد الأقصى (10 ميجابايت)'
      }, { 
        status: 413,
        headers: responseHeaders 
      });
    }

    try {
      console.log('Starting conversion...', {
        format,
        isImageToPdf,
        fileType: file.type,
        fileSize: file.size
      });
      
      // Validate format
      const supportedFormats: Record<string, string> = isImageToPdf
        ? { pdf: 'jpg/to/pdf,png/to/pdf' }
        : { docx: 'pdf/to/docx,pdf/to/pdfdoc' };

      if (!format || !supportedFormats[format as string]) {
        throw new Error(`Format not supported: ${format}`);
      }

      const baseUrl = 'https://v2.convertapi.com';
      const conversionTimeout = format === 'docx' ? 120 : 60;
      const conversionPath = isImageToPdf ? `${file.type.split('/')[1]}/to/pdf` : supportedFormats[format as string];
      const apiUrl = `${baseUrl}/convert/${conversionPath}?Secret=${convertApiSecret}&StoreFile=true&Timeout=${conversionTimeout}`;

      let convertedResponse: ConvertAPIResponse | null = null;
      let conversionError: Error | null = null;

      // Debug logging
      console.log('Conversion request:', {
        baseUrl,
        conversionPath,
        format,
        isImageToPdf,
        fileType: file.type,
        fileName: file.name
      });

      const maxAttempts = 2;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          console.log(`Attempt ${attempt + 1} of ${maxAttempts}...`);

          // Create blob with proper content type
          const sourceFileBuffer = await file.arrayBuffer();
          const contentType = isImageToPdf ? file.type : 'application/pdf';
          const fileBlob = new Blob([sourceFileBuffer], { type: contentType });
          
          // Create form data with all parameters
          const apiFormData = new FormData();
          apiFormData.append('File', fileBlob, file.name);
          apiFormData.append('StoreFile', 'true');
          apiFormData.append('Timeout', conversionTimeout.toString());
          
          // Add specific parameters for PDF to DOCX conversion
          if (!isImageToPdf && format === 'docx') {
            apiFormData.append('OCR', 'true');
            apiFormData.append('TextRecognition', 'true');
            apiFormData.append('FromPage', '1');
            apiFormData.append('ToPage', '0'); // 0 means all pages
          }

          // Set a reasonable timeout for the conversion request
          const controller = new AbortController();
          const timeoutMs = format === 'docx' ? 120000 : 60000; // 2 minutes for DOCX, 1 minute for others
          const timeout = setTimeout(() => controller.abort(), timeoutMs);

          const fetchResponse = await fetch(apiUrl, {
            method: 'POST',
            body: apiFormData,
            signal: controller.signal,
            keepalive: true
          }).finally(() => clearTimeout(timeout));

          console.log('Response status:', fetchResponse.status);
          
          if (fetchResponse.status === 415) {
            const errorText = await fetchResponse.text();
            console.error('415 Error details:', errorText);
            throw new Error(`Unsupported Media Type: ${errorText}`);
          }

          if (!fetchResponse.ok) {
            throw new Error(`HTTP error! status: ${fetchResponse.status}`);
          }

          convertedResponse = await fetchResponse.json();
          console.log('Conversion request successful');
          break;

        } catch (err: any) {
          conversionError = err;
          
          if (err.name === 'AbortError') {
            const timeoutMessage = format === 'docx'
              ? 'عملية تحويل PDF إلى Word استغرقت وقتاً طويلاً. يرجى المحاولة مع ملف أصغر حجماً'
              : 'عملية التحويل استغرقت وقتاً طويلاً. يرجى المحاولة مرة أخرى';
            console.error('Request timed out:', format === 'docx' ? '2 minutes' : '1 minute');
            throw new Error(timeoutMessage);
          }
          
          console.error(`Attempt ${attempt + 1} failed:`, err.message);
          
          if (attempt < maxAttempts - 1) {
            await delay(Math.pow(2, attempt) * 1000);
          }
        }
      }

      // If all attempts failed
      if (!convertedResponse) {
        throw conversionError || new Error('All conversion attempts failed');
      }

      if (!convertedResponse.Files?.[0]?.Url) {
        throw new Error('لم يتم استلام رابط الملف المحول');
      }

      // Download converted file
      console.log('Downloading converted file...');
      const downloadController = new AbortController();
      const downloadTimeout = setTimeout(() => downloadController.abort(), 60000); // 1 minute timeout for download

      const fileResponse = await fetch(convertedResponse.Files[0].Url, {
        signal: downloadController.signal
      }).finally(() => clearTimeout(downloadTimeout));

      if (!fileResponse.ok) {
        throw new Error('Failed to download converted file');
      }

      const contentTypes = {
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        pdf: 'application/pdf'
      };

      const outputFormat = isImageToPdf ? 'pdf' : format as keyof typeof contentTypes;

      // Ensure Arabic filename is properly encoded
      const originalName = file.name.replace(/\.[^/.]+$/, ''); // Remove old extension
      const encodedFilename = encodeURIComponent(originalName);
      
      // Stream the response directly with proper headers for Arabic filename
      return new Response(fileResponse.body, {
        headers: {
          ...responseHeaders,
          'Content-Type': contentTypes[outputFormat],
          'Content-Disposition': `attachment; filename="${encodedFilename}.${outputFormat}"; filename*=UTF-8''${encodedFilename}.${outputFormat}`,
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache'
        }
      });

    } catch (conversionError: any) {
      console.error('Conversion error:', {
        message: conversionError.message,
        status: conversionError.status
      });

      let errorMessage = 'فشل التحويل';
      if (conversionError.message) {
        errorMessage += `: ${conversionError.message}`;
      }

      return NextResponse.json({
        error: errorMessage,
        details: {
          message: conversionError.message,
          type: conversionError.name,
          status: conversionError.status
        }
      }, {
        status: 422,
        headers: responseHeaders
      });
    }
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({
      error: 'حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى',
      details: {
        message: error.message || 'Unknown error',
        type: error.name || 'ServerError',
        code: 'INTERNAL_SERVER_ERROR'
      }
    }, {
      status: 500,
      headers: responseHeaders
    });
  }
}
