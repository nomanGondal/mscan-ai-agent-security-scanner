import { API_ENDPOINTS } from "@/actions";
import { ApiResponse } from "@/types";
import axios, { AxiosError } from "axios";

type RecoveryMode = "username" | "email";

interface RequestPasswordRecoveryCodeProps {
  signal?: AbortSignal;
  recoveryMode: RecoveryMode;
  identifier: string;
}

interface ResetPasswordRecoveryProps {
  signal?: AbortSignal;
  recoveryMode: RecoveryMode;
  identifier: string;
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}

const requestPasswordRecoveryCode = async ({
  signal,
  recoveryMode,
  identifier,
}: RequestPasswordRecoveryCodeProps): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.forgotPasswordRequestCode,
      {
        recoveryMode,
        identifier,
      },
      { signal },
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiResponse>;
    if (axiosError.code === "ERR_CANCELLED") {
      return {
        success: false,
        message: "Request cancelled",
      };
    }
    if (axiosError.response) {
      return axiosError.response.data;
    }
    return {
      success: false,
      message: "Network Error",
    };
  }
};

const resetPasswordRecovery = async ({
  signal,
  recoveryMode,
  identifier,
  verificationCode,
  newPassword,
  confirmPassword,
}: ResetPasswordRecoveryProps): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.forgotPasswordReset,
      {
        recoveryMode,
        identifier,
        verificationCode,
        newPassword,
        confirmPassword,
      },
      { signal },
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiResponse>;
    if (axiosError.code === "ERR_CANCELLED") {
      return {
        success: false,
        message: "Request cancelled",
      };
    }
    if (axiosError.response) {
      return axiosError.response.data;
    }
    return {
      success: false,
      message: "Network Error",
    };
  }
};

export { requestPasswordRecoveryCode, resetPasswordRecovery };
