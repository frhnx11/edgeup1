import { useState, useMemo, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { ChevronLeft, ChevronRight, X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { FileWarning } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';


interface PDFViewerProps {
  url: string;
  onClose: () => void;
}

export function PDFViewer({ url, onClose }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize PDF worker on component mount
  useEffect(() => {
    import('../../../utils/pdfWorkerConfig').then(module => {
      if (module.default) {
        module.default();
      }
    }).catch(err => {
      console.warn('PDF worker config failed to load:', err);
    });
  }, []);

  const pdfOptions = useMemo(() => ({
    cMapUrl: '/pdf.js/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: '/pdf.js/standard_fonts/'
  }), []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
    setIsLoading(false);
  }

  function onDocumentLoadError(err: Error) {
    console.error('PDF loading error:', err);
    setError('This PDF is currently unavailable. Please try downloading it directly or contact support if the issue persists.');
    setIsLoading(false);
  }

  const nextPage = () => {
    if (pageNumber < (numPages || 0)) {
      setPageNumber(pageNumber + 1);
    }
  };

  const previousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.6));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-4">
            <button
              onClick={zoomOut}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={scale <= 0.6}
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <button
              onClick={zoomIn}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={scale >= 2}
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <div className="flex items-center gap-2">
              <button
                onClick={previousPage}
                disabled={pageNumber <= 1}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm">
                Page {pageNumber} of {numPages || '--'}
              </span>
              <button
                onClick={nextPage}
                disabled={pageNumber >= (numPages || 0)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              download
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          <div className="flex justify-center">
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              options={pdfOptions}
              loading={isLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                    <p className="text-gray-600">Loading PDF...</p>
                  </div>
                </div>
              )}
              error={
                <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <FileWarning className="w-12 h-12 text-red-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-2">PDF Not Available</h3>
                    <p className="text-gray-600">{error || 'Please try again later or download the file directly.'}</p>
                    <p className="text-sm text-gray-500 mt-2">Error code: PDF_LOAD_FAILED</p>
                  </div>
                  <a
                    href={url}
                    download
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </span>
                  </a>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg"
              />
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
}