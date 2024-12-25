import axios from "axios";
import { ApiError } from "../types";
import axiosInstance from "./api";
import { toast } from "react-toastify";

export const handleCreateProduct = async (
  formData: FormData,
  onSuccess: () => void
) => {
  try {
    console.log("===========>");
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
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

export const handleUpdateProduct = async (
  id: string,
  formData: object,
  onSuccess: () => void
) => {
  try {
    await axiosInstance.put(`/api/products/update/${id}`, formData);
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

export const handleAddStockItem = async (id: string, quantity: number) => {
  try {
    const response = await axiosInstance.put(`/api/products/add-stock/${id}`, {quantity});
    console.log('response :>> ', response);
  } catch (err) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetProducts = async (page: number, limit: number) => {
  try {
    const response = await axiosInstance.get(
      `/api/products/list?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    return null;
  }
};

export const handleGetProductData = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/api/products/one?id=${id}`);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    return null;
  }
};

export const handleDeleteProduct = async (
  id: string,
  onSuccess: () => void
) => {
  try {
    await axiosInstance.delete(`/api/products/delete/${id}`);
    onSuccess();
  } catch (err: unknown) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    return null;
  }
};
