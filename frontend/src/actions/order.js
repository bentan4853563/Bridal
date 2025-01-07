import axiosInstance from "./api";
import { toast } from "react-toastify";

export const handleReserve = async (
  formData,
  onSuccess
) => {
  try {
    await axiosInstance.post("/api/orders/reserve", formData);
    onSuccess();
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetOrders = async (page, limit) => {
  try {
    const response = await axiosInstance.get(
      `/api/orders/list?page=${page}&limit=${limit}`  
    );
    return response.data.orders;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetAllOrders = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/orders/all"
    );
    return response.data.orders;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetOrdersByCustomer = async(id, p0, pageSize) => {
  try {
    const response = await axiosInstance.post(
      `/api/orders/list-by-customer`, {id}
    );

    console.log('p0, pageSize :>> ', p0, pageSize);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleOrderPay = async (id) => {
  try {
    const response = await axiosInstance.post("/api/orders/pay", { id });
    toast.success("Success!");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleUpdateCustomer = async (
  id,
  formData,
  onSuccess
) => {
  try {
    await axiosInstance.put(`/api/customers/update/${id}`, formData);

    onSuccess();
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetOrderById = async (
  id,
) => {
  try {
    const response = await axiosInstance.get(`/api/orders/one/${id}`);

    return response.data
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetCustomers = async (page, limit) => {
  try {
    const response = await axiosInstance.get(
      `/api/customers/list?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetAllCustomers = async () => {
  try {
    const response = await axiosInstance.get("/api/customers/all");

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetCustomerData = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/customers/one?id=${id}`);

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleDeleteCustomer = async (
  id,
  onSuccess
) => {
  try {
    await axiosInstance.delete(`/api/customers/delete/${id}`);
    onSuccess();
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleDeleteOrder = async (
  id,
) => {
  try {
    const response = await axiosInstance.delete(`/api/orders/delete/${id}`);
    toast.success("Deleted order successfully")
    return response.data
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};
