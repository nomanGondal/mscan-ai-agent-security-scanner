import { ROLE, USER_PERSONA } from "@/constants";
import mongoose, { Document, Types, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  fullName: string;
  persona: string;
  role: ROLE;
  verificationCode: string;
  isUserVerified: boolean;
  verificationCodeExpiry?: Date;
  profilePicture?: {
    url: string;
    public_id: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  time: Date;
  confirmPassword: (confirmPassword: string) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required."],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Email is required."],
    },
    password: {
      type: String,
      required: false,
      minLength: [5, "Password atleast 5 digits long."],
      trim: true,
    },
    verificationCodeExpiry: {
      type: Date,
      required: false,
    },
    isUserVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.USER,
    },
    fullName: {
      type: String,
      required: true,
    },
    persona: {
      type: String,
      enum: Object.values(USER_PERSONA),
      default: USER_PERSONA.OTHER,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profilePicture: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

userSchema.pre<IUser>("save", async function () {
  if (this.isModified("password") && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userSchema.methods.comparePassword = async function (confirmPassword: string) {
  return bcrypt.compare(confirmPassword, this.password);
};

export { UserModel };
