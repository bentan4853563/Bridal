import { useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { handleCreateCustomer } from "../../../actions/customer";
import { toast } from "react-toastify";

// Define the structure of form data
interface FormData {
  name: string;
  surname: string;
  address: string;
  city: string;
  whatsApp: string;
  date: string;
  location: string;
  type: string;
}

// Define the structure of error messages
interface Errors {
  name?: string;
  surname?: string;
  address?: string;
  city?: string;
  phone?: string;
  whatsApp?: string;
  date?: string;
  location?: string;
}

export default function CreateCustomer() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    surname: "",
    address: "",
    city: "",
    whatsApp: "",
    date: "",
    location: "",
    type: "client",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [phoneValue, setPhoneValue] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.surname) newErrors.surname = "Surname is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!phoneValue) newErrors.phone = "Phone number is required";
    if (!formData.whatsApp) newErrors.whatsApp = "WhatsApp is required";
    if (!formData.date) newErrors.date = "Wedding Date is required";
    if (!formData.location) newErrors.location = "Wedding Location is required";

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Combine name and surname
      const fullName = `${formData.name} ${formData.surname}`.trim();

      // Create a new object with the combined name
      const submissionData = {
        ...formData,
        name: fullName,
        phone: phoneValue,
      };
      // Submit the form (e.g., send to an API)
      handleCreateCustomer(submissionData, () => {
        toast.success("Saved customer data successfully.")
      });
      // Reset form or redirect as needed
      setFormData({
        name: "",
        surname: "",
        address: "",
        city: "",
        whatsApp: "",
        date: "",
        location: "",
        type: "client",
      });
      setPhoneValue("");
      setErrors({});
    }
  };

  return (
    <div className="bg-gray-100 p-4 md:p-12 lg:p-24 text-black overflow-y-auto h-full">
      <form className="w-full xl:w-4/5 mx-auto" onSubmit={handleSubmit}>
        <div className="p-10 bg-white border-gray-100 rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="col-span-1 flex flex-col gap-6">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 flex flex-col items-start">
                <label htmlFor="name">Name</label>
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

              <div className="col-span-1 flex flex-col items-start">
                <label htmlFor="surname">Surname</label>
                <input
                  type="text"
                  id="surname"
                  className="w-full p-2 border rounded-md"
                  value={formData.surname}
                  onChange={handleChange}
                />
                {errors.surname && (
                  <span className="text-sm text-red-500">{errors.surname}</span>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col items-start">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                className="w-full p-2 border rounded-md"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && (
                <span className="text-sm text-red-500">{errors.address}</span>
              )}
            </div>

            {/* City */}
            <div className="flex flex-col items-start">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                className="w-full p-2 border rounded-md"
                value={formData.city}
                onChange={handleChange}
              />
              {errors.city && (
                <span className="text-sm text-red-500">{errors.city}</span>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col items-start">
              <label htmlFor="phone">Phone</label>
              <PhoneInput
                placeholder="Enter phone number"
                value={phoneValue}
                onChange={(value) => setPhoneValue(value || "")}
                className="w-full"
              />
              {errors.phone && (
                <span className="text-sm text-red-500">{errors.phone}</span>
              )}
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-6">
            {/* WhatsApp */}
            <div className="flex flex-col items-start">
              <label htmlFor="whatsApp">WhatsApp</label>
              <input
                type="text"
                id="whatsApp"
                className="w-full p-2 border rounded-md"
                value={formData.whatsApp}
                onChange={handleChange}
              />
              {errors.whatsApp && (
                <span className="text-sm text-red-500">{errors.whatsApp}</span>
              )}
            </div>

            {/* Wedding Date */}
            <div className="flex flex-col items-start">
              <label htmlFor="date">Wedding Date</label>
              <input
                type="date"
                id="date"
                className="w-full p-2 border rounded-md"
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && (
                <span className="text-sm text-red-500">{errors.date}</span>
              )}
            </div>

            {/* Wedding Location */}
            <div className="flex flex-col items-start">
              <label htmlFor="location">Wedding Location</label>
              <input
                type="text"
                id="location"
                className="w-full p-2 border rounded-md"
                value={formData.location}
                onChange={handleChange}
              />
              {errors.location && (
                <span className="text-sm text-red-500">{errors.location}</span>
              )}
            </div>

            {/* Type (Client/Prospect) */}
            <div className="flex flex-col items-start">
              <label htmlFor="type">Type</label>
              <select
                name="type"
                id="type"
                className="w-full p-2 border rounded-md"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="client">Client</option>
                <option value="prospect">Prospect</option>
              </select>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <Link to="/customers">
            <Button variant="outlined">Cancel</Button>
          </Link>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
