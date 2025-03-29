import React, { useState, useContext, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Edit, Delete } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import { InputAdornment, Snackbar, Alert } from "@mui/material";
import AddressPopup from "./AddressPopup";
import { ActionContext } from "../../context/ActionContext";
import { createUser, getUserById, updateUser } from "../../api/user";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { User } from "../../types/users.types";

interface AddressData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
}

const UserDetailsForm: React.FC = () => {
  // Form state variables
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    phoneNumber: "+91",
    countryCode: "91",
    addresses: [] as AddressData[],
  });

  // UI state variables
  const [isEditMode, setIsEditMode] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(
    null
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // Validation state
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    gender: "",
  });

  // Context and routing hooks
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setActionHandlers } = useContext(ActionContext);

  // Helper function to populate form with user data
  const populateFormWithUserData = (user: User) => {
    console.log("Populating form with user data:", user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "", // Don't populate password for security reasons
      gender: user.gender || "",
      phoneNumber: user.phone ? user.phone : "+91",
      countryCode: "91",
      addresses: user.addresses || [],
    });
  };

  // Fetch user data effect
  useEffect(() => {
    const fetchUserData = async () => {
      const id = params.id;
      if (id && id !== "new") {
        setIsLoading(true);
        setIsEditMode(true);
        setUserId(id);

        try {
          // If data is passed through location state, use it
          // Otherwise fetch from API
          console.log("Fetching user data for ID:", id);
          const response = await getUserById(id);
          console.log("User data response:", response);

          if (response.status === 200 && response.data) {
            populateFormWithUserData(response.data);
          } else {
            throw new Error("Failed to load user data");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setSnackbarMessage("Failed to load user data. Please try again.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [params.id, location.state]);

  // Set up action handlers effect
  useEffect(() => {
    setActionHandlers({
      onConfirm: handleSaveUser,
      onCancel: handleCancel,
    });

    return () => {
      // Reset action handlers when component unmounts
      setActionHandlers({
        onConfirm: () => console.warn("onConfirm is not implemented"),
        onCancel: () => console.warn("onCancel is not implemented"),
      });
    };
  }, [formData, isEditMode, setActionHandlers]);

  // Input change handler
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
    } else if (name === "gender") {
      // Convert gender input to uppercase
      const upperCaseValue = value.toUpperCase();

      setFormData((prev) => ({
        ...prev,
        [name]: upperCaseValue,
      }));

      // Validate gender (optional: add specific gender validation if needed)
      setErrors((prev) => ({
        ...prev,
        gender: "",
      }));
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

  const handleDeleteAddress = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index),
    }));
  };

  // Save user handler
  const handleSaveUser = async () => {
    // Check for validation errors
    if (
      errors.name ||
      errors.email ||
      errors.phoneNumber ||
      errors.password ||
      errors.gender
    ) {
      setSnackbarMessage(
        "Please correct the validation errors before submitting."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // If it's a new user, validate that password field is not empty
    if (!isEditMode && !formData.password) {
      setErrors((prev) => ({
        ...prev,
        password: "Password is required for new users.",
      }));
      setSnackbarMessage("Password is required for new users.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
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

    setIsLoading(true);

    try {
      if (isEditMode && userId) {
        // Update existing user
        console.log("Updating user with ID:", userId);
        console.log("Updated user data:", userData);

        const response = await updateUser(userId, userData);
        console.log("Update response:", response);

        if (response.status === 200) {
          setSnackbarMessage("User updated successfully");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);

          // Navigate back after short delay
          setTimeout(() => {
            navigate("/users");
          }, 1500);
        } else {
          throw new Error(response.message || "Something went wrong");
        }
      } else {
        // Create new user
        console.log("Creating new user with data:", userData);

        const response = await createUser(userData);
        console.log("Create response:", response);

        if (response.status === 200 || response.status === 201) {
          setSnackbarMessage("User created successfully");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);

          // Navigate back after short delay
          setTimeout(() => {
            navigate("/users");
          }, 1500);
        } else {
          throw new Error(response.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("Error submitting user data:", error);
      setSnackbarMessage(
        error instanceof Error ? error.message : "Failed to save user"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    console.log("Cancel action triggered");
    navigate("/users");
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
              <TextField
                variant="outlined"
                name="gender"
                placeholder="GENDER"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full"
                error={!!errors.gender}
                helperText={errors.gender}
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

          <button
            onClick={() => setShowAddress(true)}
            className="w-full sm:w-2/3 md:w-1/3 bg-green-700 text-white py-2 rounded-md mt-4 mb-4 flex items-center justify-center"
          >
            + ADD A NEW ADDRESS
          </button>

          {formData.addresses.map((address, index) => (
            <div
              key={index}
              className="w-full p-4 text-left bg-white mb-4 border rounded"
            >
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

      {/* Snackbar for messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserDetailsForm;
