import React, { useState, useContext, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Edit, Delete } from "@mui/icons-material";
import AddressPopup from "./AddressPopup";
import { ActionContext } from "../../context/ActionContext";
import { createUser, getUserById } from "../../api/user";
import { useLocation, useParams } from "react-router-dom";
import { User } from "../../types/users.types";

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

  // Get URL parameters and location state
  const params = useParams();
  const location = useLocation();

  // Use context to communicate with ActionBox
  const { setActionHandlers } = useContext(ActionContext);

  // Populate form with user data
  const populateFormWithUserData = (user: User) => {
    setFormData({
      name: user.name ? String(user.name) : "",
      email: user.email ? String(user.email) : "",
      password: user.password ? String(user.password) : "",
      gender: user.gender ? String(user.gender) : "",
      phoneNumber: user.phone ? String(user.phone) : "",
      countryCode: "+91", // Default or from user data if available
      addresses: [], // Populate addresses if available in your user data
    });
  };

  // Fetch user data when component mounts or when userId changes
  useEffect(() => {
    const fetchUserData = async () => {
      // Handle ID from URL params (if edit mode)
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
        // Handle data passed via location state
        const user = location.state.user;
        setIsEditMode(true);
        setUserId(String(user.id || user._id));
        populateFormWithUserData(user);
      }
    };

    fetchUserData();
  }, [params.id, location.state]);

  // Set up action handlers for the parent component
  useEffect(() => {
    setActionHandlers({
      onConfirm: handleConfirm,
      onCancel: () => {
        // Can be handled by parent or here
        console.log("Cancel action triggered");
      },
    });

    return () => {
      // Reset action handlers when component unmounts
      setActionHandlers({
        onConfirm: () => console.warn("onConfirm is not implemented"),
        onCancel: () => console.warn("onCancel is not implemented"),
      });
    };
  }, [formData, isEditMode, setActionHandlers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          phoneNumber: "",
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

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className={`${showAddress ? "filter pointer-events-none" : ""}`}>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full md:w-1/3 border rounded-md input-box py-2 px-3"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full md:w-1/3 border rounded-md input-box py-2 px-3"
            />
            {/* <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full md:w-1/3 border rounded-md input-box py-2 px-3"
            />
            <input
              type="text"
              name="gender"
              placeholder="Gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full md:w-1/3 border rounded-md input-box py-2 px-3"
            /> */}
            <div className="relative w-full md:w-1/3">
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                maxLength={10}
                className="w-full border rounded-md input-box py-2 px-3"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                {formData.phoneNumber.length}/10
              </span>
            </div>
            {/* <input
              type="text"
              name="countryCode"
              placeholder="Country Code"
              value={formData.countryCode}
              onChange={handleInputChange}
              className="w-full md:w-1/3 border rounded-md input-box py-2 px-3"
            /> */}
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
                  <input
                    type="text"
                    name="addressLine1"
                    value={address.addressLine1}
                    readOnly
                    className="w-full border rounded px-2 py-2 text-sm input-box"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Street address or P.O. Box
                  </p>
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm mb-1">Address Line 2</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={address.addressLine2}
                    readOnly
                    className="w-full border rounded px-2 py-2 text-sm input-box"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional</p>
                </div>
              </div>

              <div className="mb-2">
                <label className="block text-sm mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  readOnly
                  className="w-full border rounded px-2 py-2 text-sm input-box"
                />
              </div>

              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-2">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    readOnly
                    className="w-full border rounded px-2 py-2 text-sm input-box"
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label className="block text-sm mb-1">PIN Code</label>
                  <input
                    type="text"
                    name="pinCode"
                    value={address.pinCode}
                    readOnly
                    className="w-full border rounded px-2 py-2 text-sm input-box"
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
        <DialogActions>
          <Button
            onClick={() => {
              setShowAddress(false);
              setEditingAddress(null);
              setEditingIndex(null);
            }}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserDetailsForm;
