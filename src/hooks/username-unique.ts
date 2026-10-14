import { checkUsernameUniquness } from "@/services";
import { AuthStatus } from "@/types";
import React from "react";
import * as z from "zod";
import { usernameSchema } from "@/schemas";
import { useToggle } from "react-use";

const useUsernameUniqueness = () => {
  const [
    usernameUniquenessCheckingResponse,
    setUsernameUniquenessCheckingResponse,
  ] = React.useState<AuthStatus>({
    error: "",
    success: "",
  });
  const [isCheckingUsernameUniquness, setIsUsernameCheckingUniqueness] =
    useToggle(false);
  const controllerForCheckingUsernameIsUnique =
    React.useRef<AbortController | null>(null);

  const setError = (message: string) => {
    setUsernameUniquenessCheckingResponse((prev) => ({
      ...prev,
      success: "",
      error: message,
    }));
  };

  const setSuccess = (message: string) => {
    setUsernameUniquenessCheckingResponse((prev) => ({
      ...prev,
      success: message,
      error: "",
    }));
  };

  const checkUsername = async (data: z.infer<typeof usernameSchema>) => {
    setSuccess("");
    setError("");
    setIsUsernameCheckingUniqueness(true);
    if (controllerForCheckingUsernameIsUnique.current) {
      controllerForCheckingUsernameIsUnique.current.abort();
    }
    const newController = new AbortController();
    controllerForCheckingUsernameIsUnique.current = newController;
    const response = await checkUsernameUniquness({
      username: data,
      signal: newController.signal,
    });
    if (response.message === "Request cancelled") {
      setIsUsernameCheckingUniqueness(false);
      return;
    }
    if (response.success) {
      setSuccess(response.message);
    } else {
      setError(response.message);
    }
    setIsUsernameCheckingUniqueness(false);
  };
  return {
    usernameUniquenessCheckingResponse,
    checkUsername,
    isCheckingUsernameUniquness,
  };
};

export { useUsernameUniqueness };
