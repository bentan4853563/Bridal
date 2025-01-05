import React, { useState } from "react";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { CiImageOn } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { handleCreateProduct } from "../../../actions/product";

interface FormData {
  name: string;
  primaryPhoto: File | null;
  secondaryPhotos: File[];
  videos: File[];
  rentalCostPerDay: number;
  category: string;
  subCategory: string;
  quantity: number;
  status: string;
}

interface Errors {
  name?: string;
  primaryPhoto?: string;
  rentalCostPerDay?: string;
  category?: string;
  subCategory?: string;
  quantity?: string;
  status?: string;
  fileType?: string; // New error for file type
}

export default function ProductEdit() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    primaryPhoto: null,
    secondaryPhotos: [],
    videos: [],
    rentalCostPerDay: 0,
    category: "",
    subCategory: "",
    quantity: 0,
    status: "Draft",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [primaryPhotoPreview, setPrimaryPhotoPreview] = useState<string | null>(
    null
  );
  const [secondaryPhotoPreviews, setSecondaryPhotoPreviews] = useState<
    string[]
  >([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

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
        setFormData((prev) => ({
          ...prev,
          secondaryPhotos: [...prev.secondaryPhotos, file],
        }));
        setSecondaryPhotoPreviews((prev) => [
          ...prev,
          URL.createObjectURL(file),
        ]);
      } else if (name === "videos") {
        setFormData((prev) => ({
          ...prev,
          videos: [...prev.videos, file],
        }));
        setVideoPreviews((prev) => [...prev, URL.createObjectURL(file)]);
      }
    }
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.primaryPhoto)
      newErrors.primaryPhoto = "Primary photo is required";
    if (formData.rentalCostPerDay <= 0)
      newErrors.rentalCostPerDay = "Rental cost must be greater than zero";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subCategory)
      newErrors.subCategory = "Sub-category is required";
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
      formData.secondaryPhotos.forEach((photo) =>
        formDataToSubmit.append("secondaryPhotos", photo)
      );
      formData.videos.forEach((video) =>
        formDataToSubmit.append("videos", video)
      );
      formDataToSubmit.append(
        "rentalCostPerDay",
        formData.rentalCostPerDay.toString()
      );
      formDataToSubmit.append("category", formData.category);
      formDataToSubmit.append("subCategory", formData.subCategory);
      formDataToSubmit.append("quantity", formData.quantity.toString());
      formDataToSubmit.append("status", formData.status);

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

  const resetForm = () => {
    setFormData({
      name: "",
      primaryPhoto: null,
      secondaryPhotos: [],
      videos: [],
      rentalCostPerDay: 0,
      category: "",
      subCategory: "",
      quantity: 0,
      status: "Draft",
    });
    setPrimaryPhotoPreview(null);
    setSecondaryPhotoPreviews([]);
    setVideoPreviews([]);
    setErrors({});
  };

  const handleClosePrimaryPhoto = (event: React.MouseEvent<SVGElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setPrimaryPhotoPreview(null);
    setFormData({ ...formData, primaryPhoto: null });
  };

  const handleCloseSecondaryPhoto = (index: number) => {
    setFormData((prev) => {
      const updatedPhotos = prev.secondaryPhotos.filter((_, i) => i !== index);
      return { ...prev, secondaryPhotos: updatedPhotos };
    });
    setSecondaryPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCloseVideo = (index: number) => {
    setFormData((prev) => {
      const updatedVideos = prev.videos.filter((_, i) => i !== index);
      return { ...prev, videos: updatedVideos };
    });
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
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

            {/* Category */}
            <div className="flex flex-col items-start">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                className="w-full p-2 border rounded-md"
                value={formData.category}
                onChange={handleChange}
              />
              {errors.category && (
                <span className="text-sm text-red-500">{errors.category}</span>
              )}
            </div>

            {/* Sub-category */}
            <div className="flex flex-col items-start">
              <label htmlFor="subCategory">Sub-category</label>
              <input
                type="text"
                id="subCategory"
                className="w-full p-2 border rounded-md"
                value={formData.subCategory}
                onChange={handleChange}
              />
              {errors.subCategory && (
                <span className="text-sm text-red-500">
                  {errors.subCategory}
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

          <div className="col-span-1 flex flex-col gap-4">
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
