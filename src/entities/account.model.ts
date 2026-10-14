import mongoose, { Document, Types, Schema } from "mongoose";
import { IUser } from "./user.model";
import { ACCOUNT_TYPES, SUBSCRIPTION_STATUS } from "@/constants";

export interface IAccount extends Document {
  user: Types.ObjectId | IUser;
  plan: string;
  trialStartDate: Date;
  trialEndDate: Date;
  isTrialActive: boolean;
  stripeCustomerId?: string;
  subscriptionStatus?: string;
  subscriptionEndAt?: Date;
  reportsUsed: number;
  reportsLimit: number;
  githubAccessEnabled: boolean;
}

const accountSchema: Schema<IAccount> = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true,
    },
    plan: {
      type: String,
      enum: Object.values(ACCOUNT_TYPES),
      required: true,
      default: ACCOUNT_TYPES.FREE,
    },
    trialStartDate: {
      type: Date,
      default: Date.now(),
    },
    trialEndDate: {
      type: Date,
      default: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
    isTrialActive: {
      type: Boolean,
      default: true,
    },
    stripeCustomerId: {
      type: String,
    },
    subscriptionStatus: {
      type: String,
      enum: Object.values(SUBSCRIPTION_STATUS),
      default: SUBSCRIPTION_STATUS.NONE,
    },
    subscriptionEndAt: {
      type: Date,
    },
    reportsUsed: {
      type: Number,
      required: true,
      default: 0,
    },
    reportsLimit: {
      type: Number,
      required: true,
      default: 3,
    },
    githubAccessEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const AccountModel =
  (mongoose.models.Account as mongoose.Model<IAccount>) ||
  mongoose.model<IAccount>("Account", accountSchema);

accountSchema.pre("save", function () {
  if (this.trialEndDate < new Date()) {
    this.isTrialActive = false;
  }
});

export { AccountModel };
