import {
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

type Severity = "critical" | "high" | "medium" | "low";

interface ScanCompletionTemplateProps {
  username: string;
  fileName: string;
  scanSource: string;
  completedAt: string;
  durationLabel: string;
  totalIssues: number;
  severitySummary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  topFindings: Array<{
    severity: Severity;
    title: string;
    description: string;
    file?: string;
    line?: number;
    stage?: string;
  }>;
}

const severityStyles: Record<
  Severity,
  { backgroundColor: string; color: string; borderColor: string }
> = {
  critical: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    borderColor: "#fca5a5",
  },
  high: {
    backgroundColor: "#ffedd5",
    color: "#9a3412",
    borderColor: "#fdba74",
  },
  medium: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    borderColor: "#fcd34d",
  },
  low: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    borderColor: "#86efac",
  },
};

const metricCardStyle = {
  flex: "1 1 120px",
  minWidth: "120px",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "14px",
  backgroundColor: "#ffffff",
} as const;

const ScanCompletionTemplate = ({
  username,
  fileName,
  scanSource,
  completedAt,
  durationLabel,
  totalIssues,
  severitySummary,
  topFindings,
}: ScanCompletionTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your MSCAN scan report is ready</Preview>

      <Container
        style={{
          padding: "24px",
          fontFamily: "Arial, Helvetica, sans-serif",
          backgroundColor: "#f8fafc",
        }}
      >
        <Section
          style={{
            backgroundColor: "#0f172a",
            borderRadius: "18px",
            padding: "28px",
            color: "#ffffff",
          }}
        >
          <Text
            style={{
              margin: 0,
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#94a3b8",
            }}
          >
            MSCAN automated security report
          </Text>
          <Heading as="h1" style={{ margin: "12px 0 0", color: "#ffffff" }}>
            Scan completed successfully
          </Heading>
          <Text style={{ marginTop: "12px", color: "#cbd5e1", lineHeight: 1.6 }}>
            Hi {username}, your ZIP archive scan for {fileName} has finished.
            The report below summarizes the security findings detected during the
            analysis.
          </Text>
        </Section>

        <Section style={{ marginTop: "20px", padding: "22px", backgroundColor: "#ffffff", borderRadius: "18px", border: "1px solid #e5e7eb" }}>
          <Row>
            <Section style={metricCardStyle}>
              <Text style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Total issues</Text>
              <Text style={{ margin: "8px 0 0", fontSize: "28px", fontWeight: 700, color: "#111827" }}>
                {totalIssues}
              </Text>
            </Section>
            <Section style={metricCardStyle}>
              <Text style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Critical</Text>
              <Text style={{ margin: "8px 0 0", fontSize: "28px", fontWeight: 700, color: "#b91c1c" }}>
                {severitySummary.critical}
              </Text>
            </Section>
            <Section style={metricCardStyle}>
              <Text style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>High</Text>
              <Text style={{ margin: "8px 0 0", fontSize: "28px", fontWeight: 700, color: "#c2410c" }}>
                {severitySummary.high}
              </Text>
            </Section>
            <Section style={metricCardStyle}>
              <Text style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Medium / Low</Text>
              <Text style={{ margin: "8px 0 0", fontSize: "28px", fontWeight: 700, color: "#166534" }}>
                {severitySummary.medium + severitySummary.low}
              </Text>
            </Section>
          </Row>

          <Hr style={{ borderColor: "#e5e7eb", margin: "22px 0" }} />

          <Section>
            <Heading as="h2" style={{ margin: "0 0 12px", fontSize: "18px" }}>
              Scan details
            </Heading>
            <Text style={{ margin: "0 0 8px", color: "#374151" }}>
              File scanned: <strong>{fileName}</strong>
            </Text>
            <Text style={{ margin: "0 0 8px", color: "#374151" }}>
              Scan type: <strong>{scanSource.toUpperCase()}</strong>
            </Text>
            <Text style={{ margin: "0 0 8px", color: "#374151" }}>
              Completed at: <strong>{completedAt}</strong>
            </Text>
            <Text style={{ margin: 0, color: "#374151" }}>
              Duration: <strong>{durationLabel}</strong>
            </Text>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "22px 0" }} />

          <Section>
            <Heading as="h2" style={{ margin: "0 0 12px", fontSize: "18px" }}>
              Top findings
            </Heading>

            {topFindings.length > 0 ? (
              topFindings.map((finding, index) => {
                const style = severityStyles[finding.severity];
                return (
                  <Section
                    key={`${finding.title}-${index}`}
                    style={{
                      marginBottom: "12px",
                      padding: "14px",
                      borderRadius: "14px",
                      border: `1px solid ${style.borderColor}`,
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <Text
                      style={{
                        display: "inline-block",
                        margin: "0 0 10px",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        backgroundColor: style.backgroundColor,
                        color: style.color,
                        fontSize: "12px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {finding.severity}
                    </Text>
                    <Text style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700, color: "#111827" }}>
                      {index + 1}. {finding.title}
                    </Text>
                    <Text style={{ margin: "0 0 8px", color: "#4b5563", lineHeight: 1.6 }}>
                      {finding.description}
                    </Text>
                    <Text style={{ margin: 0, color: "#6b7280", fontSize: "12px" }}>
                      {finding.file ? `File: ${finding.file}` : "File: not mapped"}
                      {finding.line ? ` | Line: ${finding.line}` : ""}
                      {finding.stage ? ` | Stage: ${finding.stage}` : ""}
                    </Text>
                  </Section>
                );
              })
            ) : (
              <Section
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                }}
              >
                <Text style={{ margin: 0, color: "#065f46", lineHeight: 1.6 }}>
                  No vulnerabilities were detected in this scan. The archive did
                  not contain any findings that matched the current analysis rules.
                </Text>
              </Section>
            )}
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "22px 0" }} />

          <Text style={{ margin: 0, color: "#6b7280", lineHeight: 1.6 }}>
            You can open MSCAN at any time to review the full report, inspect the
            code snippets, and triage the findings for remediation.
          </Text>
        </Section>

        <Text style={{ marginTop: "18px", textAlign: "center", color: "#94a3b8", fontSize: "12px" }}>
          This report was generated automatically by MSCAN after a completed ZIP
          scan.
        </Text>
      </Container>
    </Html>
  );
};

export { ScanCompletionTemplate };