import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, scanResult } = body;

    if (!code || !scanResult) {
      return NextResponse.json(
        { error: "Missing code or scanResult" },
        { status: 400 },
      );
    }

    // Build a compact summary of scanner issues to keep prompt tight
    const issues = (scanResult.issues_details ??
      scanResult.vulnerabilities ??
      []) as Record<string, unknown>[];
    const issuesSummary = issues
      .map(
        (i, n) =>
          `${n + 1}. [${String(i.type ?? i.analysisStage ?? "unknown").toUpperCase()}] ${String(i.rule ?? "")} — ${String(i.description ?? "")} (severity: ${String(i.severity ?? "?")}, line: ${String(i.line ?? "?")})`,
      )
      .join("\n");

    const prompt = `You are a senior application security engineer specializing in Python MCP (Model Context Protocol) servers.

You are given:
1. A Python code snippet
2. The output of a static analysis scanner that scanned that code

Your job is to evaluate the SCANNER'S PERFORMANCE — not to re-audit the code yourself.

---
SUBMITTED CODE:
\`\`\`python
${code}
\`\`\`

---
SCANNER OUTPUT SUMMARY:
Total issues reported: ${scanResult.issues_count ?? issues.length}
${issuesSummary}

Scanner pipeline stages:
- MCP/AST: ${scanResult.pipeline?.mcp_ast?.issue_count ?? 0} issues
- Pyre: ${scanResult.pipeline?.pyre?.issue_count ?? 0} issues  
- Pysa: ${scanResult.pipeline?.pysa?.issue_count ?? 0} issues

---
EVALUATE THE SCANNER on these 5 dimensions. Be precise and direct:

1. DETECTION (0-10): What real vulnerabilities exist in the code? Did the scanner catch all of them? List what it found and what it missed.

2. DUPLICATION (0-10): Are there duplicate findings for the same underlying bug? Count unique real bugs vs total issues reported.

3. FALSE POSITIVES (0-10): Are any reported issues NOT real security problems? Identify them.

4. FIX GUIDANCE (0-10): Does the scanner provide actionable fix suggestions, or just flag issues?

5. SEVERITY ACCURACY (0-10): Are the severity ratings appropriate for each finding?

Then give an OVERALL SCORE (0-10) with a one-line verdict.

Respond ONLY with valid JSON in exactly this shape, no markdown, no extra text:
{
  "actual_vulns": [
    { "id": "string", "label": "string", "severity": "HIGH|MEDIUM|LOW", "detected": true|false, "missed_reason": "string or null" }
  ],
  "false_positives": [
    { "description": "string", "reason": "string" }
  ],
  "scores": {
    "detection": { "score": 0, "explanation": "string" },
    "duplication": { "score": 0, "explanation": "string" },
    "false_positives": { "score": 0, "explanation": "string" },
    "fix_guidance": { "score": 0, "explanation": "string" },
    "severity_accuracy": { "score": 0, "explanation": "string" }
  },
  "overall_score": 0,
  "verdict": "string",
  "total_reported": 0,
  "unique_real_bugs": 0
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a security tool evaluator. You analyze static analysis scanner outputs and rate scanner performance. Always respond with valid JSON only — no markdown, no preamble.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1200,
      temperature: 0.2,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const cleaned = raw
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw: cleaned },
        { status: 500 },
      );
    }

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
