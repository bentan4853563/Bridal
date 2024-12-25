import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import {
  handleUpdateCustomer,
  handleGetCustomerData,
  handleDeleteCustomer,
} from "../../../actions/customer";
import { toast } from "react-toastify";
import CustomerFormSkeleton from "./CustomerFormSkeleton";

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

export default function CustomerInformation() {
  const params = useParams();
  const navigate = useNavigate(); // Initialize useNavigate

  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // Track if the form is dirty
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

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (params.id) {
        console.log("params.id :>> ", params.id);
        setLoading(true);
        const data = await handleGetCustomerData(params.id);
        if (data) {
          const fullName = data.name || "";
          const [name, surname] = fullName.split(" ");
          setFormData({
            ...data,
            name: name || "",
            surname: surname || "",
          });
          setPhoneValue(data.phone);
        }
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [params.id]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        const confirmationMessage =
          "You have unsaved changes. Are you sure you want to leave?";
        event.returnValue = confirmationMessage; // Standard for most browsers
        return confirmationMessage; // For some older browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setIsDirty(true); // Set form as dirty when changes are made
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
      const fullName = `${formData.name} ${formData.surname}`.trim();
      const submissionData = {
        ...formData,
        name: fullName,
        phone: phoneValue,
      };

      // Check if params.id is defined before calling the update function
      if (params.id) {
        handleUpdateCustomer(params.id, submissionData, () => {
          toast.success("Update customer data successfully.");
        });
      } else {
        toast.error("Customer ID is not defined.");
      }

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
      setIsDirty(false); // Reset dirty state after submission
    }
  };

  // Custom handler for Cancel button
  const handleCancel = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (confirmLeave) {
        navigate("/customers"); // Navigate to customers if confirmed
      }
    } else {
      navigate("/customers"); // Navigate directly if no unsaved changes
    }
  };

  const deleteCustomer = () => {
    if (params.id) {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this customer?"
      );
      if (isConfirmed) {
        handleDeleteCustomer(params.id, () => {
          toast.success("Customer deleted successfully.");
          navigate("/customers");
        });
      }
    } else {
      toast.error("Customer ID is not defined.");
    }
  };

  return (
    <div>
      {loading ? (
        <CustomerFormSkeleton />
      ) : (
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
                      <span className="text-sm text-red-500">
                        {errors.name}
                      </span>
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
                      <span className="text-sm text-red-500">
                        {errors.surname}
                      </span>
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
                    <span className="text-sm text-red-500">
                      {errors.address}
                    </span>
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
                    onChange={(value) => {
                      setPhoneValue(value || "");
                      setIsDirty(true); // Mark as dirty when phone changes
                    }}
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
                    <span className="text-sm text-red-500">
                      {errors.whatsApp}
                    </span>
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
                    <span className="text-sm text-red-500">
                      {errors.location}
                    </span>
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
            <div className="flex justify-between mt-4">
              <Button
                onClick={deleteCustomer}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
              <div className="flex gap-4">
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  Update
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
