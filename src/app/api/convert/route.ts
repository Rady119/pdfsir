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
        : {
            docx: 'pdf/to/docx,pdf/to/pdfdoc'
          };

      if (!format || !supportedFormats[format as string]) {
        throw new Error(`Format not supported: ${format}`);
      }

      const baseUrls = [
        'https://v1.convertapi.com',
        'https://v2.convertapi.com',
        'https://api.convertapi.com'
      ];

      let response;
      let lastError;
      
      // Try different API endpoints with retry logic
      for (const baseUrl of baseUrls) {
        let attempts = 0;
        const maxAttempts = 3;
        // Increase timeout for DOCX conversions as they take longer
        const conversionTimeout = format === 'docx' ? 300 : 180;
        const conversionPath = isImageToPdf ? `${file.type.split('/')[1]}/to/pdf` : supportedFormats[format as string];
        const apiUrl = `${baseUrl}/convert/${conversionPath}?Secret=${convertApiSecret}&StoreFile=true&Timeout=${conversionTimeout}`;

        // Debug logging
        console.log('Conversion request:', {
          baseUrl,
          conversionPath,
          format,
          isImageToPdf,
          fileType: file.type,
          fileName: file.name
        });

        while (attempts < maxAttempts) {
          try {
            console.log(`Trying ${baseUrl}, attempt ${attempts + 1} of ${maxAttempts}...`);

            // Create blob with proper content type
            const sourceFileBuffer = await file.arrayBuffer();
            const contentType = isImageToPdf ? file.type : 'application/pdf';
            const fileBlob = new Blob([sourceFileBuffer], { type: contentType });
            
            // Create form data with all parameters
            const apiFormData = new FormData();
            apiFormData.append('File', fileBlob, file.name);
            apiFormData.append('StoreFile', 'true');
            apiFormData.append('Timeout', '180');
            
            // Add specific parameters for PDF to DOCX conversion
            if (!isImageToPdf && format === 'docx') {
              apiFormData.append('OCR', 'true');
              apiFormData.append('TextRecognition', 'true');
              apiFormData.append('FromPage', '1');
              apiFormData.append('ToPage', '0'); // 0 means all pages
            }

            const controller = new AbortController();
            const timeoutMs = format === 'docx' ? 300000 : 180000; // 5 minutes for DOCX, 3 minutes for others
            const timeout = setTimeout(() => controller.abort(), timeoutMs);

            const fetchResponse = await fetch(apiUrl, {
              method: 'POST',
              body: apiFormData,
              signal: controller.signal
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

            response = await fetchResponse.json();
            
            // If successful, break out of both loops
            if (response) {
              console.log('Conversion request successful');
              break;
            }
          } catch (err: any) {
            lastError = err;
            
            if (err.name === 'AbortError') {
              const timeoutMessage = format === 'docx'
                ? 'عملية تحويل PDF إلى Word استغرقت وقتاً طويلاً. يرجى المحاولة مع ملف أصغر حجماً'
                : 'عملية التحويل استغرقت وقتاً طويلاً. يرجى المحاولة مرة أخرى';
              console.error('Request timed out:', format === 'docx' ? '5 minutes' : '3 minutes');
              throw new Error(timeoutMessage);
            }
            
            console.error(`Attempt ${attempts + 1} failed:`, err.message);
            
            // Wait before retrying (exponential backoff)
            await delay(Math.pow(2, attempts) * 1000);
            attempts++;
          }
        }

        // If we got a successful response, break out of the baseUrl loop
        if (response) {
          break;
        }
      }

      // If all attempts failed
      if (!response) {
        throw lastError || new Error('All conversion attempts failed');
      }

      console.log('Processing response...');

      if (!response?.Files?.[0]?.Url) {
        throw new Error('لم يتم استلام رابط الملف المحول');
      }

      // Download converted file
      console.log('Downloading converted file...');
     const controller = new AbortController();
     const timeout = setTimeout(() => controller.abort(), 60000); // 1 minute timeout for download

     const fileResponse = await fetch(response.Files[0].Url, {
       signal: controller.signal
     }).finally(() => clearTimeout(timeout));

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

      // Create a structured error response
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
    // Create a structured error response for general errors
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
