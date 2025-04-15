import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import AddressForm from "./AddressForm"; // Import the AddressForm component

import {
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import AddressPopup from "./AddressPopup";
import { User } from "../../types/users.types";
import { deleteUserAddresses } from "../../api/user";

interface AddressData {
  _id: string; // Add this line to include the _id field
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  useAsShipping?: boolean;
}

interface UserDetailsFormProps {
  userData: User | null;
  isLoading: boolean;
  isEditMode: boolean;
  onSave: (formData: any) => void;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
  userData,
  isLoading,
  isEditMode,
  onSave,
}) => {
  // Form state variables
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    phoneNumber: "",
    countryCode: "91",
    addresses: [] as AddressData[],
  });

  // UI state variables
  const [showAddress, setShowAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(

  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Validation state
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    gender: "",
  });

  
  // Then update the populateFormWithUserData function
  const populateFormWithUserData = (user: User) => {
    console.log("Populating form with user data:", user);
    
    // Safely handle address details with proper type checking
    const addressDetails = user.addressDetails;
    const mappedAddresses = Array.isArray(addressDetails)
      ? addressDetails.map((address: any) => ({
        _id:address._id,
          addressLine1: address?.addressLine1 || address?.line1 || "",
          addressLine2: address?.addressLine2 || address?.line2 || "",
          city: address?.city || "",
          state: address?.state || "",
          pinCode: address?.pinCode || "",
          useAsShipping: address?.useAsShipping || address?.isShipping || false,
        }))
      : [];
  
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      gender: user.gender || "",
      phoneNumber: user.phone || "",
      countryCode: "91",
      addresses: mappedAddresses,
    });
  
    if (isEditMode && mappedAddresses.length > 0) {
      setShowAddress(false);
    }
  };

  // Populate form with user data when it's available
  useEffect(() => {
    if (userData) {
      populateFormWithUserData(userData);
    }
  }, [userData]);

  // Set up event listener for save trigger from parent
  useEffect(() => {
    const handleTriggerSave = () => {
      validateAndSubmit();
    };

    document.addEventListener("triggerSaveFromParent", handleTriggerSave);

    return () => {
      document.removeEventListener("triggerSaveFromParent", handleTriggerSave);
    };
  }, [formData, errors]);

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Handle phone number specifically
      if (value.startsWith("+91")) {
        const phoneDigits = value.substring(3).replace(/\D/g, ""); // Remove +91 and non-digits
        const newPhoneValue =
          
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
           
            (phoneDigits.length > 10 ? phoneDigits.slice(0, 10) : phoneDigits),
        }));
      }
    } else if (name === "password") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Password validation: at least 8 characters with at least one letter and one number
      const hasMinLength = value.length >= 8;
      const hasLetter = /[a-zA-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);

      let passwordError = "";

      if (
        value &&
        (!hasMinLength || !hasLetter || !hasNumber || !hasSpecialChar)
      ) {
        passwordError =
          "Password must be at least 8 characters with at least one letter, one number, and one special character.";
      }

      setErrors((prev) => ({
        ...prev,
        password: passwordError,
      }));
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

  // Handle gender select change
  const handleGenderChange = (event: SelectChangeEvent) => {
    const value = event.target.value;

    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));

    setErrors((prev) => ({
      ...prev,
      gender: "",
    }));
  };

  // Address checkbox handler for existing addresses
  const handleShippingCheckboxChange = (index: number, checked: boolean) => {
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      useAsShipping: checked,
    };

    setFormData((prev) => ({
      ...prev,
      addresses: updatedAddresses,
    }));
  };

  // Address handlers
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

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteUserAddresses([id]); // Pass the ID as an array
      console.log(`Address with ID ${id} deleted successfully.`);
      
      // Remove the address from the form data
      setFormData((prev) => ({
        ...prev,
        addresses: prev.addresses.filter((address) => address._id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete address:", id, error);
    }
  };

  // Validation and submission
  const validateAndSubmit = () => {
    // Check for validation errors
    if (
      errors.name ||
      errors.email ||
      errors.phoneNumber ||
      errors.password ||
      errors.gender
    ) {
      return;
    }

    // If it's a new user, validate that password field is not empty
    if (!isEditMode && !formData.password) {
      setErrors((prev) => ({
        ...prev,
        password: "Password is required for new users.",
      }));

      return;
    }

    // Prepare user data for API
    const userData: any = {
      name: formData.name,
      email: formData.email,
      gender: formData.gender,
      phone: formData.phoneNumber,
      countryCode: formData.countryCode,
      addresses: formData.addresses,
    };

    // Add password only if provided (for updates) or required (for new users)
    if (formData.password) {
      userData.password = formData.password;
    }

    // Call the onSave prop function from parent component
    onSave(userData);
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
        <div
          className={`${showAddress ? "filter blur-sm pointer-events-none" : ""}`}
        >
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
                error={!!errors.name}
                helperText={errors.name}
                size="small"
                InputProps={{
                  style: { backgroundColor: "white" },
                }}
                sx={{
                  ...textFieldStyle,
                  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "red",
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
                error={!!errors.email}
                helperText={errors.email}
                size="small"
                InputProps={{
                  style: { backgroundColor: "white" },
                }}
                sx={{
                  ...textFieldStyle,
                  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "red",
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
                error={!!errors.phoneNumber}
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
                      borderColor: "red",
                    },
                }}
              />
            </div>
            <div className="w-full md:w-1/3 text-left">
              <label className="block text-black text-small font-medium mb-2 text-left">
                Gender
              </label>
              <FormControl
                variant="outlined"
                className="w-full"
                size="small"
                error={!!errors.gender}
              >
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleGenderChange}
                  displayEmpty
                  sx={{
                    ...textFieldStyle,
                    backgroundColor: "white",
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Select Gender</em>
                  </MenuItem>
                  <MenuItem value="MALE">MALE</MenuItem>
                  <MenuItem value="FEMALE">FEMALE</MenuItem>
                  <MenuItem value="OTHER">OTHER</MenuItem>
                </Select>
                {errors.gender && (
                  <FormHelperText>{errors.gender}</FormHelperText>
                )}
              </FormControl>
            </div>
          </div>

          {/* Password field with validation */}
          <div className="w-full md:w-1/3 text-left mt-4">
            <label className="block text-black text-small font-medium mb-2 text-left">
              Password
            </label>
            <TextField
              variant="outlined"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full"
              error={!!errors.password}
              helperText={errors.password}
              size="small"
              InputProps={{
                style: { backgroundColor: "white" },
              }}
              sx={{
                ...textFieldStyle,
                "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "red",
                  },
              }}
            />
          </div>

          {/* Add address button */}
          <button
            onClick={() => setShowAddress(true)}
            className="w-full sm:w-2/3 md:w-1/3 bg-green-700 text-white py-2 rounded-md mt-4 mb-4 flex items-center justify-center"
          >
            + ADD A NEW ADDRESS
          </button>

          {/* Use the AddressForm component instead of inline address rendering */}
          {formData.addresses && formData.addresses.length > 0 && (
            <AddressForm
              addresses={formData.addresses}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              textFieldStyle={textFieldStyle}
              onShippingChange={handleShippingCheckboxChange}
              isEditMode={isEditMode}
            />
          )}
        </div>
      )}

      {/* Your existing dialog for address popup */}
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
              onSave={(addressData) => {
                if (editingAddress) {
                  handleUpdateAddress({ ...addressData, _id: editingAddress._id });
                } else {
                  handleAddAddress({ ...addressData, _id: '' });
                }
              }}
              initialData={editingAddress || undefined}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDetailsForm;
