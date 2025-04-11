
import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";

interface AddressPopupProps {
  onClose?: () => void;
  onSave?: (addressData: {
 
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pinCode: string;
    useAsShipping: boolean; // Add this field
  }) => void;
  initialData?: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pinCode: string;
    useAsShipping?: boolean; // Make optional for backward compatibility
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
    useAsShipping: false, // Add default value
  });

  const [pinCodeError, setPinCodeError] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setAddressData({
        ...initialData,
        useAsShipping: initialData.useAsShipping || false, // Handle case when it doesn't exist in initialData
      });
    }
  }, [initialData]);

  const validatePinCode = (pinCode: string): boolean => {
    // Check if pin code is exactly 6 digits
    const pinCodeRegex = /^[0-9]{6}$/;
    return pinCodeRegex.test(pinCode);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "pinCode") {
      // Only allow numbers and limit to 6 characters
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 6);

      // Clear error if field is empty or validate if it has a value
      if (numericValue === "") {
        setPinCodeError("");
      } else if (numericValue.length < 6) {
        setPinCodeError("PIN code must be 6 digits");
      } else {
        setPinCodeError("");
      }

      setAddressData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setAddressData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Add a handler for the checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressData((prev) => ({
      ...prev,
      useAsShipping: e.target.checked,
    }));
  };

  const handleSave = () => {
    if (!validatePinCode(addressData.pinCode)) {
      setPinCodeError("PIN code must be 6 digits");
      return;
    }

    // If validation passes, clear error and save
    setPinCodeError("");
    onSave?.(addressData);
  };

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
            <option value="AP">Andhra Pradesh</option>
            <option value="AR">Arunachal Pradesh</option>
            <option value="AS">Assam</option>
            <option value="BR">Bihar</option>
            <option value="CT">Chhattisgarh</option>
            <option value="GA">Goa</option>
            <option value="GJ">Gujarat</option>
            <option value="HR">Haryana</option>
            <option value="HP">Himachal Pradesh</option>
            <option value="JH">Jharkhand</option>
            <option value="KA">Karnataka</option>
            <option value="KL">Kerala</option>
            <option value="MP">Madhya Pradesh</option>
            <option value="MH">Maharashtra</option>
            <option value="MN">Manipur</option>
            <option value="ML">Meghalaya</option>
            <option value="MZ">Mizoram</option>
            <option value="NL">Nagaland</option>
            <option value="OR">Odisha</option>
            <option value="PB">Punjab</option>
            <option value="RJ">Rajasthan</option>
            <option value="SK">Sikkim</option>
            <option value="TN">Tamil Nadu</option>
            <option value="TG">Telangana</option>
            <option value="TR">Tripura</option>
            <option value="UP">Uttar Pradesh</option>
            <option value="UT">Uttarakhand</option>
            <option value="WB">West Bengal</option>
            <option value="AN">Andaman and Nicobar Islands</option>
            <option value="CH">Chandigarh</option>
            <option value="DN">Dadra and Nagar Haveli and Daman and Diu</option>
            <option value="DL">Delhi</option>
            <option value="JK">Jammu and Kashmir</option>
            <option value="LA">Ladakh</option>
            <option value="LD">Lakshadweep</option>
            <option value="PY">Puducherry</option>
          </select>
        </div>

        <div className="w-1/2">
          <label className="block text-sm mb-1">PIN Code</label>
          <input
            type="text"
            name="pinCode"
            placeholder="eg. 123456"
            value={addressData.pinCode}
            onChange={handleInputChange}
            className={`w-full border rounded px-2 py-2 text-sm bg-white ${
              pinCodeError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {pinCodeError && (
            <p className="text-xs text-red-500 mt-1">{pinCodeError}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="checkbox"
          id="useAsShipping"
          className="mr-2"
          checked={addressData.useAsShipping}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="useAsShipping" className="text-sm">
          Use as shipping address
        </label>
      </div>

      <div className="text-right">
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: "grey.500",
            color: "grey.700",
            mr: 2,
            "&:hover": {
              borderColor: "grey.700",
              backgroundColor: "grey.50",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            bgcolor: "var(--secondary-color, #4CAF50)",
            color: "white",
            "&:hover": {
              bgcolor: "var(--secondary-dark-color, #388E3C)",
            },
          }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default AddressPopup;
