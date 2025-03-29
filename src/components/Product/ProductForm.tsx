import React, { useState, useContext, useEffect } from "react";
import {
  TextField,
  Typography,
  Checkbox,
  Autocomplete,
  Grid,
  InputAdornment,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import ImageSelection from "../common/ImageSelection";
import VariantManager from "./VariantManager";
import { ActionContext } from "../../context/ActionContext";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getProductById, updateProduct, addProduct } from "../../api/product";
import { Product } from "../../types/product.types";

interface ProductImage {
  id: number;
  url: string;
  selected: boolean;
}

const DEFAULT_CATEGORY_ID = "67ce9292891e6b7ec5df5831";
const DEFAULT_SUBCATEGORY_ID = "67cc21365983b789b129c1f6";
const DUMMY_IMAGES = [
  "https://dummyimage.com/600x400/000/fff",
  "https://dummyimage.com/600x400/001/fff",
  "https://dummyimage.com/600x400/002/fff",
  "https://dummyimage.com/600x400/003/fff",
];

const ProductForm: React.FC = () => {
  // Form state variables
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [slashedPrice, setSlashedPrice] = useState<string>("");
  const [category, setCategory] = useState<string | null>(DEFAULT_CATEGORY_ID);
  const [subCategory, setSubCategory] = useState<string | null>(
    DEFAULT_SUBCATEGORY_ID
  );
  const [featured, setFeatured] = useState<boolean>(false);
  const [images, setImages] = useState<ProductImage[]>(
    DUMMY_IMAGES.map((url, index) => ({ id: index, url, selected: true }))
  );
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [, setIsLoading] = useState<boolean>(false);

  // Add state for variants
  const [variants, setVariants] = useState<any[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const navigate = useNavigate();
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

  // Check if we're in edit mode and fetch product data if necessary
  useEffect(() => {
    const id = params.id;
    if (id && id !== "new") {
      setIsEditMode(true);
      setProductId(id);

      // Fetch product data based on ID
      if (location.state?.product) {
        const product = location.state.product;
        setProductName(product.name || "");
        setDescription(product.description || "");
        setPrice(product.price?.toString() || "");
        setSlashedPrice(product.slashedPrice?.toString() || "");
        setCategory(product.categoryId || DEFAULT_CATEGORY_ID);
        setSubCategory(product.subCategoryId || DEFAULT_SUBCATEGORY_ID);
        setFeatured(product.featured || false);
        setImages(
          product.images.map((url: string, index: number) => ({
            id: index,
            url,
            selected: true,
          }))
        );
        setVariants(product.variants || []);
      } else {
        // Fetch product data from API if not available in location state
        setIsLoading(true);
        getProductById(id)
          .then((response) => {
            const product = response.data;
            setProductName(product.name || "");
            setDescription(product.description || "");
            setPrice(product.price?.toString() || "");
            setSlashedPrice(product.slashedPrice?.toString() || "");
            setCategory(product.categoryId || DEFAULT_CATEGORY_ID);
            setSubCategory(product.subCategoryId || DEFAULT_SUBCATEGORY_ID);
            setFeatured(product.isFeatured || false);
          })
          .catch((error) => {
            console.error("Error fetching product:", error);
          })
          .finally(() => {
            setIsLoading(false);
          });
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

  const handleSaveProduct = async () => {
    // Validation checks
    const validations = [
      {
        condition: isProductNameValid,
        errorMessage: "Please enter a valid product name",
      },
      {
        condition: isDescriptionValid,
        errorMessage: "Please enter a valid description",
      },
      {
        condition: isPriceValid,
        errorMessage: "Please enter a valid price",
      },
      {
        condition: isSlashedPriceValid,
        errorMessage: "Please enter a valid slashed price",
      },
      {
        condition: isCategoryValid,
        errorMessage: "Please select a category",
      },
      {
        condition: isSubCategoryValid,
        errorMessage: "Please select a sub-category",
      },
    ];

    const failedValidation = validations.find(
      (validation) => !validation.condition
    );

    if (failedValidation) {
      setSnackbarMessage(failedValidation.errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    setIsLoading(true);

    // Ensure we have valid image data
    const productImages = images
      .filter((img) => img.selected)
      .map((img) => img.url);
    if (productImages.length === 0) {
      // If no images are selected, use the dummy images
      productImages.push(...DUMMY_IMAGES);
    }

    // Prepare product data
    const productData: Product = {
      _id: isEditMode && productId ? productId : "",
      name: productName,
      description,
      price: parseFloat(price) || 0,
      slashedPrice: parseFloat(slashedPrice) || 0,
      categoryId: category || DEFAULT_CATEGORY_ID,
      subCategoryId: subCategory || DEFAULT_SUBCATEGORY_ID,
      isFeatured: featured,
      // Make sure we're sending an array of image URLs
      images: productImages,
      // Make sure we're setting a valid thumbnail image
      thumbnailImage: productImages[0],
      quantity: 0, // You might want to add a field for quantity
      createdAt: isEditMode ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Include variants if they exist
      //variants: variants.length > 0 ? variants : undefined,
    };

    try {
      if (isEditMode && productId) {
        productData._id = productId;
      }
      let response;
      if (isEditMode && productId) {
        // Update existing product
        response = await updateProduct(productId, productData);
      } else {
        // Add new product
        response = await addProduct(productData);
      }

      if (response.status === 200) {
        setSnackbarMessage(
          isEditMode
            ? "Product updated successfully"
            : "Product added successfully"
        );
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        // Navigate back to product list or product details
        setTimeout(() => {
          navigate("/products");
        }, 1500);
      } else {
        throw new Error(response.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      setSnackbarMessage(
        error instanceof Error ? error.message : "Failed to save product"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Sample category and subcategory data
  const categories = ["Footwear", "Clothing", "Accessories"];
  const subCategories = ["Boots", "Sneakers", "Formal", "Casual"];

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
          <VariantManager variants={variants} setVariants={setVariants} />
        </Grid>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </div>
  );
};

export default ProductForm;
