import React from "react";
import TextField from "@mui/material/TextField";
import { Edit, Delete } from "@mui/icons-material";

interface AddressData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  useAsShipping?: boolean;
  _id?: string; // Add ID field for existing addresses
}

interface AddressFormProps {
  addresses: AddressData[];
  onEdit: (index: number) => void;
  onDelete: (id: string) => void; // Change the parameter type to string
  textFieldStyle: any;
  onShippingChange?: (index: number, checked: boolean) => void;
  isEditMode?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  addresses,
  onEdit,
  onDelete,
  textFieldStyle,
  onShippingChange,
}) => {
  return (
    <>
      {addresses.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-4">Saved Addresses</h3>
          {addresses.map((address, index) => (
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
                    onClick={() => onEdit(index)}
                  />
                  <Delete
                    className="text-red-500 cursor-pointer"
                    style={{ color: "#0d7f3f" }}
                    onClick={() => address._id && onDelete(address._id)} // Ensure _id is defined
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
                  readOnly={!onShippingChange}
                  disabled={!onShippingChange}
                  checked={address.useAsShipping || false}
                  onChange={onShippingChange ? (e) => onShippingChange(index, e.target.checked) : undefined}
                />
                <label htmlFor={`useAsShipping-${index}`} className="text-sm">
                  Use as shipping address
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AddressForm;