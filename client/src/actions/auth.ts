import { ApiError } from "../types";
import axiosInstance from "./api";
import { toast } from "react-toastify";

export const handleSignup = async (
  email: string,
  password: string,
  onSuccess: () => void
) => {
  try {
    await axiosInstance.post("/api/users/signup", {
      email,
      password,
    });

    onSuccess();
  } catch (err: unknown) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleLogin = async (email: string, password: string, onSuccess: ()=> void) => {
  try {
    const response = await axiosInstance.post("/api/users/login", {
      email,
      password,
    });

    localStorage.setItem("token", response.data.csrfToken);
    onSuccess();
  } catch (err: unknown) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
}

export const handleForgotPassword = async (email: string, onSuccess: () => void) => {
  try {
    await axiosInstance.post("/api/users/forgot-password", {
      email,
    });

    onSuccess();
  } catch (err: unknown) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const resetPassword = async (
  token: string,
  password: string,
) => {
  try {
    await axiosInstance.post("/api/users/reset-password", {
      token, 
      password,
    });

  } catch (err: unknown) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};
