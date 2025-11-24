import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Configure PDF.js worker safely
if (typeof window !== 'undefined' && GlobalWorkerOptions) {
  try {
    if (!GlobalWorkerOptions.workerSrc) {
      GlobalWorkerOptions.workerSrc = '/pdf.js/pdf.worker.min.js';
    }
  } catch (error) {
    console.warn('Failed to set PDF.js worker:', error);
  }
}

export interface PDFExtractionResult {
  text: string;
  metadata: {
    pageCount: number;
    extractionMethod: 'text' | 'ocr' | 'mixed';
    confidence: number;
    hasImages: boolean;
    processingTime: number;
  };
}

export class EnhancedPDFProcessor {
  private static readonly MAX_PAGES = 100;
  private static readonly MIN_TEXT_LENGTH = 50;
  private static readonly OCR_CONFIDENCE_THRESHOLD = 0.7;

  /**
   * Extract text from PDF with automatic OCR fallback
   */
  static async extractFromPDF(file: File): Promise<PDFExtractionResult> {
    const startTime = Date.now();
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF document
      const pdf = await getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
        disableFontFace: true,
        standardFontDataUrl: '/pdf.js/standard_fonts/',
        cMapUrl: '/pdf.js/cmaps/',
        cMapPacked: true
      }).promise;

      const pageCount = Math.min(pdf.numPages, this.MAX_PAGES);
      let extractedText = '';
      let hasImages = false;
      let needsOCR = false;
      const pageTexts: string[] = [];

      // First pass: Try text extraction
      for (let i = 1; i <= pageCount; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Check for images
          const operators = await page.getOperatorList();
          if (operators.fnArray.includes(82) || operators.fnArray.includes(83)) {
            hasImages = true;
          }

          // Extract text
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ')
            .trim();

          if (pageText.length > 0) {
            pageTexts.push(pageText);
            extractedText += pageText + '\n\n';
          } else {
            needsOCR = true;
          }
        } catch (pageError) {
          console.warn(`Error extracting page ${i}:`, pageError);
          needsOCR = true;
        }
      }

      // Check if we have enough text
      const cleanText = extractedText.trim();
      if (cleanText.length >= this.MIN_TEXT_LENGTH && !needsOCR) {
        return {
          text: cleanText,
          metadata: {
            pageCount: pdf.numPages,
            extractionMethod: 'text',
            confidence: 1.0,
            hasImages,
            processingTime: Date.now() - startTime
          }
        };
      }

      // Second pass: OCR for pages without text
      console.log('Some pages have no text, attempting OCR...');
      const ocrResults = await this.performOCR(pdf, pageTexts.length === 0 ? pageCount : 1);
      
      if (ocrResults.text) {
        extractedText = pageTexts.length > 0 
          ? extractedText + '\n\n--- OCR Content ---\n\n' + ocrResults.text
          : ocrResults.text;
      }

      return {
        text: extractedText || 'No readable content found in PDF',
        metadata: {
          pageCount: pdf.numPages,
          extractionMethod: pageTexts.length > 0 ? 'mixed' : 'ocr',
          confidence: ocrResults.confidence,
          hasImages: true,
          processingTime: Date.now() - startTime
        }
      };

    } catch (error) {
      console.error('Enhanced PDF extraction error:', error);
      throw new Error(
        error instanceof Error 
          ? `PDF extraction failed: ${error.message}` 
          : 'Failed to extract PDF content'
      );
    }
  }

  /**
   * Perform OCR on PDF pages
   */
  private static async performOCR(
    pdf: any, 
    maxPages: number = 5
  ): Promise<{ text: string; confidence: number }> {
    const ocrTexts: string[] = [];
    let totalConfidence = 0;
    let processedPages = 0;

    for (let i = 1; i <= Math.min(maxPages, pdf.numPages); i++) {
      try {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas context not available');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Perform OCR
        const imageData = canvas.toDataURL('image/png');
        const result = await Tesseract.recognize(imageData, 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
            }
          }
        });

        if (result.data.text && result.data.confidence > this.OCR_CONFIDENCE_THRESHOLD) {
          ocrTexts.push(result.data.text);
          totalConfidence += result.data.confidence;
          processedPages++;
        }

        // Clean up
        canvas.remove();

      } catch (error) {
        console.error(`OCR failed for page ${i}:`, error);
      }
    }

    return {
      text: ocrTexts.join('\n\n'),
      confidence: processedPages > 0 ? totalConfidence / processedPages : 0
    };
  }

  /**
   * Validate PDF file
   */
  static validatePDF(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return { valid: false, error: 'File must be a PDF' };
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return { valid: false, error: `PDF too large. Maximum size is ${maxSize / 1024 / 1024}MB` };
    }

    return { valid: true };
  }
}

// Export singleton instance for backward compatibility
export const enhancedPDFProcessor = EnhancedPDFProcessor;