import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 800,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

export const notifySuccess = (message: string) =>
  toast.success(message, defaultOptions);

export const notifyFailure = (message: string) =>
  toast.error(message, defaultOptions);

export const notifyInfo = (message: string) =>
  toast.info(message, {
    ...defaultOptions,
    autoClose: false,
    hideProgressBar: false,
  });
