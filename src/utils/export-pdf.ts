import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface VulnerabilityItem {
  file: string;
  line: number;
  type: string;
  rule: string;
  severity: string;
  description: string;
  fix: string;
}

interface SummaryStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

const getSeverityColor = (severity: string): [number, number, number] => {
  const upper = (severity || "").toUpperCase();
  switch (upper) {
    case "CRITICAL":
      return [127, 29, 29]; // #7F1D1D
    case "HIGH":
      return [220, 38, 38]; // #DC2626
    case "MEDIUM":
      return [234, 88, 12]; // #EA580C
    case "LOW":
      return [37, 99, 235]; // #2563EB
    default:
      return [107, 114, 128]; // #6B7280
  }
};

export const exportScanResultsToPDF = async (
  vulnerabilities: VulnerabilityItem[],
  summary: SummaryStats,
  projectName: string = "Vulnerability Scan Report",
  fileName: string = "scan_report.pdf"
) => {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    let currentY = margin;

    // Helper function to add text with wrapping
    const addText = (
      text: string,
      x: number,
      y: number,
      options?: any
    ): number => {
      pdf.text(text, x, y, options);
      return y + (options?.height || 7);
    };

    // Helper to check if we need a new page
    const checkPageBreak = (requiredSpace: number): number => {
      if (currentY + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }
      return currentY;
    };

    // ==================== Header Section ====================
    pdf.setFontSize(20);
    pdf.setFont(undefined, "bold");
    currentY = addText("Vulnerability Scan Report", margin, currentY);

    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");
    currentY = addText(
      `Project: ${projectName}`,
      margin,
      currentY + 3
    );
    currentY = addText(
      `Generated: ${new Date().toLocaleString()}`,
      margin,
      currentY + 2
    );

    // Add separator line
    currentY += 3;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 5;

    // ==================== Summary Section ====================
    checkPageBreak(30);

    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    currentY = addText("Summary", margin, currentY);

    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");

    // Summary table-like layout
    const summaryItems = [
      { label: "Total Issues", value: summary.total, color: [100, 100, 100] },
      {
        label: "Critical",
        value: summary.critical,
        color: getSeverityColor("critical"),
      },
      { label: "High", value: summary.high, color: getSeverityColor("high") },
      {
        label: "Medium",
        value: summary.medium,
        color: getSeverityColor("medium"),
      },
      { label: "Low", value: summary.low, color: getSeverityColor("low") },
    ];

    currentY += 2;
    const colWidth = (maxWidth - 10) / 5; // 5 columns with spacing

    summaryItems.forEach((item, idx) => {
      const xPos = margin + idx * (colWidth + 2);

      // Color box
      pdf.setFillColor(...item.color);
      pdf.rect(xPos, currentY, 8, 8, "F");

      // Label and value
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(8);
      pdf.text(`${item.label}:`, xPos + 10, currentY + 3);
      pdf.setFont(undefined, "bold");
      pdf.setFontSize(11);
      pdf.text(item.value.toString(), xPos + 10, currentY + 7);
      pdf.setFont(undefined, "normal");
    });

    currentY += 15;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 5;

    // ==================== Vulnerabilities Section ====================
    checkPageBreak(20);

    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    currentY = addText("Vulnerabilities Details", margin, currentY);

    pdf.setFontSize(10);
    currentY += 3;

    // Group vulnerabilities by rule for better organization
    const groupedByRule: Record<string, VulnerabilityItem[]> = {};
    vulnerabilities.forEach((vuln) => {
      if (!groupedByRule[vuln.rule]) {
        groupedByRule[vuln.rule] = [];
      }
      groupedByRule[vuln.rule].push(vuln);
    });

    // Sort by rule name
    const sortedRules = Object.keys(groupedByRule).sort();

    sortedRules.forEach((rule, ruleIdx) => {
      checkPageBreak(15);

      const items = groupedByRule[rule];

      // Rule header
      pdf.setFont(undefined, "bold");
      pdf.setFontSize(10);
      const ruleText = `${ruleIdx + 1}. ${rule} (${items.length} issue${items.length > 1 ? "s" : ""})`;
      currentY = addText(ruleText, margin, currentY);

      items.forEach((vuln, vulnIdx) => {
        checkPageBreak(25);

        pdf.setFont(undefined, "normal");
        pdf.setFontSize(9);

        // Severity badge
        const severityColor = getSeverityColor(vuln.severity);
        pdf.setFillColor(...severityColor);
        pdf.rect(margin, currentY - 2, 30, 5, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFont(undefined, "bold");
        pdf.text(vuln.severity, margin + 1, currentY + 0.5);

        // Type and description
        pdf.setTextColor(0, 0, 0);
        pdf.setFont(undefined, "normal");
        const typeText = vuln.type ? ` [${vuln.type}]` : "";
        pdf.text(
          `${vuln.description}${typeText}`,
          margin + 35,
          currentY - 1,
          { maxWidth: maxWidth - 35 }
        );

        currentY += 6;

        // File and line info
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`File: ${vuln.file} | Line: ${vuln.line}`, margin + 2, currentY);
        currentY += 3;

        // Recommendation if available
        if (vuln.fix) {
          pdf.setTextColor(0, 0, 0);
          pdf.setFont(undefined, "bold");
          pdf.setFontSize(8);
          pdf.text("Recommended Fix:", margin + 2, currentY);
          currentY += 2;

          pdf.setFont(undefined, "normal");
          pdf.setFontSize(8);
          const fixLines = pdf.splitTextToSize(vuln.fix, maxWidth - 4);
          fixLines.forEach((line: string) => {
            pdf.text(line, margin + 2, currentY);
            currentY += 2;
          });
        }

        currentY += 2;

        // Separator between vulnerabilities
        if (vulnIdx < items.length - 1) {
          pdf.setDrawColor(230, 230, 230);
          pdf.line(margin + 2, currentY, pageWidth - margin - 2, currentY);
          currentY += 2;
        }
      });

      currentY += 3;

      // Separator between rules
      if (ruleIdx < sortedRules.length - 1) {
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 3;
      }
    });

    // ==================== Footer ====================
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      "This report was automatically generated by Vulnerability Scanner",
      margin,
      pageHeight - 10
    );
    pdf.text(
      `Page 1 of ${pdf.internal.pages.length}`,
      pageWidth - margin - 20,
      pageHeight - 10
    );

    // Save the PDF
    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF export");
  }
};
