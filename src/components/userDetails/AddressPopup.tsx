import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

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

  const [errors, setErrors] = useState({
    addressLine1: false,
    city: false,
    state: false,
    pinCode: false,
  });

  const [pinCodeError, setPinCodeError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setAddressData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "pinCode") {
      setPinCodeError(
        /^\d{5}$/.test(value) ? null : "PIN Code must be 5 digits"
      );
    }
  };

  const validateFields = () => {
    const newErrors = {
      addressLine1: !addressData.addressLine1,
      city: !addressData.city,
      state: !addressData.state,
      pinCode: !addressData.pinCode,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSave = () => {
    if (validateFields() && !pinCodeError) {
      onSave?.(addressData);
    }
  };

  return (
    <div className="p-4 w-full text-left bg-white">
      <div className="flex space-x-4 mb-2">
        <div className="w-1/2">
          <TextField
            label="Address Line 1"
            name="addressLine1"
            value={addressData.addressLine1}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            helperText="Street address or P.O. Box"
            error={errors.addressLine1}
          />
        </div>
        <div className="w-1/2">
          <TextField
            label="Address Line 2"
            name="addressLine2"
            value={addressData.addressLine2}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            helperText="Optional"
          />
        </div>
      </div>

      <div className="mb-2">
        <TextField
          label="City"
          name="city"
          value={addressData.city}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          error={errors.city}
        />
      </div>

      <div className="flex space-x-4 mb-2">
        <div className="w-1/2">
          <TextField
            label="State"
            name="state"
            value={addressData.state}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            select
            error={errors.state}
          >
            <MenuItem value="">-- Select --</MenuItem>
            <MenuItem value="CA">California</MenuItem>
            <MenuItem value="NY">New York</MenuItem>
          </TextField>
        </div>
        <div className="w-1/2">
          <TextField
            label="PIN Code"
            name="pinCode"
            placeholder="eg. 12345"
            value={addressData.pinCode}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            error={errors.pinCode || !!pinCodeError}
            helperText={pinCodeError}
          />
        </div>
      </div>

      <div className="mb-4">
        <FormControlLabel
          control={<Checkbox id="useAsShipping" />}
          label="Use as shipping address"
        />
      </div>

      <div className="text-right">
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: "grey.500",
            color: "grey.700",
            mr: 2, // Add margin to the right to create a gap
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
