import React, { useState } from "react";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { CiImageOn } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { handleCreateProduct } from "../../../actions/product";

interface FormData {
  name: string;
  primaryPhoto: File | null;
  rentalCostPerDay: number;
  quantity: number;
  status: string;
}

interface Errors {
  name?: string;
  primaryPhoto?: string;
  rentalCostPerDay?: string;
  quantity?: string;
  status?: string;
  fileType?: string; // New error for file type
}

export default function CreateProduct() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    primaryPhoto: null,
    rentalCostPerDay: 0,
    quantity: 0,
    status: "Draft",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [primaryPhotoPreview, setPrimaryPhotoPreview] = useState<string | null>(
    null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      const fileType = file.type;

      // Validate file type
      if (!fileType.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          fileType: "Only image files are allowed.",
        }));
        return;
      }

      // Clear previous file type error if validation passes
      setErrors((prev) => ({ ...prev, fileType: undefined }));

      setFormData({ ...formData, primaryPhoto: file });
      setPrimaryPhotoPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.primaryPhoto)
      newErrors.primaryPhoto = "Primary photo is required";
    if (formData.rentalCostPerDay <= 0)
      newErrors.rentalCostPerDay = "Rental cost must be greater than zero";
    if (formData.quantity < 0)
      newErrors.quantity = "Quantity cannot be negative";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const formDataToSubmit = new FormData();
      
      formDataToSubmit.append("name", formData.name);
      if (formData.primaryPhoto)
        formDataToSubmit.append("primaryPhoto", formData.primaryPhoto);
      formDataToSubmit.append(
        "rentalCostPerDay",
        formData.rentalCostPerDay.toString()
      );
      formDataToSubmit.append("quantity", formData.quantity.toString());
      formDataToSubmit.append("status", formData.status);

      try {
        await handleCreateProduct(formDataToSubmit);
        toast.success("Product created successfully.");
        resetForm();
      } catch (error) {
        toast.error("Error creating product.");
        console.error("Error:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      primaryPhoto: null,
      rentalCostPerDay: 0,
      quantity: 0,
      status: "Draft",
    });
    setPrimaryPhotoPreview(null);
    setErrors({});
  };

  const handleClosePrimaryPhoto = (event: React.MouseEvent<SVGElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setPrimaryPhotoPreview(null);
    setFormData({ ...formData, primaryPhoto: null });
  };

  return (
    <div className="bg-gray-100 p-4 md:p-12 lg:p-32 text-black overflow-y-auto h-full">
      <form className="w-full xl:w-4/5 mx-auto" onSubmit={handleSubmit}>
        <div className="p-10 bg-white border-gray-100 rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="col-span-1 flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col items-start">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border rounded-md"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <span className="text-sm text-red-500">{errors.name}</span>
              )}
            </div>

            {/* Primary Photo */}
            <div className="flex flex-col items-start">
              <span>Primary photo</span>
              <div className="flex">
                <input
                  type="file"
                  id="primaryPhoto"
                  name="primaryPhoto"
                  className="hidden"
                  accept="image/*" // Restrict to image files
                  onChange={handleFileSelect}
                />
                <label htmlFor="primaryPhoto" className="cursor-pointer">
                  {primaryPhotoPreview ? (
                    <div className="relative">
                      <img
                        src={primaryPhotoPreview}
                        className="w-24 sm:w-48 h-24 sm:h-48 object-cover rounded-lg"
                        alt="Upload"
                        loading="lazy"
                      />
                      <IoMdClose
                        onClick={handleClosePrimaryPhoto}
                        className="absolute top-2 right-2 text-white text-2xl cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div className="w-24 sm:w-48 h-24 sm:h-48 p-4 border rounded-lg hover:border-sky-300 flex flex-col items-center justify-center gap-2">
                      <CiImageOn className="text-3xl" />
                      <span className="hidden sm:block">Primary Image</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Rental Cost/Day */}
            <div className="flex flex-col items-start">
              <label htmlFor="rentalCostPerDay">Rental Cost / Day</label>
              <input
                type="number"
                id="rentalCostPerDay"
                className="w-full p-2 border rounded-md"
                value={formData.rentalCostPerDay}
                onChange={handleChange}
              />
              {errors.rentalCostPerDay && (
                <span className="text-sm text-red-500">
                  {errors.rentalCostPerDay}
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex flex-col items-start">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                className="w-full p-2 border rounded-md"
                value={formData.quantity}
                onChange={handleChange}
              />
              {errors.quantity && (
                <span className="text-sm text-red-500">{errors.quantity}</span>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col items-start">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                className="w-full p-2 border rounded-md"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-2">
          <Button variant="outlined">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}
