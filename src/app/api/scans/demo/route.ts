import { connectDB } from "@/lib/db";
import {
  ScanModel,
  UserModel,
  AccountModel,
  type IScanIssue,
} from "@/entities";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";

// Simulated vulnerable Python code issues for demo
const DEMO_ISSUES: IScanIssue[] = [
  {
    severity: "critical",
    type: "SQL Injection",
    description:
      "User input directly concatenated into SQL query without parameterization",
    line: 5,
    column: 20,
    code: 'query = f"SELECT * FROM users WHERE id = {user_input}"',
  },
  {
    severity: "high",
    type: "Command Injection",
    description: "Unsanitized user input passed to shell command execution",
    line: 12,
    column: 15,
    code: 'os.system(f"echo {user_provided_name}")',
  },
  {
    severity: "high",
    type: "Path Traversal",
    description:
      "File path constructed from untrusted input without validation",
    line: 18,
    column: 25,
    code: 'open(f"/files/{request.args.get(\'filename\')}", "r")',
  },
  {
    severity: "medium",
    type: "Hardcoded Credentials",
    description: "Hardcoded database password in source code",
    line: 3,
    column: 10,
    code: 'DB_PASSWORD = "admin123"',
  },
  {
    severity: "medium",
    type: "Unvalidated Redirect",
    description: "User input used in redirect without validation",
    line: 25,
    column: 12,
    code: 'return redirect(request.args.get("next"))',
  },
  {
    severity: "low",
    type: "Weak Cryptography",
    description: "Using MD5 for password hashing (deprecated and insecure)",
    line: 8,
    column: 30,
    code: "hash = hashlib.md5(password.encode()).hexdigest()",
  },
];

export async function POST(_req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findById(session.user._id).exec();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const account = await AccountModel.findOne({ user: user._id }).exec();

    if (!account) {
      return NextResponse.json(
        { error: "User or account not found" },
        { status: 404 },
      );
    }

    // Create a demo scan
    const scan = await ScanModel.create({
      user: user._id,
      account: account._id,
      fileName: "demo_vulnerable.py",
      fileSize: 2048,
      fileContent: `# Demo Vulnerable Python Code
import os
DB_PASSWORD = "admin123"
def authenticate(user_input):
    query = f"SELECT * FROM users WHERE id = {user_input}"
    db.execute(query)

def process_file(filename):
    hash = hashlib.md5(password.encode()).hexdigest()
    
def execute_command(user_provided_name):
    os.system(f"echo {user_provided_name}")
    
def get_file(request):
    path = f"/files/{request.args.get('filename')}"
    return open(path, "r")

def handle_redirect(request):
    return redirect(request.args.get("next"))
`,
      status: "completed",
      scanSource: "demo",
      issues: DEMO_ISSUES,
      severitySummary: {
        critical: 1,
        high: 2,
        medium: 2,
        low: 1,
      },
      analysisTools: {
        mcp_ast: true,
        pyre_typing: true,
        pysa_taint: true,
      },
      completedAt: new Date(),
      duration: 3500,
    });

    return NextResponse.json({
      success: true,
      data: scan,
      message: "Demo scan completed successfully",
    });
  } catch (error) {
    console.error("Error creating demo scan:", error);
    return NextResponse.json(
      { error: "Failed to create demo scan" },
      { status: 500 },
    );
  }
}
