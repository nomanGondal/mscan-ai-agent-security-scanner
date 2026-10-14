import mongoose from "mongoose"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import { UserModel } from "../entities/user.model"
import { ROLE, USER_PERSONA } from "../constants/constants"

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || "abc"

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI)
    if (!MONGO_URI) throw new Error("MONGO_URI is not defined in .env")
    await mongoose.connect(MONGO_URI)
    console.log("Connected to DB")
    const username = "admin"
    const email = "admin@example.com"
    const password = "Admin123!"
    const fullName = "Super Admin"
    const existingAdmin = await UserModel.findOne({ role: ROLE.ADMIN })
    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.email)
      process.exit(0)
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const admin = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      persona: USER_PERSONA.OTHER,
      role: ROLE.ADMIN,
      isUserVerified: true,
      verificationCode: "",
      verificationCodeExpiry: new Date(),
      isActive: true,
    })

    console.log("Admin created successfully")
    console.log({
      username: admin.username,
      email: admin.email,
      role: admin.role,
    })

    process.exit(0)
  } catch (error) {
    console.error("Error creating admin:", error)
    process.exit(1)
  }
}

createAdmin()
