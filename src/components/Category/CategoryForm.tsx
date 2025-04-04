import React from "react";
import { Typography, Box, TextField } from "@mui/material";
import ImageSelection from "../common/ImageSelection";
import SubcategoryForm from "./SubcategoryForm";

// Import or recreate the ProductImage type to match what ImageSelection expects
interface ProductImage {
  id: number;
  url: string;
  selected: boolean;
}

// Update interface for the props
interface CategoryFormProps {
  categoryName: string;
  images: ProductImage[];
  errors: { [key: string]: boolean };
  onNameChange: (name: string, isValid: boolean) => void;
  onImagesChange: (images: ProductImage[]) => void;
  isEditMode: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  categoryName,
  images,
  errors,
  onNameChange,
  onImagesChange,

}) => {
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const regex = /^[A-Za-z\s]+$/;
    const isValid = regex.test(value) || value === "";
    onNameChange(value, isValid);
  };

  // Create a wrapper function that adapts onImagesChange to match the expected setState type
  const handleImagesChange = React.useCallback(
    (value: React.SetStateAction<ProductImage[]>) => {
      // Handle both functional and direct updates
      if (typeof value === "function") {
        // If it's a function, we need to call it with the current images to get the new value
        const newImages = value(images);
        onImagesChange(newImages);
      } else {
        // If it's a direct value, we can just pass it through
        onImagesChange(value);
      }
    },
    [images, onImagesChange]
  );

  return (
    <div className="ml-8 mr-8 mb-6">
      {/* Main Form Content */}
      <div className="space-y-6">
        <div>
          <Typography variant="subtitle1" gutterBottom align="left">
            Name
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start", // Align items to the start (left)
            }}
          >
            <TextField
              id="categoryName"
              value={categoryName}
              onChange={handleNameChange}
              placeholder="Category Name"
              variant="outlined"
              error={errors.categoryName}
              helperText={
                errors.categoryName ? "Only letters and spaces are allowed" : ""
              }
              size="small" // Set the size to small
              style={{ width: "50%" }} // Adjust the width as needed
            />
          </Box>
        </div>

        <div>
          <Typography variant="subtitle1" gutterBottom align="left">
            Banner Image
          </Typography>
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: "6px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              p: 4,
              width: "100%",
              borderColor: errors.images ? "red" : "inherit", // Add red border if there's an error
              borderWidth: errors.images ? "2px" : "1px",
            }}
          >
            <ImageSelection
              images={images}
              setImages={handleImagesChange}
              type="category"
            />
            {errors.images && (
              <Typography variant="body2" color="error">
                At least one image must be selected
              </Typography>
            )}
          </Box>
        </div>

        {/* Subcategory Form */}
        <SubcategoryForm />
      </div>
    </div>
  );
};

export default CategoryForm;
