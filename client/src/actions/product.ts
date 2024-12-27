import axios from "axios";
import { ApiError, Product } from "../types";
import axiosInstance from "./api";
import { toast } from "react-toastify";

export const handleCreateProduct = async (
  formData: FormData,
  onSuccess: () => void
) => {
  try {
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

export const handleAddStockItem = async (
  id: string,
  quantity: number
): Promise<Product | null> => {
  try {
    const response = await axiosInstance.put(`/api/products/add-stock/${id}`, {
      quantity,
    });

    // Assuming the response contains the updated product data
    const updatedProduct: Product = response.data; // Adjust this based on your API response structure
    return updatedProduct; // Return the updated product
  } catch (err) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    return null; // Return null in case of an error
  }

  // Ensure that the function always returns a value
  return null; // This ensures that the function has a return value in all cases
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

export const handleGetAllProducts = async () => {
  try {
    const response = await axiosInstance.get("/api/products/all");

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
