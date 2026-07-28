import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const primaryColor = [15, 23, 42];
const accentCyan = [6, 182, 212];
const textDark = [30, 41, 59];
const textMuted = [100, 116, 139];

const getLastTableY = (doc, fallbackY) => doc.lastAutoTable?.finalY || fallbackY;

const getRiskRGB = (level = '') => {
  const normalized = String(level).toUpperCase();
  if (normalized === 'HIGH' || normalized === 'CRITICAL') return [225, 29, 72];
  if (normalized === 'MEDIUM' || normalized === 'MODERATE') return [234, 88, 12];
  return [16, 185, 129];
};

const cleanCell = (value, fallback = 'N/A') => {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
};

export const generateReportPdf = (report, { save = true } = {}) => {
  if (!report) {
    throw new Error('Report data is not available.');
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const riskLevel = report.risk?.level || report.verdict || 'Unknown';
  const riskScore = report.risk?.score ?? report.risk_score ?? 0;
  const targetUrl = report.normalized_url || report.url || report.domain || 'N/A';
  const scanTime = report.scanned_at || report.scan_time || new Date().toLocaleString();
  const riskRGB = getRiskRGB(riskLevel);

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

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 38, 182, 34, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textMuted);
  doc.text('TARGET URL / DOMAIN:', 20, 46);

  doc.setFontSize(10.5);
  doc.setTextColor(...textDark);
  doc.text(doc.splitTextToSize(targetUrl, 115), 20, 53);

  doc.setFillColor(...riskRGB);
  doc.roundedRect(142, 43, 48, 24, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('RISK ASSESSMENT', 166, 49, { align: 'center' });
  doc.setFontSize(13);
  doc.text(cleanCell(riskLevel, 'Unknown'), 166, 56, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`Score: ${riskScore} / 100`, 166, 62, { align: 'center' });

  let currentY = 80;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('1. AI Threat Summary', 14, currentY);
  currentY += 3;

  const aiSummary = cleanCell(
    report.ai?.summary || report.ai?.explanation,
    'Threat analysis complete. Domain evaluated.'
  );

  autoTable(doc, {
    startY: currentY,
    head: [['Executive Brief']],
    body: [[doc.splitTextToSize(aiSummary, 170).join('\n')]],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
    bodyStyles: { textColor: textDark, fontSize: 8, cellPadding: 4 },
    margin: { left: 14, right: 14 },
  });

  currentY = getLastTableY(doc, currentY + 18) + 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('2. Domain & Infrastructure Analysis', 14, currentY);
  currentY += 3;

  const sslStatus = report.ssl?.valid ? 'Valid & Trusted' : 'Invalid / Untrusted';
  const sslIssuer = cleanCell(report.ssl?.issuer, 'Unknown CA');
  const sslDays = cleanCell(report.ssl?.days_remaining);
  const registrar = cleanCell(report.whois?.registrar, 'Unknown Registrar');
  const creationDate = cleanCell(report.whois?.creation_date || report.whois?.created_date, 'Unknown');
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

  currentY = getLastTableY(doc, currentY + 28) + 8;

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
      if (data.section !== 'body' || data.column.index !== 2) return;

      const value = data.cell.raw;
      if (value === 'CRITICAL RISK') data.cell.styles.textColor = [225, 29, 72];
      if (value === 'WARNING') data.cell.styles.textColor = [234, 88, 12];
      if (value === 'CLEAN' || value === 'PASSED') data.cell.styles.textColor = [16, 185, 129];
    },
    margin: { left: 14, right: 14 },
  });

  currentY = getLastTableY(doc, currentY + 28) + 8;

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
    ? report.ai.recommendations.map((rec) => [cleanCell(rec, 'Review this website carefully.')])
    : [[cleanCell(report.ai?.recommendation, 'Standard security awareness advised.')]];

  autoTable(doc, {
    startY: currentY,
    head: [['Action Guidance']],
    body: recommendations,
    theme: 'plain',
    headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
    bodyStyles: { textColor: textDark, fontSize: 8, cellPadding: 2.5 },
    margin: { left: 14, right: 14 },
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textMuted);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 283, 196, 283);
    doc.text('SafeLink AI Security Platform - Automated Security Report', 14, 288);
    doc.text(`Page ${i} of ${totalPages}`, 196, 288, { align: 'right' });
  }

  if (save) {
    const safeName = targetUrl.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    doc.save(`SafeLink_Report_${safeName}.pdf`);
  }

  return doc;
};
