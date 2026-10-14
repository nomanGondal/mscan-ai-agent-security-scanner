import mongoose, { Document, Types, Schema } from "mongoose";
import { IUser } from "./user.model";
import { IAccount } from "./account.model";

export interface IScanIssue {
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  description: string;
  stage?: "mcp_ast" | "pyre_typing" | "pysa_taint" | "unknown";
  line: number;
  column: number;
  file?: string;
  code?: string;
}

export interface IScan extends Document {
  user: Types.ObjectId | IUser;
  account: Types.ObjectId | IAccount;
  fileName: string;
  fileSize: number;
  fileContent?: string;
  uploadedAt: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  status: "uploaded" | "analyzing" | "completed" | "failed";
  scanSource?: "zip" | "model" | "github" | "demo";
  duration?: number;
  issues: IScanIssue[];
  severitySummary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  analysisTools: {
    mcp_ast: boolean;
    pyre_typing: boolean;
    pysa_taint: boolean;
  };
  error?: string;
}

const scanIssueSchema = new Schema({
  severity: {
    type: String,
    enum: ["critical", "high", "medium", "low"],
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stage: {
    type: String,
    enum: ["mcp_ast", "pyre_typing", "pysa_taint", "unknown"],
    default: "unknown",
  },
  line: {
    type: Number,
    required: true,
  },
  column: {
    type: Number,
    required: true,
  },
  file: String,
  code: String,
});

const scanSchema: Schema<IScan> = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    account: {
      type: Types.ObjectId,
      ref: "Account",
      required: [true, "Account is required"],
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
    },
    fileContent: {
      type: String,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["uploaded", "analyzing", "completed", "failed"],
      default: "uploaded",
    },
    scanSource: {
      type: String,
      enum: ["zip", "model", "github", "demo"],
      default: "zip",
    },
    duration: {
      type: Number,
    },
    issues: [scanIssueSchema],
    severitySummary: {
      critical: {
        type: Number,
        default: 0,
      },
      high: {
        type: Number,
        default: 0,
      },
      medium: {
        type: Number,
        default: 0,
      },
      low: {
        type: Number,
        default: 0,
      },
    },
    analysisTools: {
      mcp_ast: {
        type: Boolean,
        default: false,
      },
      pyre_typing: {
        type: Boolean,
        default: false,
      },
      pysa_taint: {
        type: Boolean,
        default: false,
      },
    },
    error: String,
  },
  { timestamps: true },
);

const ScanModel =
  (mongoose.models.Scan as mongoose.Model<IScan>) ||
  mongoose.model<IScan>("Scan", scanSchema);

export { ScanModel };
