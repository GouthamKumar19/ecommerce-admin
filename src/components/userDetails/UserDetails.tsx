import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Edit, Delete } from "@mui/icons-material";

import AddressPopup from "./AddressPopup";

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
    phoneNumber: "",
    addresses: [] as AddressData[],
  });


  const [showAddress, setShowAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(
    null
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

  return (
    <div>
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
            onClick={() => setShowAddress(false)}
            color="primary"
          ></Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserDetailsForm;
