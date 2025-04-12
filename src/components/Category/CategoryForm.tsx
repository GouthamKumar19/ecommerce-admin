import React, { useEffect } from "react";
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
  onDeleteSubcategories: (subcategoryIds: string[]) => void;
  isEditMode: boolean;
  subcategories: Subcategory[];
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  categoryName,
  images,
  errors,
  onNameChange,
  onImagesChange,
  onSubcategoryChange,
  onDeleteSubcategories,
  subcategories,
}) => {
  // Process subcategories on initial render to ensure images are properly set
  useEffect(() => {
    if (subcategories && subcategories.length > 0) {
      // Make sure each subcategory has proper image handling
      const processedSubcategories = subcategories.map((subcategory) => {
        // Ensure image is set from images array if available
        if (subcategory.images && subcategory.images.length > 0) {
          const selectedImage =
            subcategory.images.find((img) => img.selected) ||
            subcategory.images[0];
          return {
            ...subcategory,
            image: selectedImage ? selectedImage.url : subcategory.image,
          };
        }
        return subcategory;
      });

      // Only update if there are changes
      if (
        JSON.stringify(processedSubcategories) !== JSON.stringify(subcategories)
      ) {
        onSubcategoryChange(processedSubcategories);
      }
    }
  }, []);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const regex = /^[A-Za-z\s]+$/;
    const isValid = regex.test(value) || value === "";
    onNameChange(value, isValid);
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
    console.log("Category and subcategories saved successfully.");
  };

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
          onDeleteSubcategories={onDeleteSubcategories} // Make sure this is passed through
          subcategories={subcategories}
        />
      </div>
    </div>
  );
};

export default CategoryForm;
