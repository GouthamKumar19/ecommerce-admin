import React, { useState, useContext, useEffect } from "react";
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
import { ActionContext } from "../../context/ActionContext";
import { useParams, useLocation } from "react-router-dom";

interface ProductImage {
  id: number;
  url: string;
  selected: boolean;
}

const ProductForm: React.FC = () => {
  // Form state variables
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [slashedPrice, setSlashedPrice] = useState<string>("");
  const [category, setCategory] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [featured, setFeatured] = useState<boolean>(false);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Add state for variants
  const [variants, setVariants] = useState<Variant[]>([]);

  // Validation states
  const [isProductNameValid, setIsProductNameValid] = useState<boolean>(true);
  const [isPriceValid, setIsPriceValid] = useState<boolean>(true);
  const [isSlashedPriceValid, setIsSlashedPriceValid] = useState<boolean>(true);
  const [isDescriptionValid, setIsDescriptionValid] = useState<boolean>(true);
  const [isCategoryValid, setIsCategoryValid] = useState<boolean>(true);
  const [isSubCategoryValid, setIsSubCategoryValid] = useState<boolean>(true);
  const [productNameErrorMessage, setProductNameErrorMessage] =
    useState<string>("");
  const [priceErrorMessage, setPriceErrorMessage] = useState<string>("");
  const [slashedPriceErrorMessage, setSlashedPriceErrorMessage] =
    useState<string>("");
  const [descriptionErrorMessage, setDescriptionErrorMessage] =
    useState<string>("");
  const [categoryErrorMessage, setCategoryErrorMessage] = useState<string>("");
  const [subCategoryErrorMessage, setSubCategoryErrorMessage] =
    useState<string>("");

  // Context and routing hooks
  const { setActionHandlers } = useContext(ActionContext);
  const params = useParams();
  const location = useLocation();

  // Check if we're in edit mode
  useEffect(() => {
    const id = params.id;
    if (id && id !== "new") {
      setIsEditMode(true);
      setProductId(id);

      // Here you would fetch product data based on ID
      // For demonstration purposes, let's assume we have the data from location state
      if (location.state?.product) {
        const product = location.state.product;
        setProductName(product.name || "");
        setDescription(product.description || "");
        setPrice(product.price?.toString() || "");
        setSlashedPrice(product.slashedPrice?.toString() || "");
        setCategory(product.category || null);
        setSubCategory(product.subCategory || null);
        setFeatured(product.featured || false);
        // Setup images and variants here too
      }
    }
  }, [params.id, location.state]);

  // Set up action handlers for the parent component
  useEffect(() => {
    setActionHandlers({
      onConfirm: handleSaveProduct,
      onCancel: () => {
        console.log("Product form cancelled");
      },
    });

    return () => {
      // Reset action handlers when component unmounts
      setActionHandlers({
        onConfirm: () => console.warn("onConfirm is not implemented"),
        onCancel: () => console.warn("onCancel is not implemented"),
      });
    };
  }, [
    productName,
    description,
    price,
    slashedPrice,
    category,
    subCategory,
    featured,
    images,
    variants,
    isEditMode,
    setActionHandlers,
  ]);

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

  const handleSaveProduct = async () => {
    setIsLoading(true);
    console.log(isLoading);
    // Create the product data object
    const productData = {
      id: productId,
      name: productName,
      description,
      price: parseFloat(price) || 0,
      slashedPrice: parseFloat(slashedPrice) || 0,
      category,
      subCategory,
      featured,
      images: images.filter((img) => img.selected).map((img) => img.url),
      variants: completedVariants,
    };

    console.log("Saving product:", productData);

    // Here you would make the API call to save/update the product
    // For now, we'll just simulate success
    setTimeout(() => {
      setIsLoading(false);
      // Success would be handled by the parent
    }, 1000);
  };

  // Sample category and subcategory data
  const categories = ["Footwear", "Clothing", "Accessories"];
  const subCategories = ["Boots", "Sneakers", "Formal", "Casual"];

  // Group variants by completion status
  const completedVariants = variants.filter((v) => v.isComplete);
  const incompleteVariants = variants.filter((v) => !v.isComplete);

  // Validation functions
  const validateProductName = (name: string) =>
    /^[a-zA-Z\s]*$/.test(name) && name.length <= 10;
  const validatePrice = (price: string) => /^\d*\.?\d*$/.test(price);
  const validateDescription = (desc: string) => desc.length <= 60;

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
                setProductName(name);
                setIsProductNameValid(true);
                setProductNameErrorMessage("");
              } else {
                setIsProductNameValid(false);
                if (!/^[a-zA-Z\s]*$/.test(name)) {
                  setProductNameErrorMessage("Only characters are allowed.");
                } else if (name.length > 10) {
                  setProductNameErrorMessage("Maximum 10 characters allowed.");
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
                setDescription(desc);
                setIsDescriptionValid(true);
                setDescriptionErrorMessage("");
              } else {
                setIsDescriptionValid(false);
                setDescriptionErrorMessage("Maximum 60 characters allowed.");
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
            onChange={(e) => {
              const priceValue = e.target.value;
              if (validatePrice(priceValue)) {
                setPrice(priceValue);
                setIsPriceValid(true);
                setPriceErrorMessage("");
              } else {
                setIsPriceValid(false);
                setPriceErrorMessage("Only numbers are allowed.");
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
                setSlashedPrice(slashedPriceValue);
                setIsSlashedPriceValid(true);
                setSlashedPriceErrorMessage("");
              } else {
                setIsSlashedPriceValid(false);
                setSlashedPriceErrorMessage("Only numbers are allowed.");
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
              setCategory(newValue);
              if (newValue) {
                setIsCategoryValid(true);
                setCategoryErrorMessage("");
              } else {
                setIsCategoryValid(false);
                setCategoryErrorMessage("Category is required.");
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
              setSubCategory(newValue);
              if (newValue) {
                setIsSubCategoryValid(true);
                setSubCategoryErrorMessage("");
              } else {
                setIsSubCategoryValid(false);
                setSubCategoryErrorMessage("Sub category is required.");
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
