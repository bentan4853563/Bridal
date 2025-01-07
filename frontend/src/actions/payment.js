import axiosInstance from "./api";
import { toast } from "react-toastify";

export const handleCreatePayment = async (
  paymentData,
  onSuccess
) => {
  try {
    const response = await axiosInstance.post(
      "/api/payments/create",
      paymentData
    );
    if (response.status === 201) {
      toast.success("Payment created successfully");
      onSuccess(response.data);
    }
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetPaymentById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/payments/get-by-id/${id}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleUpdatePayment = async (id, paymentData, onSuccess) => {
  try {
    const response = await axiosInstance.put(
      `/api/payments/update/${id}`,
      paymentData
    );
    if (response.status === 200) {
      toast.success("Payment updated successfully");
      onSuccess();
    }
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
}
