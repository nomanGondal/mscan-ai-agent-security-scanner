import { API_ENDPOINTS } from "@/actions";
import { ApiResponse } from "@/types";
import axios, { AxiosError } from "axios";
import * as z from "zod";

interface VERIFICATIONCODEPROPS {
  username: string;
  verificationCode: string;
  signal: AbortSignal;
}

const verifyCode = async ({
  username,
  signal,
  verificationCode,
}: VERIFICATIONCODEPROPS): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      `${API_ENDPOINTS.verificationCode}?username=${username}&verificationCode=${verificationCode}`,
      null,
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

export { verifyCode };
