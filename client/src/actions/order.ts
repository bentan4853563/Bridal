import { ApiError } from "../types";
import axiosInstance from "./api";
import { toast } from "react-toastify";

import {setOrders} from '../redux/reducers/orderSlice'

export const handleReserve = async (
  formData: object,
  onSuccess: () => void
) => {
  try {
    await axiosInstance.post("/api/orders/reserve", formData);
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

export const handleGetOrders = async (page: number, limit: number) => {
  try {
    const response = await axiosInstance.get(
      `/api/orders/list?page=${page}&limit=${limit}`  
    );
    setOrders(response.data);
    return response.data.orders;
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

export const handleGetOrdersByCustomer = async(id: string, page: number, limit: number) => {
  try {
    const response = await axiosInstance.post(
      `/api/orders/list-by-customer`, {id, page, limit}
    );
    return response.data.orders;
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

export const handleOrderPay = async (id: string) => {
  try {
    const response = await axiosInstance.post("/api/orders/pay", { id });
    toast.success("Success!");
    return response.data;
  } catch (err) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};


export const handleUpdateCustomer = async (
  id: string,
  formData: object,
  onSuccess: () => void
) => {
  try {
    await axiosInstance.put(`/api/customers/update/${id}`, formData);

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

export const handleGetOrderById = async (
  id: string,
) => {
  try {
    const response = await axiosInstance.get(`/api/orders/one/${id}`);

    return response.data
  } catch (err: unknown) {
    const error = err as ApiError;
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};


export const handleGetCustomers = async (page: number, limit: number) => {
  try {
    const response = await axiosInstance.get(
      `/api/customers/list?page=${page}&limit=${limit}`
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

export const handleGetAllCustomers = async () => {
  try {
    const response = await axiosInstance.get("/api/customers/all");

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

export const handleGetCustomerData = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/api/customers/one?id=${id}`);

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

export const handleDeleteCustomer = async (
  id: string,
  onSuccess: () => void
) => {
  try {
    await axiosInstance.delete(`/api/customers/delete/${id}`);
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
