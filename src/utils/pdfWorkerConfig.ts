// Safe import with error handling
let pdfjs: any;
try {
  const reactPdf = require('react-pdf');
  pdfjs = reactPdf.pdfjs;
} catch (error) {
  console.warn('react-pdf not available, PDF viewer functionality will be limited');
}

/**
 * Initialize PDF.js worker configuration
 * This file should be imported at the application entry point
 * or in components that use PDF.js functionality
 */
export function initPdfWorker() {
  if (typeof window === 'undefined') return; // Skip on server-side
  
  try {
    // Check if pdfjs is available
    if (!pdfjs) {
      console.warn('PDF.js not available, skipping worker initialization');
      return;
    }

    // Ensure GlobalWorkerOptions exists before accessing it
    if (typeof pdfjs.GlobalWorkerOptions === 'undefined') {
      pdfjs.GlobalWorkerOptions = {};
    }

    // Set worker source only if it's not already set
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      // Try multiple worker paths for compatibility
      const workerPaths = [
        '/pdf.js/pdf.worker.min.mjs',
        '/pdf.js/pdf.worker.min.js',
        `https://unpkg.com/pdfjs-dist@${pdfjs.version || '4.0.379'}/build/pdf.worker.min.js`
      ];
      
      // Use the first available path
      const workerUrl = workerPaths[0];
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      console.log('PDF.js worker initialized successfully:', workerUrl);
    }
  } catch (error) {
    console.error('Failed to initialize PDF.js worker:', error);
    // Fallback to CDN if local initialization fails
    try {
      if (pdfjs && pdfjs.version) {
        if (!pdfjs.GlobalWorkerOptions) {
          pdfjs.GlobalWorkerOptions = {};
        }
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
      }
    } catch (fallbackError) {
      console.error('Fallback worker initialization also failed:', fallbackError);
    }
  }
}

// Initialize only if module is available
if (typeof window !== 'undefined') {
  // Delay initialization to ensure modules are loaded
  setTimeout(() => {
    initPdfWorker();
  }, 0);
}

export default initPdfWorker;
