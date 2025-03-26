import { PDFDocument } from 'pdf-lib';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // استلام البيانات
    const formData = await request.formData();
    const files: File[] = [];

    // تجميع الملفات من النموذج
    for (let i = 0; formData.get(`file${i}`); i++) {
      const file = formData.get(`file${i}`) as File;
      if (!file) break;
      files.push(file);
    }

    // التحقق من الملفات
    if (files.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 PDF files are required' },
        { status: 400 }
      );
    }

    // إنشاء ملف PDF جديد
    const mergedPdf = await PDFDocument.create();

    // دمج الصفحات من كل ملف
    for (const file of files) {
      try {
        const buffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer);
        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      } catch (error) {
        console.error('Error processing file:', file.name, error);
        return NextResponse.json(
          { error: `Failed to process file: ${file.name}` },
          { status: 400 }
        );
      }
    }

    // حفظ الملف المدمج
    const mergedPdfBytes = await mergedPdf.save();

    // إعادة الملف كاستجابة مع الحفاظ على اسم التنزيل
    return new NextResponse(mergedPdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=merged-${Date.now()}.pdf`,
      }
    });

  } catch (error) {
    console.error('Error merging PDFs:', error);
    return NextResponse.json(
      { error: 'Failed to merge PDFs' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
export const preferredRegion = 'fra1';
