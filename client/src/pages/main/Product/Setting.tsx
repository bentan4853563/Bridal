import React, { useEffect, useState } from "react";
import { Button, Divider } from "@mui/material";
import { toast } from "react-toastify";
import { CiImageOn } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import {
  handleDeleteProduct,
  handleGetProductData,
  handleUpdateProduct,
} from "../../../actions/product";
import { Link, useNavigate, useParams } from "react-router-dom";

interface FormData {
  name: string;
  primaryPhoto: File | null;
  rentalCostPerDay: number;
  category: string;
  subCategory: string;
  status: string;
}

interface Errors {
  name?: string;
  primaryPhoto?: string;
  rentalCostPerDay?: string;
  quantity?: string;
  status?: string;
  fileType?: string; // New error for file type
  category?: string;
  subCategory?: string;
}

export default function Setting() {
  const params = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    primaryPhoto: null,
    rentalCostPerDay: 0,
    status: "Draft",
    category: "",
    subCategory: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [primaryPhotoPreview, setPrimaryPhotoPreview] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchProductData = async () => {
      if (params.id) {
        setLoading(true);
        const data = await handleGetProductData(params.id);

        if (data) {
          setFormData(data);
          setPrimaryPhotoPreview(data.image);
        }
        setLoading(false);
      }
    };

    fetchProductData();
  }, [params.id]);

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
      if (formData.primaryPhoto) {
        formDataToSubmit.append("primaryPhoto", formData.primaryPhoto);
      }
      formDataToSubmit.append(
        "rentalCostPerDay",
        formData.rentalCostPerDay.toString()
      );
      formDataToSubmit.append("category", formData.category);
      formDataToSubmit.append("subCategory", formData.subCategory);
      formDataToSubmit.append("status", formData.status);

      try {
        if (params.id) {
          handleUpdateProduct(params.id, formDataToSubmit, () => {
            toast.success("Product created successfully.");
            resetForm();
          });
        }
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
      status: "Draft",
      category: "",
      subCategory: "",
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

  const deleteProduct = () => {
    if (params.id) {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (isConfirmed) {
        handleDeleteProduct(params.id, () => {
          toast.success("Customer deleted successfully.");
          navigate("/inventory/products");
        });
      }
    } else {
      toast.error("Customer ID is not defined.");
    }
  };

  return (
    <div className="w-full mx-auto">
      {loading ? (
        "Loading Proeduct Data"
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-12 bg-gray-100 flex flex-col gap-4"
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
              <div className="w-full flex-1 flex flex-col gap-4">
                {/* Nam */}
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

                {/* Category */}
                <div className="flex flex-col flex-1 items-start">
                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    id="category"
                    className="w-full p-2 border rounded-md"
                    value={formData.category}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm">
                      {errors.category}
                    </span>
                  )}
                </div>

                {/* SubCategory */}
                <div className="flex flex-col flex-1 items-start">
                  <label htmlFor="subCategory">Sub Category</label>
                  <input
                    type="text"
                    id="subCategory"
                    className="w-full p-2 border rounded-md"
                    value={formData.subCategory}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm">
                      {errors.subCategory}
                    </span>
                  )}
                </div>
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
          {/* Product Type Section */}
          {/* <div className="flex flex-col xl:flex-row gap-4 xl:gap-12">
            <div className="xl:max-w-xs xl:px-8 flex flex-col items-start xl:gap-4">
              <span className="font-bold text-lg">Product Type</span>
              <p className="text-justify text-sm text-gray-600">
                The tracking method determines how detailed a product's
                inventory is tracked.
              </p>
            </div>

            <div className="w-full max-w-2xl bg-white rounded-lg p-8 flex flex-col lg:flex-row gap-8">
              <div
                onClick={() => handleChangeProductType("Track individually")}
                className="flex flex-col flex-1 border rounded-lg cursor-pointer"
              >
                <div className="lg:min-h-44 py-4 flex items-start">
                  <Radio
                    checked={formData.type === "Track individually"}
                    value="Track individually"
                    name="product-type"
                    inputProps={{ "aria-label": "Track individually" }}
                  />
                  <div className="flex flex-col items-start gap-2">
                    <h4 className="font-bold">Track Individually</h4>
                    <p className="text-left">
                      Monitor unique items separately. Ideal for products with
                      specific identifiers or individual tracking needs.
                    </p>
                  </div>
                </div>
                <Divider />
                <div className="bg-amber-100 flex flex-col items-start p-4">
                  <span>Example</span>
                  <img
                    src={trackIndividuallyImg}
                    alt="Track Individually Example"
                    className="w-64 h-32 object-cover rounded-lg"
                  />
                </div>
              </div>

              <div
                onClick={() => handleChangeProductType("Track quantities")}
                className="flex flex-col flex-1 border rounded-lg cursor-pointer"
              >
                <div className="lg:min-h-44 py-4 flex items-start">
                  <Radio
                    checked={formData.type === "Track quantities"}
                    value="Track quantities"
                    name="product-type"
                    inputProps={{ "aria-label": "Track quantities" }}
                  />
                  <div className="flex flex-col items-start gap-2">
                    <h4 className="font-bold">Track Quantities</h4>
                    <p className="text-left">
                      Monitor inventory in bulk. Ideal for products that are
                      sold in larger quantities.
                    </p>
                  </div>
                </div>
                <Divider />
                <div className="bg-amber-100 flex flex-col items-start p-4">
                  <span>Example</span>
                  <img
                    src={trackQuantitiesImg}
                    alt="Track Quantities Example"
                    className="w-64 h-32 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div> */}

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
          <div className="max-w-5xl flex justify-between items-center">
            <Button variant="contained" color="error" onClick={deleteProduct}>
              Delete Product
            </Button>
            <div className="flex justify-end gap-4 mt-2">
              <Link to="/inventory/products">
                <Button variant="outlined">Cancel</Button>
              </Link>
              <Button type="submit" variant="contained" color="primary">
                Update Product
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
