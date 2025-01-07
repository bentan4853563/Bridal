export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "your_upload_preset"); // Replace with your upload preset

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/your_cloud_name/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload to Cloudinary");
  }

  const data = await response.json();
  return data.secure_url; // Return the secure URL of the uploaded file
};
