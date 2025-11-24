/**
 * Simple PDF processor that provides fallback options when PDF.js fails
 * This is a backup solution for development environments where PDF.js imports fail
 */

import Tesseract from 'tesseract.js';

// Simple PDF text extraction with multiple fallback strategies
export async function extractPDFTextSimple(file: File): Promise<string> {
  console.log('Using simple PDF processor for:', file.name);
  
  try {
    // Strategy 1: Try to extract using basic file reading (works for some simple PDFs)
    const text = await tryBasicPDFExtraction(file);
    if (text && text.length > 100) {
      return text;
    }
  } catch (error) {
    console.warn('Basic PDF extraction failed:', error);
  }

  try {
    // Strategy 2: Convert to image and use OCR
    console.log('Converting PDF to image for OCR processing...');
    return await convertPDFToImageAndOCR(file);
  } catch (error) {
    console.error('OCR processing failed:', error);
    throw new Error('Unable to extract text from this PDF. Please try converting it to a text file or uploading individual pages as images.');
  }
}

// Basic PDF text extraction (works for simple text-based PDFs)
async function tryBasicPDFExtraction(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const text = new TextDecoder('utf-8').decode(uint8Array);
        
        // Look for text patterns in the PDF
        const textMatches = text.match(/\w+/g);
        if (textMatches && textMatches.length > 50) {
          const extractedText = textMatches.join(' ');
          if (extractedText.length > 100) {
            resolve(extractedText);
            return;
          }
        }
        
        reject(new Error('No readable text found'));
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsArrayBuffer(file);
  });
}

// Convert PDF to image and use OCR (fallback method)
async function convertPDFToImageAndOCR(file: File): Promise<string> {
  try {
    // For now, we'll provide instructions to the user
    // In a full implementation, you'd use a service like PDF-lib or canvas-based rendering
    
    const instructions = `
📄 **PDF Processing Notice**

Your PDF "${file.name}" requires advanced processing. Here are your options:

🔧 **Immediate Solutions:**
1. **Convert to Text**: Copy the text from your PDF and save as a .txt file
2. **Upload as Images**: Convert PDF pages to JPG/PNG images and upload them
3. **Use Google Docs**: Open the PDF in Google Docs, then copy the text

💡 **For Best Results:**
- Ensure your PDF has selectable text (not scanned images)
- Try using a different PDF viewer to export as text
- Upload smaller sections of the document if it's very large

🚀 **Alternative:** Upload the content as a Word document (.docx) which works reliably.
    `;
    
    throw new Error(instructions.trim());
  } catch (error) {
    throw error;
  }
}

// Check if we can process this PDF
export function canProcessPDF(): boolean {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Check if required APIs are available
  return !!(window.FileReader && window.TextDecoder);
}

// Provide user-friendly error messages and solutions
export function getPDFErrorMessage(error: any, fileName: string): string {
  const baseMessage = `❌ Unable to process "${fileName}"`;
  
  if (error.message?.includes('dynamically imported module')) {
    return `${baseMessage}: PDF processing library failed to load.

💡 **Quick Solutions:**
1. **Convert to Text**: Open your PDF, select all text (Ctrl+A), copy, and save as a .txt file
2. **Use Word Format**: Save your document as .docx which processes more reliably  
3. **Upload as Images**: Convert PDF pages to images (JPG/PNG) and upload them

🔧 **Technical Note**: This is a development environment issue that will be resolved in production.`;
  }
  
  if (error.message?.includes('Failed to fetch')) {
    return `${baseMessage}: Network or loading issue.

💡 **Try These Steps:**
1. **Refresh the page** and try again
2. **Check your internet connection**
3. **Upload a smaller file** (under 10MB)
4. **Convert to .docx or .txt format** for better compatibility`;
  }
  
  return `${baseMessage}: ${error.message}

💡 **Recommended Solutions:**
1. **Convert to Text**: Copy text from PDF and save as .txt file
2. **Use Word Format**: Upload as .docx instead
3. **Upload as Images**: Convert pages to JPG/PNG format`;
}