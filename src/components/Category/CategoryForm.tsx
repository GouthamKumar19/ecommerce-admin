import React from "react";
import { Typography, Box, TextField } from "@mui/material";
import ImageSelection from "../common/ImageSelection";
import SubcategoryForm from "./SubcategoryForm";
import { Subcategory } from "../../types/category.types";

interface ProductImage {
  id: number;
  url: string;
  selected: boolean;
}

interface CategoryFormProps {
  categoryName: string;
  images: ProductImage[];
  errors: { [key: string]: boolean };
  onNameChange: (name: string, isValid: boolean) => void;
  onImagesChange: (images: ProductImage[]) => void;
  onSubcategoryChange: (updatedSubcategories: Subcategory[]) => void;
  isEditMode: boolean;
  subcategories: Subcategory[]; // Add subcategories prop
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  categoryName,
  images,
  errors,
  onNameChange,
  onImagesChange,
  onSubcategoryChange,
  subcategories, // Add subcategories prop
}) => {
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const regex = /^[A-Za-z\s]+$/;
    const isValid = regex.test(value) || value === "";
    onNameChange(value, isValid);
    console.log("Category Name:", value);
  };

  const handleImagesChange = React.useCallback(
    (value: React.SetStateAction<ProductImage[]>) => {
      if (typeof value === "function") {
        const newImages = value(images);
        onImagesChange(newImages);
      } else {
        onImagesChange(value);
      }
    },
    [images, onImagesChange]
  );

  const handleSaveSuccess = () => {
    if (!categoryName) {
      console.error("Category name is required");
      return;
    }
    console.log("Category and subcategories saved successfully.");
  };

  console.log(subcategories, "Subcategories in CategoryForm");

  return (
    <div className="ml-8 mr-8 mb-6">
      <div className="space-y-6">
        <div>
          <Typography variant="subtitle1" gutterBottom align="left">
            Name
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
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
              size="small"
              style={{ width: "50%" }}
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
              borderColor: errors.images ? "red" : "inherit",
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

        <SubcategoryForm
          categoryName={categoryName}
          categoryImages={images}
          onSaveSuccess={handleSaveSuccess}
          onSubcategoryChange={onSubcategoryChange}
          subcategories={subcategories} // Pass the subcategories prop
        />
      </div>
    </div>
  );
};

export default CategoryForm;
