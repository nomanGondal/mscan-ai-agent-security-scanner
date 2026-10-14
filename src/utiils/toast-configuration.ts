"use client"

import { toast, ToastOptions } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 1500,
  hideProgressBar: true,
  pauseOnHover: true,
  closeOnClick: true,
  draggable: true,
  theme: "colored",
}

const showToast = (
  message: string,
  type: "success" | "error" | "info" | "warning" = "info"
) => {
  const customStyle = {
    backgroundColor: "#111",
    color: "#fffffff",
    fontWeight: "bold",
    fontSize: "14px",
    borderRadius: "6px",
  }

  switch (type) {
    case "success":
      toast.success(message, { ...defaultOptions, style: customStyle })
      break
    case "error":
      toast.error(message, { ...defaultOptions, style: customStyle })
      break
    case "warning":
      toast.warning(message, { ...defaultOptions, style: customStyle })
      break
    default:
      toast.info(message, { ...defaultOptions, style: customStyle })
      break
  }
}

export { showToast }
