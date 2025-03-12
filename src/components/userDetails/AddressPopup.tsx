import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';

interface AddressPopupProps {
  onClose?: () => void;
  onSave?: (addressData: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pinCode: string;
  }) => void;
  initialData?: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pinCode: string;
  };
}

const AddressPopup: React.FC<AddressPopupProps> = ({
  onClose,
  onSave,
  initialData,
}) => {
  const [addressData, setAddressData] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
  });

  useEffect(() => {
    if (initialData) {
      setAddressData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleaAdd = () => {
    onSave?.(addressData);
  };

  function handleCancel(): void {
    onClose?.();
  }

  function handleAdd(): void {
    handleaAdd();
  }

  return (
    <div className="p-4 w-full text-left bg-white">
      <div className="flex space-x-4 mb-2">
        <div className="w-1/2">
          <label className="block text-sm mb-1">Address Line 1</label>
          <input
            type="text"
            name="addressLine1"
            value={addressData.addressLine1}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-2 text-sm bg-white border-gray-300"
          />
          <p className="text-xs text-gray-500 mt-1">
            Street address or P.O. Box
          </p>
        </div>
        <div className="w-1/2">
          <label className="block text-sm mb-1">Address Line 2</label>
          <input
            type="text"
            name="addressLine2"
            value={addressData.addressLine2}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-2 text-sm bg-white border-gray-300"
          />
          <p className="text-xs text-gray-500 mt-1">Optional</p>
        </div>
      </div>

      <div className="mb-2">
        <label className="block text-sm mb-1">City</label>
        <input
          type="text"
          name="city"
          value={addressData.city}
          onChange={handleInputChange}
          className="w-full border rounded px-2 py-2 text-sm bg-white border-gray-300"
        />
      </div>

      <div className="flex space-x-4 mb-2">
        <div className="w-1/2">
          <label className="block text-sm mb-1">State</label>
          <select
            name="state"
            value={addressData.state}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-2 text-sm bg-white border-gray-300"
          >
            <option value="">-- Select --</option>
            <option value="CA">California</option>
            <option value="NY">New York</option>
          </select>
        </div>

        <div className="w-1/2">
          <label className="block text-sm mb-1">PIN Code</label>
          <input
            type="text"
            name="pinCode"
            placeholder="eg. 12345"
            value={addressData.pinCode}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-2 text-sm bg-white border-gray-300"
          />
        </div>
      </div>

      <div className="mb-4">
        <input type="checkbox" id="useAsShipping" className="mr-2" />
        <label htmlFor="useAsShipping" className="text-sm">
          Use as shipping address
        </label>
      </div>

      <div className="text-right">
        <Button
          onClick={handleCancel}
          variant="outlined"
          sx={{
            color: "#0d7f3f",
            borderColor: "#0d7f3f",
            borderRadius: 2,
            backgroundColor: "white",
            padding: "8px 16px",
            width: "96px",
          }}
        >
          CANCEL
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          sx={{
            backgroundColor: "var(--secondary-color)",
            color: "#ffffff",
            borderRadius: 2,
            ml: 2,
            padding: "8px 16px",
            width: "96px",
          }}
        >
          ADD
        </Button>
      </div>
    </div>
  );
};

export default AddressPopup;
