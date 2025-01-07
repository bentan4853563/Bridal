import axiosInstance from "./api";
import { toast } from "react-toastify";

export const handleAddCategory = async (category, onSuccess) => {
  try {
    const response = await axiosInstance.post("/api/category/add", category);
    
    onSuccess(response.data);
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleUpdateCategory = async(id, categoryData, onSuccess) => {
  try {
    const response = await axiosInstance.put(`/api/category/update/${id}`, categoryData);

    onSuccess(response.data)
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
}

export const handleAddSubCategory = async (categoryId, subCategory, onSuccess) => {
  try {
    const response = await axiosInstance.put(
      `/api/category/add-subcategory/${categoryId}`,
      { subCategory }
    );

    onSuccess(response.data);
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleUpdateSubCategory = async (categoryId, oldname, newname, onSuccess) => {
  try {
    const response = await axiosInstance.put(
      `/api/category/update-subcategory/${categoryId}`,
      { oldname, newname }
    );

    onSuccess(response.data);
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
}

export const handleGetCategories = async () => {
  try {
    const response = await axiosInstance.get("/api/category/all");

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetSubCategories = async () => {
  try {
    const response = await axiosInstance.get("/api/sub-category/all");

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};


export const handleDeleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/category/delete/${id}`);

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleDeleteSubCategory = async (id, subCategory, onSuccess) => {
  try {
    const response = await axiosInstance.put(
      `/api/category/delete-subcategory/${id}`,
      { subCategory }
    );

    onSuccess(response.data);
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

