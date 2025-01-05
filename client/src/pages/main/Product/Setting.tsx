import React, { useEffect, useState } from "react";
import { Autocomplete, Button, Divider, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { CiImageOn } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { HiOutlineVideoCamera } from "react-icons/hi2";

import {
  handleDeleteProduct,
  handleGetProductData,
  handleUpdateProduct,
} from "../../../actions/product";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addBaseURL } from "../../../utils/addBaseURL";
import { Category } from "../../../types";
import { handleGetCategoryList } from "../../../actions/category";

interface FormData {
  name: string;
  primaryPhoto: File | null;
  secondaryPhotos: File[];
  imagePreviews: string[];
  videos: File[];
  videoPreviews: string[];
  rentalCostPerDay: number;
  category: string;
  subCategories: Array<string>;
  image: string;
}

interface Errors {
  name?: string;
  primaryPhoto?: string;
  rentalCostPerDay?: string;
  quantity?: string;
  status?: string;
  fileType?: string; // New error for file type
  category?: string;
  subCategories?: string; // Specify the type of elements in the array
}

export default function Setting() {
  const params = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allSubCategories, setAllSubCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [secondaryPhotoPreviews, setSecondaryPhotoPreviews] = useState<
    string[]
  >([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    primaryPhoto: null,
    secondaryPhotos: [],
    imagePreviews: [],
    videos: [],
    videoPreviews: [],
    rentalCostPerDay: 0,
    category: "",
    subCategories: [],
    image: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [primaryPhotoPreview, setPrimaryPhotoPreview] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryList = await handleGetCategoryList();
        if (categoryList) {
          setCategories(categoryList);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (params.id && categories.length > 0) {
      const fetchProductData = async () => {
        if (params.id && categories.length > 0) {
          setLoading(true);
          const data = await handleGetProductData(params.id);
          if (data.category) {
            const categoryData = categories.find(
              (item) => item._id == data.category
            );
            setCategory(categoryData || null);
            setAllSubCategories(categoryData?.subCategories || []);
            setSubCategories(data.subCategories);
          }

          if (data) {
            setFormData(data);
            setPrimaryPhotoPreview(addBaseURL(data.image));
            setSecondaryPhotoPreviews(
              data.secondaryImages.map((url: string) => addBaseURL(url))
            );
            setVideoPreviews(
              data.videoUrls.map((url: string) => addBaseURL(url))
            );
          }
          setLoading(false);
        }
      };

      fetchProductData();
    }
  }, [params.id, categories]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0] || null;

  //   if (file) {
  //     const fileType = file.type;

  //     // Validate file type
  //     if (!fileType.startsWith("image/")) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         fileType: "Only image files are allowed.",
  //       }));
  //       return;
  //     }

  //     // Clear previous file type error if validation passes
  //     setErrors((prev) => ({ ...prev, fileType: undefined }));

  //     setFormData({ ...formData, primaryPhoto: file });
  //     setPrimaryPhotoPreview(URL.createObjectURL(file));
  //   }
  // };

const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0] || null;
  const name = event.target.name;

  if (file) {
    const fileType = file.type;

    // Validate file type
    if (name === "primaryPhoto" || name === "secondaryPhotos") {
      if (!fileType.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          fileType: "Only image files are allowed.",
        }));
        return;
      }
    } else if (name === "videos") {
      if (!fileType.startsWith("video/")) {
        setErrors((prev) => ({
          ...prev,
          fileType: "Only video files are allowed.",
        }));
        return;
      }
    }

    // Clear previous file type error if validation passes
    setErrors((prev) => ({ ...prev, fileType: undefined }));

    if (name === "primaryPhoto") {
      setFormData({ ...formData, primaryPhoto: file });
      setPrimaryPhotoPreview(URL.createObjectURL(file));
    } else if (name === "secondaryPhotos") {
      // Ensure secondaryPhotos is initialized as an array
      setFormData((prev) => ({
        ...prev,
        secondaryPhotos: [...(prev.secondaryPhotos || []), file], // Use prev.secondaryPhotos safely
      }));
      setSecondaryPhotoPreviews((prev) => [...prev, URL.createObjectURL(file)]);
    } else if (name === "videos") {
      setFormData((prev) => ({
        ...prev,
        videos: [...(prev.videos || []), file], // Use prev.videos safely
      }));
      setVideoPreviews((prev) => [...prev, URL.createObjectURL(file)]);
    }
  }
};
  const validateForm = (): Errors => {
    const newErrors: Errors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.primaryPhoto && !formData.image)
      newErrors.primaryPhoto = "Primary photo is required";
    if (formData.rentalCostPerDay <= 0)
      newErrors.rentalCostPerDay = "Rental cost must be greater than zero";
    return newErrors;
  };

  const handleCategoryChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: Category | null
  ) => {
    setCategory(value);
    setAllSubCategories(value?.subCategories || []);
    setFormData({ ...formData, category: value ? value._id : "" });
  };

  const handleSubCategoryChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string[]
  ): void => {
    // Explicitly specifying the return type as void
    setSubCategories(value || []);
    setFormData({ ...formData, subCategories: value }); // Update formData with IDs
  };

  const handleCloseSecondaryPhoto = (index: number) => {
    setSecondaryPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCloseVideo = (index: number) => {
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
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
      if (primaryPhotoPreview) {
        formDataToSubmit.append(
          "image",
          primaryPhotoPreview.replace(import.meta.env.VITE_BACKEND_URL, "")
        );
      }
      if (formData.secondaryPhotos && formData.secondaryPhotos.length > 0) {
        formData.secondaryPhotos.forEach((photo) => {
          formDataToSubmit.append("secondaryPhotos", photo);
        });
      }
      if (secondaryPhotoPreviews.length > 0) {
        secondaryPhotoPreviews.forEach((photo) => {
          formDataToSubmit.append("secondaryImages", photo.replace(import.meta.env.VITE_BACKEND_URL, ""));
        });
      }
      if (formData.videos && formData.videos.length > 0) {
        formData.videos.forEach((video) => {
          formDataToSubmit.append("videos", video);
        });
      }
      if (videoPreviews.length > 0) {
        videoPreviews.forEach((video) => {
          formDataToSubmit.append(
            "videoUrls",
            video.replace(import.meta.env.VITE_BACKEND_URL, "")
          );
        });
      }
      formDataToSubmit.append(
        "rentalCostPerDay",
        formData.rentalCostPerDay.toString()
      );
      formDataToSubmit.append("category", formData.category);
      // Append each subCategory individually
      if (formData.subCategories && Array.isArray(formData.subCategories)) {
        formData.subCategories.forEach((subCategory) => {
          formDataToSubmit.append("subCategories", subCategory); // Use "subCategories[]" to indicate an array
        });
      }

      try {
        if (params.id) {
          handleUpdateProduct(params.id, formDataToSubmit, () => {
            toast.success("Product created successfully.");
          });
        }
      } catch (error) {
        toast.error("Error creating product.");
        console.error("Error:", error);
      }
    }
  };

  // const resetForm = () => {
  //   setFormData({
  //     name: "",
  //     primaryPhoto: null,
  //     image: "",
  //     rentalCostPerDay: 0,
  //     category: "",
  //     subCategories: [],
  //   });
  //   setPrimaryPhotoPreview(null);
  //   setErrors({});
  // };

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
        "Loading Product Data"
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
                {/* Name */}
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

                <Autocomplete
                  disablePortal
                  options={categories}
                  getOptionLabel={(option) => option.name}
                  value={category}
                  onChange={handleCategoryChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Category" size="small" />
                  )}
                />
                <Autocomplete
                  multiple
                  id="sub-categories"
                  options={allSubCategories}
                  onChange={handleSubCategoryChange}
                  value={subCategories}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Subcategories"
                      placeholder="Select subcategories"
                    />
                  )}
                />
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
          {/* Media Section */}
          <div className="flex flex-col xl:flex-row gap-4 xl:gap-12">
            <div className="xl:max-w-xs xl:px-8 flex flex-col items-start xl:gap-4">
              <span className="font-bold text-lg">Images and Videos</span>
              <p className="text-justify text-sm text-gray-600">
                Determines how the price will be calculated for a rental period.
              </p>
              <p className="text-justify text-sm text-gray-600">
                You can configure additional settings for pricing after the
                product has been created.
              </p>
            </div>

            <div className="w-full max-w-2xl flex flex-col gap-4 bg-white rounded-lg p-8">
              {/* Secondary Photos */}
              <div className="flex flex-col items-start">
                <span>Secondary Photos</span>
                <div className="flex flex-wrap gap-2">
                  {secondaryPhotoPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Secondary Preview ${index + 1}`}
                        loading="lazy"
                        className="w-16 sm:w-32 h-16 sm:h-32 rounded-lg"
                      />
                      <IoMdClose
                        onClick={() => handleCloseSecondaryPhoto(index)}
                        className="absolute top-2 right-2 text-white text-2xl cursor-pointer"
                      />
                    </div>
                  ))}
                  <div className="border rounded-lg hover:border-sky-300">
                    <input
                      type="file"
                      id="secondaryPhotos"
                      name="secondaryPhotos"
                      className="hidden"
                      accept="image/*" // Restrict to image files
                      onChange={handleFileSelect}
                    />
                    <label
                      htmlFor="secondaryPhotos"
                      className="flex justify-center w-full h-full cursor-pointer"
                    >
                      <div className="w-16 sm:w-32 h-16 sm:h-32 p-4 border rounded-lg hover:border-sky-300 flex flex-col items-center justify-center gap-2">
                        <CiImageOn className="text-3xl" />
                        <span className="hidden sm:block">Secondary Image</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Videos */}
              <div className="flex flex-col items-start">
                <span>Videos</span>
                <div className="flex flex-wrap gap-2">
                  {videoPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <video controls width="250">
                        <source src={preview} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <IoMdClose
                        onClick={() => handleCloseVideo(index)}
                        className="absolute top-2 right-2 text-white text-2xl cursor-pointer"
                      />
                    </div>
                  ))}
                  <div className="border rounded-lg hover:border-sky-300">
                    <input
                      type="file"
                      id="videos"
                      name="videos"
                      className="hidden"
                      accept="video/*" // Restrict to video files
                      onChange={handleFileSelect}
                    />
                    <label
                      htmlFor="videos"
                      className="flex justify-center w-full h-full cursor-pointer"
                    >
                      <div className="w-16 sm:w-32 h-16 sm:h-32 p-4 border rounded-lg hover:border-sky-300 flex flex-col items-center justify-center gap-2">
                        <HiOutlineVideoCamera className="text-3xl" />
                        <span className="hidden sm:block">Upload Video</span>
                      </div>
                    </label>
                  </div>
                </div>
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
