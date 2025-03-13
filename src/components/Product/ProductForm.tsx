// ProductForm.tsx
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
 // Adjust the path to where you save ArrowBackButton
import ImageSelection from "../common/ImageSelection"; // Your Image Selection Component
import { VariantComponent, Variant } from "./Variant"; // Your Variant Component

interface ProductImage {
  id: number;
  url: string;
  selected: boolean;
}

const ProductForm: React.FC = () => {
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [slashedPrice, setSlashedPrice] = useState<string>("");
  const [category, setCategory] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [featured, setFeatured] = useState<boolean>(false);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  // Sample category and subcategory data
  const categories = ["Footwear", "Clothing", "Accessories"];
  const subCategories = ["Boots", "Sneakers", "Formal", "Casual"];

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

  const handleSubmit = () => {
    console.log("Form submitted", {
      description,
      price,
      slashedPrice,
      category,
      subCategory,
      featured,
      images,
      variants,
    });
  };

  const handleCancel = () => {
    console.log("Form cancelled");
  };

  return (
    <div className="ml-8 mr-8 mb-6 example">

        {/* Container for the ArrowBackButton and form header */}

        {/* Form content scrollable */}
        <div style={{ marginTop: "0px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom align="left">
                Name
              </Typography>
              <TextField fullWidth size="small" placeholder="Product Name" />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom align="left">
                Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
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
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <div className="flex items-center mt-6">
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

          <Grid container spacing={3}>
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

          <Grid container spacing={3}>
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
                  <TextField
                    {...params}
                    placeholder="Sub Category"
                    size="small"
                  />
                )}
              />
            </Grid>
          </Grid>

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

          <Grid container spacing={3} sx={{ mt: 2, mb: 12 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom align="left">
                Variants
              </Typography>
              <Box sx={{ width: "100%" }}>
                {variants.map((variant) => (
                  <VariantComponent
                    key={variant.id}
                    variant={variant}
                    onDelete={() => deleteVariant(variant.id)}
                    onComplete={completeVariant}
                  />
                ))}
                <Box
                  sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}
                >
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addVariant}
                    sx={{
                      color: "var(--secondary-color)",
                      textAlign: "left",
                      padding: "6px 8px",
                      minWidth: "auto",
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

        <Box
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            py: 2,
            px: 2,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{
              borderColor: "#0d7f3f",
              color: "#0d7f3f",
              width: "96px",
            }}
          >
            CANCEL
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: "var(--secondary-color, #4CAF50)",
              color: "white",
              width: "96px",
            }}
          >
            ADD
          </Button>
        </Box>
      
    </div>
  );
};

export default ProductForm;
