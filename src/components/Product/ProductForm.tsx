import React,{useEffect} from "react";
import {
  TextField,
  Typography,
  Checkbox,
  Autocomplete,
  Grid,
  InputAdornment,
  Box,
} from "@mui/material";
import ImageSelection from "../common/ImageSelection";
import VariantManager, { Variant } from "./VariantManager"; // Import Variant type from VariantManager
import { Dispatch, SetStateAction } from "react";

interface ProductImage {
  id: number;
  url: string;
  selected: boolean;
}

// Remove the duplicate Variant interface since we're importing it from VariantManager

interface ProductFormProps {
  productName: string;
  description: string;
  price: string;
  slashedPrice: string;
  category: string | null;
  subCategory: string | null;
  featured: boolean;
  images: ProductImage[];
  variants: Variant[]; // Use the imported Variant type
  isProductNameValid: boolean;
  isPriceValid: boolean;
  isSlashedPriceValid: boolean;
  isDescriptionValid: boolean;
  isCategoryValid: boolean;
  isSubCategoryValid: boolean;
  productNameErrorMessage: string;
  priceErrorMessage: string;
  slashedPriceErrorMessage: string;
  descriptionErrorMessage: string;
  categoryErrorMessage: string;
  subCategoryErrorMessage: string;
  updateForm: {
    setProductName: (value: string) => void;
    setDescription: (value: string) => void;
    setPrice: (value: string) => void;
    setSlashedPrice: (value: string) => void;
    setCategory: (value: string | null) => void;
    setSubCategory: (value: string | null) => void;
    setFeatured: (value: boolean) => void;
    setImages: Dispatch<SetStateAction<ProductImage[]>>;
    setVariants: Dispatch<SetStateAction<Variant[]>>; // Use the imported Variant type
    setIsProductNameValid: (value: boolean) => void;
    setIsPriceValid: (value: boolean) => void;
    setIsSlashedPriceValid: (value: boolean) => void;
    setIsDescriptionValid: (value: boolean) => void;
    setIsCategoryValid: (value: boolean) => void;
    setIsSubCategoryValid: (value: boolean) => void;
    setProductNameErrorMessage: (value: string) => void;
    setPriceErrorMessage: (value: string) => void;
    setSlashedPriceErrorMessage: (value: string) => void;
    setDescriptionErrorMessage: (value: string) => void;
    setCategoryErrorMessage: (value: string) => void;
    setSubCategoryErrorMessage: (value: string) => void;
  };
}

const ProductForm: React.FC<ProductFormProps> = ({
  productName,
  description,
  price,
  slashedPrice,
  category,
  subCategory,
  featured,
  images,
  variants,
  isProductNameValid,
  isPriceValid,
  isSlashedPriceValid,
  isDescriptionValid,
  isCategoryValid,
  isSubCategoryValid,
  productNameErrorMessage,
  priceErrorMessage,
  slashedPriceErrorMessage,
  descriptionErrorMessage,
  categoryErrorMessage,
  subCategoryErrorMessage,
  updateForm,
}) => {
  useEffect(() => {
    console.log("ProductForm - Variants received:", variants);
  }, [variants]);
  // Validation functions
  const validateProductName = (name: string) =>
    /^[a-zA-Z\s]*$/.test(name) && name.length <= 10;
  const validatePrice = (price: string) => /^\d*\.?\d*$/.test(price);
  const validateDescription = (desc: string) => desc.length <= 60;

  // Sample category and subcategory data
  const categories = ["Footwear", "Clothing", "Accessories"];
  const subCategories = ["Boots", "Sneakers", "Formal", "Casual"];
 

  return (
    <div>
      {/* Form content */}
      <Grid container spacing={12}>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" gutterBottom align="left">
            Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={productName}
            onChange={(e) => {
              const name = e.target.value;
              if (validateProductName(name)) {
                updateForm.setProductName(name);
                updateForm.setIsProductNameValid(true);
                updateForm.setProductNameErrorMessage("");
              } else {
                updateForm.setIsProductNameValid(false);
                if (!/^[a-zA-Z\s]*$/.test(name)) {
                  updateForm.setProductNameErrorMessage(
                    "Only characters are allowed."
                  );
                } else if (name.length > 10) {
                  updateForm.setProductNameErrorMessage(
                    "Maximum 10 characters allowed."
                  );
                }
              }
            }}
            placeholder="Product Name"
            error={!isProductNameValid}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    right: "8px",
                    color: "rgba(0, 0, 0, 0.38)",
                    fontSize: "0.65rem",
                  }}
                >
                  {`${productName.length}/10`}
                </InputAdornment>
              ),
              style: {
                borderColor: !isProductNameValid ? "red" : "inherit",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "red",
                },
            }}
          />
          {!isProductNameValid && (
            <Typography variant="body2" color="error">
              {productNameErrorMessage}
            </Typography>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom align="left">
            Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            value={description}
            onChange={(e) => {
              const desc = e.target.value;
              if (validateDescription(desc)) {
                updateForm.setDescription(desc);
                updateForm.setIsDescriptionValid(true);
                updateForm.setDescriptionErrorMessage("");
              } else {
                updateForm.setIsDescriptionValid(false);
                updateForm.setDescriptionErrorMessage(
                  "Maximum 60 characters allowed."
                );
              }
            }}
            placeholder="Description"
            error={!isDescriptionValid}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    right: "8px",
                    color: "rgba(0, 0, 0, 0.38)",
                    fontSize: "0.75rem",
                  }}
                >
                  {`${description.length}/60`}
                </InputAdornment>
              ),
              style: {
                borderColor: !isDescriptionValid ? "red" : "inherit",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "red",
                },
              "& .MuiInputBase-multiline": {
                paddingBottom: "24px",
              },
            }}
          />
          {!isDescriptionValid && (
            <Typography variant="body2" color="error">
              {descriptionErrorMessage}
            </Typography>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <div className="flex items-center ">
            <Typography variant="subtitle1">Featured</Typography>
            <Checkbox
              checked={featured}
              onChange={(e) => updateForm.setFeatured(e.target.checked)}
              style={{
                color: "#4CAF50",
                padding: "0 8px 0 0",
              }}
            />
          </div>
        </Grid>
      </Grid>

      {/* Added spacing after second row */}
      <Box sx={{ mb: 6 }} />

      {/* Third section: Price, Slashed Price */}
      <Grid container spacing={12}>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" gutterBottom align="left">
            Price
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={price}
            onChange={(e) => {
              const priceValue = e.target.value;
              if (validatePrice(priceValue)) {
                updateForm.setPrice(priceValue);
                updateForm.setIsPriceValid(true);
                updateForm.setPriceErrorMessage("");
              } else {
                updateForm.setIsPriceValid(false);
                updateForm.setPriceErrorMessage("Only numbers are allowed.");
              }
            }}
            placeholder="Price"
            error={!isPriceValid}
            InputProps={{
              style: {
                borderColor: !isPriceValid ? "red" : "inherit",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "red",
                },
            }}
          />
          {!isPriceValid && (
            <Typography variant="body2" color="error">
              {priceErrorMessage}
            </Typography>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" gutterBottom align="left">
            Slashed out price
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={slashedPrice}
            onChange={(e) => {
              const slashedPriceValue = e.target.value;
              if (validatePrice(slashedPriceValue)) {
                updateForm.setSlashedPrice(slashedPriceValue);
                updateForm.setIsSlashedPriceValid(true);
                updateForm.setSlashedPriceErrorMessage("");
              } else {
                updateForm.setIsSlashedPriceValid(false);
                updateForm.setSlashedPriceErrorMessage(
                  "Only numbers are allowed."
                );
              }
            }}
            placeholder="Slashed out price"
            error={!isSlashedPriceValid}
            InputProps={{
              style: {
                borderColor: !isSlashedPriceValid ? "red" : "inherit",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "red",
                },
            }}
          />
          {!isSlashedPriceValid && (
            <Typography variant="body2" color="error">
              {slashedPriceErrorMessage}
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Added spacing after third section */}
      <Box sx={{ mb: 6 }} />

      {/* Fourth section: Category, Sub Category */}
      <Grid container spacing={12}>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" gutterBottom align="left">
            Category
          </Typography>
          <Autocomplete
            options={categories}
            value={category}
            onChange={(_, newValue) => {
              updateForm.setCategory(newValue);
              if (newValue) {
                updateForm.setIsCategoryValid(true);
                updateForm.setCategoryErrorMessage("");
              } else {
                updateForm.setIsCategoryValid(false);
                updateForm.setCategoryErrorMessage("Category is required.");
              }
            }}
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Category"
                size="small"
                error={!isCategoryValid}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "red",
                    },
                }}
              />
            )}
          />
          {!isCategoryValid && (
            <Typography variant="body2" color="error">
              {categoryErrorMessage}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" gutterBottom align="left">
            Sub Category
          </Typography>
          <Autocomplete
            options={subCategories}
            value={subCategory}
            onChange={(_, newValue) => {
              updateForm.setSubCategory(newValue);
              if (newValue) {
                updateForm.setIsSubCategoryValid(true);
                updateForm.setSubCategoryErrorMessage("");
              } else {
                updateForm.setIsSubCategoryValid(false);
                updateForm.setSubCategoryErrorMessage(
                  "Sub category is required."
                );
              }
            }}
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Sub Category"
                size="small"
                error={!isSubCategoryValid}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "red",
                    },
                }}
              />
            )}
          />
          {!isSubCategoryValid && (
            <Typography variant="body2" color="error">
              {subCategoryErrorMessage}
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Added spacing after fourth section */}
      <Box sx={{ mb: 6 }} />

      {/* Fifth section: Image Selection Component */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom align="left">
            Product Images
          </Typography>
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: "6px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              p: 4,
              width: "100%",
            }}
          >
            <ImageSelection
              images={images}
              setImages={updateForm.setImages}
              type="product"
            />
          </Box>
        </Grid>
      </Grid>

      {/* Added spacing after fifth section */}
      <Box sx={{ mb: 4 }} />

      {/* Sixth section: Variants */}
      <Grid container spacing={3} sx={{ mt: 2, mb: 12 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom align="left">
            Variants
          </Typography>
          <VariantManager
            variants={variants}
            setVariants={(newVariants) => {
              console.log("VariantManager callback - New variants:", newVariants);
              updateForm.setVariants(newVariants);
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductForm;
