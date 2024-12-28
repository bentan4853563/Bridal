import React, { useState } from "react";
import { Button, Divider } from "@mui/material";
import { toast } from "react-toastify";
import { CiImageOn } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { handleCreateProduct } from "../../../actions/product";
import { Link } from "react-router-dom";

// Define the structure of form data
interface FormData {
  name: string;
  primaryPhoto: File | null;
  type: string;
  rentalCostPerDay: number;
  status: string;
}

// Define possible validation errors
interface Errors {
  name?: string;
  primaryPhoto?: string;
  rentalCostPerDay?: string;
  status?: string;
  fileType?: string; // Error for invalid file type
}

const CreateProduct: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    primaryPhoto: null,
    type: "Track quantities",
    rentalCostPerDay: 0,
    status: "Draft",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [primaryPhotoPreview, setPrimaryPhotoPreview] = useState<string | null>(
    null
  );

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle file selection and validation
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

      setFormData((prev) => ({ ...prev, primaryPhoto: file }));
      setPrimaryPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Validate form inputs
  const validateForm = (): Errors => {
    const newErrors: Errors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.primaryPhoto)
      newErrors.primaryPhoto = "Primary photo is required";
    if (formData.rentalCostPerDay <= 0)
      newErrors.rentalCostPerDay = "Rental cost must be greater than zero";
    return newErrors;
  };

  // Handle form submission
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
      formDataToSubmit.append("type", formData.type);

      try {
        await handleCreateProduct(formDataToSubmit, () => {
          toast.success("Product created successfully.");
          resetForm();
        });
      } catch (error) {
        toast.error("Error creating product.");
        console.error("Error:", error);
      }
    }
  };

  // Reset the form fields
  const resetForm = () => {
    setFormData({
      name: "",
      primaryPhoto: null,
      type: "Track individually",
      rentalCostPerDay: 0,
      status: "Draft",
    });
    setPrimaryPhotoPreview(null);
    setErrors({});
  };

  // Handle closing the primary photo preview
  const handleClosePrimaryPhoto = (event: React.MouseEvent<SVGElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setPrimaryPhotoPreview(null);
    setFormData((prev) => ({ ...prev, primaryPhoto: null }));
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-start p-6 border-b border-gray-200">
        <span className="text-2xl">
          <Link to="/inventory/products" className="hover:underline">
            Products
          </Link>{" "}
          / New Product
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="h-full overflow-y-auto p-12 bg-gray-100 flex flex-col gap-4"
      >
        {/* General Information Section */}
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-12">
          <div className="xl:max-w-xs xl:px-8 flex flex-col items-start xl:gap-4">
            <span className="font-bold text-lg">General Information</span>
            <p className="text-justify text-sm text-gray-600">
              Start with a name and image for your product. This will be
              displayed to customers in the online store and on documents.
            </p>
          </div>

          <div className="w-full max-w-2xl bg-white rounded-lg p-8 flex flex-wrap gap-8">
            <div className="flex flex-col flex-1 items-start">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border rounded-md"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            <div className="flex flex-col">
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
                      alt="Upload Preview"
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
              {errors.primaryPhoto && (
                <span className="text-red-500 text-sm">
                  {errors.primaryPhoto}
                </span>
              )}
            </div>
          </div>
        </div>

        <Divider />
        {/* Pricing Section */}
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-12">
          <div className="xl:max-w-xs xl:px-8 flex flex-col items-start xl:gap-4">
            <span className="font-bold text-lg">Pricing</span>
            <p className="text-justify text-sm text-gray-600">
              Determines how the price will be calculated for a rental period.
            </p>
            <p className="text-justify text-sm text-gray-600">
              You can configure additional settings for pricing after the
              product has been created.
            </p>
          </div>

          <div className="w-full max-w-2xl bg-white rounded-lg p-8">
            {/* Rental Cost/Day Input */}
            <div className="flex flex-col items-start">
              <label htmlFor="rentalCostPerDay">Rental Cost / Day ($)</label>
              <input
                type="number"
                id="rentalCostPerDay"
                className="w-full p-2 border rounded-md"
                value={formData.rentalCostPerDay}
                onChange={handleChange}
              />
              {errors.rentalCostPerDay && (
                <span className="text-red-500 text-sm">
                  {errors.rentalCostPerDay}
                </span>
              )}
            </div>
          </div>
        </div>

        <Divider />
        {/* Submit Button Section */}
        <div className="max-w-5xl flex justify-end gap-4 mt-2">
          <Link to="/inventory/products">
            <Button variant="outlined">Cancel</Button>
          </Link>
          <Button type="submit" variant="contained" color="primary">
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
