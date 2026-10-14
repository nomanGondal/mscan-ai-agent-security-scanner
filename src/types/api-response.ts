import { string } from "zod"

export interface ApiResponse {
  success: boolean
  message: string
  data?: unknown
}

export interface ImageUploadingResponse {
  success: boolean
  message: string
  data?: {
    secure_url: string
  }
}

export interface IUSERDETSRESPONSE {
  username: string
  fullName: string
  email: string
  persona: string
  isActive: boolean
  isUserVerified: boolean
  profilePicture?: {
    url: string
  }
  createdAt: Date
}

export interface IUserApiResponse {
  success: boolean
  message: string
  data?: IUSERDETSRESPONSE
}

export interface AccountDetailsData {
  plan: string
  trialStartDate: Date
  isTrialActive: boolean
  subscriptionStatus: string
  reportsUsed: number
  reportsLimit: number
  trialEndDate: Date
  createdAt: Date
}

export interface AccountDetailsApiResponse {
  success: boolean
  message: string
  data?: AccountDetailsData
}
