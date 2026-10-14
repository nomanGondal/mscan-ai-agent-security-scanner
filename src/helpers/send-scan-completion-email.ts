import { type IScanIssue } from "@/entities";
import { ScanCompletionTemplate } from "@/email";
import { getResendClient } from "@/service-email/resend-call";
import { ResendType } from "./types/resend-types";

interface SendScanCompletionEmailProps {
  email: string;
  username: string;
  fileName: string;
  scanSource: "zip" | "model" | "github" | "demo";
  completedAt: Date | string;
  durationMs?: number;
  severitySummary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  issues: IScanIssue[];
}

const severityRank: Record<IScanIssue["severity"], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const formatDuration = (durationMs?: number) => {
  if (!durationMs || durationMs <= 0) {
    return "0.0s";
  }

  return `${(durationMs / 1000).toFixed(1)}s`;
};

const sendScanCompletionEmail = async ({
  email,
  username,
  fileName,
  scanSource,
  completedAt,
  durationMs,
  severitySummary,
  issues,
}: SendScanCompletionEmailProps): Promise<ResendType> => {
  try {
    const resend = await getResendClient();

    const sortedIssues = [...issues]
      .sort((left, right) => {
        const severityDiff =
          severityRank[left.severity] - severityRank[right.severity];
        if (severityDiff !== 0) {
          return severityDiff;
        }

        return (left.line || 0) - (right.line || 0);
      })
      .slice(0, 5)
      .map((issue) => ({
        severity: issue.severity,
        title: issue.type,
        description: issue.description,
        file: issue.file,
        line: issue.line,
        stage: issue.stage,
      }));

    const completedAtLabel = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(completedAt));

    const totalIssues =
      severitySummary.critical +
      severitySummary.high +
      severitySummary.medium +
      severitySummary.low;

    const { data, error } = await resend.emails.send({
      from: "MSCAN <no-reply@mscan.me>",
      to: email,
      subject: `MSCAN scan completed for ${fileName}`,
      react: ScanCompletionTemplate({
        username,
        fileName,
        scanSource,
        completedAt: completedAtLabel,
        durationLabel: formatDuration(durationMs),
        totalIssues,
        severitySummary,
        topFindings: sortedIssues,
      }),
    });

    if (error) {
      return {
        success: false,
        message: error.message || "Failed to send scan completion email.",
        statusCode: 400,
        timestamps: new Date().toISOString(),
      };
    }

    return {
      success: true,
      message: "Scan completion email sent successfully",
      statusCode: 200,
      timestamps: new Date().toISOString(),
      data,
    };
  } catch (error: unknown) {
    let errorName = "Error";
    let errorMessage = "Unknown Server Error";
    let errorStack: string | undefined = undefined;

    if (error instanceof Error) {
      errorName = error.name;
      errorMessage = error.message;
      errorStack = error.stack;
    }

    return {
      statusCode: 500,
      message: "Cannot send scan completion email",
      success: false,
      timestamps: new Date().toISOString(),
      error: {
        name: errorName,
        message: errorMessage,
        stack: errorStack,
      },
    };
  }
};

export { sendScanCompletionEmail };