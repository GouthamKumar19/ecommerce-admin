import React, { useState, useContext, useEffect } from "react";
import Dialog from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { Edit, Delete } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import AddressPopup from "./AddressPopup";
import { ActionContext } from "../../context/ActionContext";
import { createUser, getUserById } from "../../api/user";
import { useLocation, useParams } from "react-router-dom";
import { User } from "../../types/users.types";
import { InputAdornment } from "@mui/material";
interface UserFormData {
  name: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
  countryCode: string;
}

interface AddressData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
}

const UserDetailsForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    phoneNumber: "+91",
    countryCode: "",
    addresses: [] as AddressData[],
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(
    null
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const params = useParams();
  const location = useLocation();
  const { setActionHandlers } = useContext(ActionContext);

  const populateFormWithUserData = (user: User) => {
    setFormData({
      name: user.name ? String(user.name) : "",
      email: user.email ? String(user.email) : "",
      password: user.password ? String(user.password) : "",
      gender: user.gender ? String(user.gender) : "",
      phoneNumber: user.phone ? String(user.phone) : "",
      countryCode: "+91",
      addresses: [],
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const id = params.id;
      if (id && id !== "new") {
        setIsLoading(true);
        setIsEditMode(true);
        setUserId(id);

        try {
          const response = await getUserById(id);
          if (response && response.data) {
            populateFormWithUserData(response.data);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (location.state?.user) {
        const user = location.state.user;
        setIsEditMode(true);
        setUserId(String(user.id || user._id));
        populateFormWithUserData(user);
      }
    };

    fetchUserData();
  }, [params.id, location.state]);

  useEffect(() => {
    setActionHandlers({
      onConfirm: handleConfirm,
      onCancel: () => {
        console.log("Cancel action triggered");
      },
    });

    return () => {
      setActionHandlers({
        onConfirm: () => console.warn("onConfirm is not implemented"),
        onCancel: () => console.warn("onCancel is not implemented"),
      });
    };
  }, [formData, isEditMode, setActionHandlers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Handle phone number specifically
      if (value.startsWith("+91")) {
        const phoneDigits = value.substring(3).replace(/\D/g, ""); // Remove +91 and non-digits
        const newPhoneValue =
          "+91" +
          (phoneDigits.length > 10 ? phoneDigits.slice(0, 10) : phoneDigits);

        setFormData((prev) => ({
          ...prev,
          phoneNumber: newPhoneValue,
        }));

        setErrors((prev) => ({
          ...prev,
          phoneNumber:
            phoneDigits.length === 10 ? "" : "Phone number must be 10 digits.",
        }));
      } else {
        // If somehow the +91 prefix was removed, restore it
        const phoneDigits = value.replace(/\D/g, "");
        setFormData((prev) => ({
          ...prev,
          phoneNumber:
            "+91" +
            (phoneDigits.length > 10 ? phoneDigits.slice(0, 10) : phoneDigits),
        }));
      }
    } else {
      // Handle other inputs normally
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Validation logic
      if (name === "name") {
        setErrors((prev) => ({
          ...prev,
          name: /^[a-zA-Z\s]+$/.test(value)
            ? ""
            : "Name cannot contain numbers or special characters.",
        }));
      }

      if (name === "email") {
        setErrors((prev) => ({
          ...prev,
          email: value.endsWith("@gmail.com")
            ? ""
            : "Email must end with @gmail.com.",
        }));
      }
    }
  };

  const handleAddAddress = (addressData: AddressData) => {
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, addressData],
    }));
    setShowAddress(false);
  };

  const handleEditAddress = (index: number) => {
    setEditingAddress(formData.addresses[index]);
    setEditingIndex(index);
    setShowAddress(true);
  };

  const handleUpdateAddress = (updatedAddress: AddressData) => {
    if (editingIndex !== null) {
      const updatedAddresses = [...formData.addresses];
      updatedAddresses[editingIndex] = updatedAddress;

      setFormData((prev) => ({
        ...prev,
        addresses: updatedAddresses,
      }));
      setShowAddress(false);
      setEditingAddress(null);
      setEditingIndex(null);
    }
  };

  const handleDeleteAddress = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index),
    }));
  };

  const handleConfirm = async () => {
    const userData: UserFormData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      gender: formData.gender,
      phone: formData.phoneNumber,
      countryCode: formData.countryCode,
    };

    console.log("Form data being submitted:", userData);

    // Check for errors before submission
    if (errors.name || errors.email || errors.phoneNumber) {
      console.error("There are validation errors", errors);
      return; // Stop if there are validation errors
    }

    try {
      if (isEditMode && userId) {
        // Update existing user (API call to be implemented)
        console.log("Updating user with ID:", userId);
        console.log("Updated user data:", userData);
      } else {
        // Create new user
        const response = await createUser(userData);
        console.log({
          status: 201,
          message: "Success",
          data: {
            id: response.data._id,
          },
          toastMessage: "User created successfully",
        });
      }

      // Reset form after successful submission
      if (!isEditMode) {
        setFormData({
          name: "",
          email: "",
          password: "",
          gender: "",
          phoneNumber: "+91",
          countryCode: "+91",
          addresses: [],
        });
      }

      // You might want to add toast notification here
    } catch (error) {
      console.error("Error submitting user data:", error);
      // Handle error notification here
    }
  };

  // Calculate phone length excluding +91 prefix
  const phoneDigitsLength = formData.phoneNumber.startsWith("+91")
    ? formData.phoneNumber.substring(3).length
    : formData.phoneNumber.length;

  // Custom styles for text fields
  const textFieldStyle = {
    backgroundColor: "white",
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.23)", // Keep standard border color when focused
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.23)", // Keep standard border color when hovered
    },
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className={`${showAddress ? "filter pointer-events-none" : ""}`}>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/3 text-left">
              <label className="block text-black text-small font-medium mb-2 text-left">
                Name
              </label>
              <TextField
                variant="outlined"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full"
                error={!!errors.name} // Here to indicate error state
                helperText={errors.name}
                size="small"
                InputProps={{
                  style: { backgroundColor: "white" },
                }}
                sx={{
                  ...textFieldStyle,
                  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "red", // Custom red border color for error state
                    },
                }}
              />
            </div>

            <div className="w-full md:w-1/3 text-left">
              <label className="block text-black text-small font-medium mb-2 text-left">
                Email
              </label>
              <TextField
                variant="outlined"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full"
                error={!!errors.email} // Here to indicate error state
                helperText={errors.email}
                size="small"
                InputProps={{
                  style: { backgroundColor: "white" },
                }}
                sx={{
                  ...textFieldStyle,
                  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "red", // Custom red border color for error state
                    },
                }}
              />
            </div>

            <div className="relative w-full md:w-1/3 text-left">
              <label className="block text-black text-small font-medium mb-2 text-left">
                Phone Number
              </label>
              <TextField
                variant="outlined"
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full"
                error={!!errors.phoneNumber} // Here to indicate error state
                helperText={errors.phoneNumber}
                size="small"
                InputProps={{
                  style: { backgroundColor: "white" },
                  endAdornment: (
                    <InputAdornment position="end">
                      {phoneDigitsLength}/10
                    </InputAdornment>
                  ),
                }}
                sx={{
                  ...textFieldStyle,
                  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "red", // Custom red border color for error state
                    },
                }}
              />
            </div>
          </div>

          <button
            onClick={() => setShowAddress(true)}
            className="w-full sm:w-2/3 md:w-1/3 text-white rounded-md mt-4 mb-4 flex items-center justify-center"
          >
            + ADD A NEW ADDRESS
          </button>

          {formData.addresses.map((address, index) => (
            <div key={index} className="w-full p-4 text-left bg-white mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">Address {index + 1}</h3>
                <div className="flex space-x-2">
                  <Edit
                    className="text-blue-500 cursor-pointer"
                    style={{ color: "#0d7f3f" }}
                    onClick={() => handleEditAddress(index)}
                  />
                  <Delete
                    className="text-red-500 cursor-pointer"
                    style={{ color: "#0d7f3f" }}
                    onClick={() => handleDeleteAddress(index)}
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-2">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm mb-1">Address Line 1</label>
                  <TextField
                    variant="outlined"
                    name="addressLine1"
                    value={address.addressLine1}
                    className="w-full"
                    size="small"
                    InputProps={{
                      readOnly: true,
                      style: { backgroundColor: "white" },
                    }}
                    sx={textFieldStyle}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Street address or P.O. Box
                  </p>
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm mb-1">Address Line 2</label>
                  <TextField
                    variant="outlined"
                    name="addressLine2"
                    value={address.addressLine2}
                    className="w-full"
                    size="small"
                    InputProps={{
                      readOnly: true,
                      style: { backgroundColor: "white" },
                    }}
                    sx={textFieldStyle}
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional</p>
                </div>
              </div>

              <div className="mb-2">
                <label className="block text-sm mb-1">City</label>
                <TextField
                  variant="outlined"
                  name="city"
                  value={address.city}
                  className="w-half"
                  size="small"
                  InputProps={{
                    readOnly: true,
                    style: { backgroundColor: "white" },
                  }}
                  sx={textFieldStyle}
                />
              </div>

              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-2">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm mb-1">State</label>
                  <TextField
                    variant="outlined"
                    name="state"
                    value={address.state}
                    className="w-full"
                    size="small"
                    InputProps={{
                      readOnly: true,
                      style: { backgroundColor: "white" },
                    }}
                    sx={textFieldStyle}
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label className="block text-sm mb-1">PIN Code</label>
                  <TextField
                    variant="outlined"
                    name="pinCode"
                    value={address.pinCode}
                    className="w-full"
                    size="small"
                    InputProps={{
                      readOnly: true,
                      style: { backgroundColor: "white" },
                    }}
                    sx={textFieldStyle}
                  />
                </div>
              </div>

              <div className="mb-4">
                <input
                  type="checkbox"
                  id={`useAsShipping-${index}`}
                  className="mr-2"
                />
                <label htmlFor={`useAsShipping-${index}`} className="text-sm">
                  Use as shipping address
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={showAddress}
        onClose={() => setShowAddress(false)}
        aria-labelledby="address-dialog-title"
        aria-describedby="address-dialog-description"
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: "16px", sm: "auto" },
            width: { xs: "calc(100% - 32px)", sm: "80%", md: "70%" },
          },
        }}
      >
        <DialogTitle id="address-dialog-title">{"Address"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="address-dialog-description">
            <AddressPopup
              onClose={() => {
                setShowAddress(false);
                setEditingAddress(null);
                setEditingIndex(null);
              }}
              onSave={editingAddress ? handleUpdateAddress : handleAddAddress}
              initialData={editingAddress || undefined}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDetailsForm;
