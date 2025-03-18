import React, { useState } from "react";
import {
  TextField,
  Typography,
  Checkbox,
  Autocomplete,
  Grid,
  InputAdornment,
  Box,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ImageSelection from "../common/ImageSelection";
import { VariantComponent, Variant } from "./Variant";

interface ProductImage {
  id: number;
  url: string;
  selected: boolean;
}

const ProductForm: React.FC = () => {
  // const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [slashedPrice, setSlashedPrice] = useState<string>("");
  const [category, setCategory] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [featured, setFeatured] = useState<boolean>(false);
  const [images, setImages] = useState<ProductImage[]>([]);

  // Add state for variants
  const [variants, setVariants] = useState<Variant[]>([]);

  // Sample category and subcategory data
  const categories = ["Footwear", "Clothing", "Accessories"];
  const subCategories = ["Boots", "Sneakers", "Formal", "Casual"];

  // Group variants by completion status
  const completedVariants = variants.filter((v) => v.isComplete);
  const incompleteVariants = variants.filter((v) => !v.isComplete);

  // Functions to handle variants
  const addVariant = () => {
    const newVariant: Variant = {
      id: `variant-${Date.now()}`,
      optionName: "",
      optionValues: [],
      isComplete: false,
    };
    setVariants([...variants, newVariant]);
  };

  const deleteVariant = (id: string) => {
    setVariants(variants.filter((variant) => variant.id !== id));
  };

  const completeVariant = (updatedVariant: Variant) => {
    setVariants(
      variants.map((variant) =>
        variant.id === updatedVariant.id ? updatedVariant : variant
      )
    );
  };

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
                  {`${description.length}/10`}
                </InputAdornment>
              ),
            }}
            placeholder="Product Name"
          />
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
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
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
            }}
            sx={{
              "& .MuiInputBase-multiline": {
                paddingBottom: "24px",
              },
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <div className="flex items-center ">
            <Typography variant="subtitle1">Featured</Typography>
            <Checkbox
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
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
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" gutterBottom align="left">
            Slashed out price
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={slashedPrice}
            onChange={(e) => setSlashedPrice(e.target.value)}
            placeholder="Slashed out price"
          />
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
            onChange={(_, newValue) => setCategory(newValue)}
            fullWidth
            renderInput={(params) => (
              <TextField {...params} placeholder="Category" size="small" />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" gutterBottom align="left">
            Sub Category
          </Typography>
          <Autocomplete
            options={subCategories}
            value={subCategory}
            onChange={(_, newValue) => setSubCategory(newValue)}
            fullWidth
            renderInput={(params) => (
              <TextField {...params} placeholder="Sub Category" size="small" />
            )}
          />
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
            <ImageSelection images={images} setImages={setImages} />
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
          <Box sx={{ width: "100%" }}>
            {/* Display completed variants first */}
            {completedVariants.length > 0 && (
              <Box sx={{ mb: 3 }}>
                {completedVariants.map((variant) => (
                  <VariantComponent
                    key={variant.id}
                    variant={variant}
                    onDelete={() => deleteVariant(variant.id)}
                    onComplete={completeVariant}
                  />
                ))}
              </Box>
            )}

            {/* Display incomplete variants */}
            {incompleteVariants.map((variant) => (
              <VariantComponent
                key={variant.id}
                variant={variant}
                onDelete={() => deleteVariant(variant.id)}
                onComplete={completeVariant}
              />
            ))}

            {/* Add variants button now appears below all variants */}
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}>
              <Button
                startIcon={<AddIcon />}
                onClick={addVariant}
                sx={{
                  color: "var(--secondary-color)",
                  textAlign: "left",
                  padding: "6px 8px",
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
                variant="text"
              >
                Add variants like size and color
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductForm;
