import React, { useState } from "react";
import {
  TextField,
  Typography,
  Checkbox,
  Autocomplete,
  Grid,
  IconButton,
  Button,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageSelection from "./ImageSelection";

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

  // Sample category and subcategory data
  const categories = ["Footwear", "Clothing", "Accessories"];
  const subCategories = ["Boots", "Sneakers", "Formal", "Casual"];

  return (
    <div className="ml-8 mr-8">
      <div className="relative ml-0">
        <div className="mb-6 text-left">
          <IconButton
            style={{
              position: "relative",
              left: "0px",
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </div>

        {/* Form content */}
        <div className="mb-4 space-y-8 mx-auto overflow-hidden example">
          <Grid container spacing={3}>
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
          {/* Second section: Price, Slashed Price */}
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
          {/* Third section: Category, Sub Category */}
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
          {/* Fourth section: Image Selection Component */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom align="left">
                Product Images
              </Typography>
              <div className="bg-white rounded-md shadow-md p-4">
                <ImageSelection images={images} setImages={setImages} />
              </div>
            </Grid>
          </Grid>
          {/* Action buttons */}
          <div className="flex justify-between py-4 border-t border-gray-200">
            <Button variant="outlined" color="inherit" className="w-[48%]">
              Cancel
            </Button>
            <Button
              variant="contained"
              className="w-[48%]"
              style={{
                backgroundColor: "#4CAF50",
              }}
            >
              Add Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
