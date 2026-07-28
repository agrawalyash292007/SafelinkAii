import { useState } from 'react';
import { generateReportPdf } from '../../utils/reportPdf';

const DownloadReportButton = ({ report }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = () => {
    if (!report) {
      alert('Report data is not available.');
      return;
    }

    try {
      setIsGenerating(true);
      generateReportPdf(report);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownloadPDF}
      disabled={isGenerating || !report}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-cyan-500/20 border border-cyan-400/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
    >
      <svg
        className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isGenerating ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        )}
      </svg>
      {isGenerating ? 'Generating PDF...' : 'Download Security Report'}
    </button>
  );
};

export default DownloadReportButton;
