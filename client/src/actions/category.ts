import { ApiError } from "../types";
import axiosInstance from "./api";
import { toast } from "react-toastify";

export const handleAddCategory = async (category: string) => {
  try {
    const response = await axiosInstance.post("/api/category/add", {category});

    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleAddSubCategory = async (subcategory: string) => {
  try {
    const response = await axiosInstance.post(
      "/api/sub-category/add",
      {subcategory}
    );

    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetCategoryList = async () => {
  try {
    const response = await axiosInstance.get("/api/category/all");

    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetSubCategoryList = async () => {
  try {
    const response = await axiosInstance.get("/api/sub-category/all");

    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};


export const handleDeleteCategory = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/api/category/${id}`);

    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleDeleteSubCategory = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/api/sub-category/${id}`);

    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

