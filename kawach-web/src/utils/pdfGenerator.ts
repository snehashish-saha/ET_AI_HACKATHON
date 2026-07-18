import jsPDF from 'jspdf';
import type { LiveReport } from '../types/report';

export function generatePDF(report: LiveReport) {
  const doc = new jsPDF();
  let y = 20;
  
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("PRELIMINARY INCIDENT REPORT", 20, y);
  
  y += 15;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Zone: ${report.plant.zone}`, 20, y);
  doc.text(`Timestamp: ${report.timestamp}`, 100, y);
  
  y += 10;
  doc.text(`Risk Level: ${report.master_ai.risk_level} (${report.master_ai.risk_score}%)`, 20, y);
  doc.text(`Permit: ${report.plant.permit}`, 100, y);
  
  y += 20;
  doc.setFont("helvetica", "bold");
  doc.text("INCIDENT SUMMARY", 20, y);
  y += 10;
  doc.setFont("helvetica", "normal");
  const splitTitle = doc.splitTextToSize(report.executive_summary, 170);
  doc.text(splitTitle, 20, y);
  
  y += splitTitle.length * 7 + 10;
  
  if (report.master_ai.reasons.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("ROOT CAUSE ANALYSIS", 20, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    report.master_ai.reasons.forEach(r => {
      doc.text(`• ${r}`, 25, y);
      y += 7;
    });
    y += 10;
  }
  
  if (report.master_ai.recommendations.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("RECOMMENDED ACTIONS", 20, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    report.master_ai.recommendations.forEach((r, i) => {
      doc.text(`${i + 1}. ${r}`, 25, y);
      y += 7;
    });
  }

  doc.save(`kawach-incident-report-${Date.now()}.pdf`);
}
