import { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const DownloadReportButton = ({ report }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = () => {
    if (!report) {
      alert('Report data is not available.');
      return;
    }

    try {
      setIsGenerating(true);

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const primaryColor = [15, 23, 42];  // Slate 900
      const accentCyan = [6, 182, 212];    // Cyan 500
      const textDark = [30, 41, 59];      // Slate 800
      const textMuted = [100, 116, 139];  // Slate 500

      const getRiskRGB = (level = '') => {
        const l = String(level).toUpperCase();
        if (l === 'HIGH' || l === 'CRITICAL') return [225, 29, 72];
        if (l === 'MEDIUM' || l === 'MODERATE') return [234, 88, 12];
        return [16, 185, 129];
      };

      const riskLevel = report.risk?.level || 'LOW';
      const riskScore = report.risk?.score ?? 10;
      const targetUrl = report.normalized_url || report.url || 'N/A';
      const scanTime = report.scanned_at || new Date().toLocaleString();
      const riskRGB = getRiskRGB(riskLevel);

      // --- 1. HEADER BANNER ---
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 32, 'F');

      doc.setFillColor(...accentCyan);
      doc.rect(0, 31, 210, 1, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('SAFELINK AI', 14, 16);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text('CYBERSECURITY & THREAT INTELLIGENCE REPORT', 14, 23);

      doc.setFontSize(8);
      doc.text(`Generated: ${scanTime}`, 196, 23, { align: 'right' });

      // --- 2. EXECUTIVE SUMMARY BOX ---
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 38, 182, 34, 2, 2, 'FD');

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textMuted);
      doc.text('TARGET URL / DOMAIN:', 20, 46);

      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textDark);
      doc.text(doc.splitTextToSize(targetUrl, 115), 20, 53);

      // Risk Badge Box
      doc.setFillColor(...riskRGB);
      doc.roundedRect(142, 43, 48, 24, 2, 2, 'F');

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('RISK ASSESSMENT', 166, 49, { align: 'center' });

      doc.setFontSize(13);
      doc.text(`${riskLevel}`, 166, 56, { align: 'center' });

      doc.setFontSize(8);
      doc.text(`Score: ${riskScore} / 100`, 166, 62, { align: 'center' });

      let currentY = 80;

      // --- 3. AI SUMMARY ---
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('1. AI Threat Summary', 14, currentY);

      currentY += 3;
      const aiSummary = report.ai?.summary || report.ai?.explanation || 'Threat analysis complete. Domain evaluated.';
      const splitSummary = doc.splitTextToSize(aiSummary, 182);

      autoTable(doc, {
        startY: currentY,
        head: [['Executive Brief']],
        body: [[splitSummary]],
        theme: 'grid',
        headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
        bodyStyles: { textColor: textDark, fontSize: 8, cellPadding: 4 },
        margin: { left: 14, right: 14 },
      });

      currentY = doc.lastAutoTable.finalY + 8;

      // --- 4. SSL & WHOIS TABLE ---
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('2. Domain & Infrastructure Analysis', 14, currentY);

      currentY += 3;

      const sslStatus = report.ssl?.valid ? 'Valid & Trusted' : 'Invalid / Untrusted';
      const sslIssuer = report.ssl?.issuer || 'Unknown CA';
      const sslDays = report.ssl?.days_remaining ?? 'N/A';

      const registrar = report.whois?.registrar || 'Unknown Registrar';
      const creationDate = report.whois?.created_date || 'Unknown';
      const domainAge = report.whois?.age_days ? `${report.whois.age_days} days` : 'N/A';

      autoTable(doc, {
        startY: currentY,
        head: [['Metric', 'SSL Certificate Data', 'WHOIS Record']],
        body: [
          ['Issuer / Registrar', sslIssuer, registrar],
          ['Status / Domain Age', sslStatus, domainAge],
          ['Validity / Created', `Days Remaining: ${sslDays}`, creationDate],
        ],
        theme: 'striped',
        headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
        bodyStyles: { textColor: textDark, fontSize: 8 },
        columnStyles: { 0: { fontStyle: 'bold', width: 38 } },
        margin: { left: 14, right: 14 },
      });

      currentY = doc.lastAutoTable.finalY + 8;

      // --- 5. VIRUSTOTAL RESULTS ---
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('3. Security Engines Scan', 14, currentY);

      currentY += 3;

      const vtMalicious = report.virustotal?.malicious ?? 0;
      const vtSuspicious = report.virustotal?.suspicious ?? 0;
      const vtHarmless = report.virustotal?.harmless ?? 0;

      autoTable(doc, {
        startY: currentY,
        head: [['Classification', 'Engine Detections', 'Security Status']],
        body: [
          ['Malicious Flagged', `${vtMalicious}`, vtMalicious > 0 ? 'CRITICAL RISK' : 'CLEAN'],
          ['Suspicious Flagged', `${vtSuspicious}`, vtSuspicious > 0 ? 'WARNING' : 'CLEAN'],
          ['Harmless / Verified', `${vtHarmless}`, 'PASSED'],
        ],
        theme: 'grid',
        headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
        bodyStyles: { textColor: textDark, fontSize: 8 },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 2) {
            const val = data.cell.raw;
            if (val === 'CRITICAL RISK') data.cell.styles.textColor = [225, 29, 72];
            else if (val === 'WARNING') data.cell.styles.textColor = [234, 88, 12];
            else if (val === 'CLEAN' || val === 'PASSED') data.cell.styles.textColor = [16, 185, 129];
          }
        },
        margin: { left: 14, right: 14 },
      });

      currentY = doc.lastAutoTable.finalY + 8;

      // --- 6. RECOMMENDATIONS ---
      if (currentY + 25 > 270) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('4. Recommended Actions', 14, currentY);

      currentY += 3;

      const recommendations = Array.isArray(report.ai?.recommendations)
        ? report.ai.recommendations.map((rec) => [rec])
        : [[report.ai?.recommendation || 'Standard security awareness advised.']];

      autoTable(doc, {
        startY: currentY,
        head: [['Action Guidance']],
        body: recommendations,
        theme: 'plain',
        headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
        bodyStyles: { textColor: textDark, fontSize: 8, cellPadding: 2.5 },
        margin: { left: 14, right: 14 },
      });

      // --- 7. FOOTER ---
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textMuted);
        doc.setDrawColor(226, 232, 240);
        doc.line(14, 283, 196, 283);

        doc.text('SafeLink AI Security Platform • Automated Security Report', 14, 288);
        doc.text(`Page ${i} of ${totalPages}`, 196, 288, { align: 'right' });
      }

      const safeName = targetUrl.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
      doc.save(`SafeLink_Report_${safeName}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF. Check browser console.');
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
