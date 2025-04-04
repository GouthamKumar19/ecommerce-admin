import { useState, useEffect, useContext } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import ProductForm from "../../components/Product/ProductForm";
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import { ActionContext } from "../../context/ActionContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getProductById, updateProduct, addProduct } from "../../api/product";
import { getPresignedUrl, uploadFile } from "../../api/collectionImage";
import { Product } from "../../types/product.types";

interface ProductImage {
  id: number;
  url: string;
  selected: boolean;
}

const DEFAULT_CATEGORY_ID = "67ce9292891e6b7ec5df5831";
const DEFAULT_SUBCATEGORY_ID = "67cc21365983b789b129c1f6";

export const ProductDetails = () => {
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
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<any[]>([]);

  // UI state variables
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [, setUploadInProgress] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

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
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Check if we're in edit mode and fetch product data if necessary
  useEffect(() => {
    if (id && id !== "new") {
      setIsEdit(true);

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
            //setFeatured(product.featured || false);
            setImages(
              product.images.map((url: string, index: number) => ({
                id: index,
                url,
                selected: true,
              }))
            );
            //setVariants(product.variants || []);
          })
          .catch((error) => {
            console.error("Error fetching product:", error);
            setSnackbarMessage("Failed to fetch product details");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [id, location.state]);

  useEffect(() => {
    // Set up action handlers for the ActionBox component
    setActionHandlers({
      onConfirm: handleSave,
      onCancel: handleCancel,
    });

    // Cleanup function to reset handlers when component unmounts
    return () => {
      setActionHandlers({
        onConfirm: () => console.warn("onConfirm is not implemented"),
        onCancel: () => console.warn("onCancel is not implemented"),
      });
    };
  }, [
    setActionHandlers,
    productName,
    description,
    price,
    slashedPrice,
    category,
    subCategory,
    featured,
    images,
    variants,
    isEdit,
  ]);

  const uploadPendingImages = async () => {
    const selectedImages = images.filter((img) => img.selected);
    if (selectedImages.length < 4) {
      return null;
    }

    const uploadedImageUrls = await Promise.all(
      selectedImages.map(async (selectedImage) => {
        if (selectedImage.url.startsWith("data:image")) {
          setUploadInProgress(true);
          try {
            // Convert base64 to blob
            const response = await fetch(selectedImage.url);
            const blob = await response.blob();

            // Create a file from the blob
            const fileName = `product_image_${Date.now()}.jpg`;
            const imageFile = new File([blob], fileName, {
              type: "image/jpeg",
            });

            // Store the formatted filename that will be sent to the server
            const formattedFileName = `/public/ecommerce/product/${fileName.toLowerCase().replace(/\s+/g, "_")}`;

            // Get presigned URL and upload
            const presignedUrl = await getPresignedUrl(fileName, "product");
            await uploadFile(presignedUrl, imageFile);

            // Return the formatted filename instead of the presigned URL
            return formattedFileName;
          } catch (error) {
            console.error("Error uploading image:", error);
            throw new Error("Failed to upload image");
          } finally {
            setUploadInProgress(false);
          }
        }

        // If the image is already a URL, just return it
        return selectedImage.url;
      })
    );

    return uploadedImageUrls;
  };

  const validateForm = () => {
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
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Upload images and get the URLs
      const uploadedImageUrls = await uploadPendingImages();
      if (!uploadedImageUrls || uploadedImageUrls.length < 4) {
        throw new Error("Please select at least 4 images.");
      }

      // Prepare product data
      const productData: Product = {
        _id: isEdit && id ? id : "",
        name: productName,
        description,
        price: parseFloat(price) || 0,
        slashedPrice: parseFloat(slashedPrice) || 0,
        categoryId: category || DEFAULT_CATEGORY_ID,
        subCategoryId: subCategory || DEFAULT_SUBCATEGORY_ID,
        isFeatured: featured,
        // Make sure we're sending an array of image URLs
        images: uploadedImageUrls,
        // Make sure we're setting a valid thumbnail image
        thumbnailImage: uploadedImageUrls[0],
        quantity: 0, // You might want to add a field for quantity
        createdAt: isEdit ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Include variants if they exist
        //variants: variants.length > 0 ? variants : undefined,
      };

      let response;
      if (isEdit && id) {
        // Update existing product
        response = await updateProduct(id, productData);
      } else {
        // Add new product
        response = await addProduct(productData);
      }

      if (response.status === 200) {
        setSnackbarMessage(
          isEdit ? "Product updated successfully" : "Product added successfully"
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

  const handleCancel = () => {
    navigate("/products");
  };

  // Functions to update form state - these will be passed to ProductForm
  const updateFormState = {
    setProductName,
    setDescription,
    setPrice,
    setSlashedPrice,
    setCategory,
    setSubCategory,
    setFeatured,
    setImages,
    setVariants,
    setIsProductNameValid,
    setIsPriceValid,
    setIsSlashedPriceValid,
    setIsDescriptionValid,
    setIsCategoryValid,
    setIsSubCategoryValid,
    setProductNameErrorMessage,
    setPriceErrorMessage,
    setSlashedPriceErrorMessage,
    setDescriptionErrorMessage,
    setCategoryErrorMessage,
    setSubCategoryErrorMessage,
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "white",
        borderRadius: "8px",
      }}
    >
      {/* Top section - fixed */}
      <Box
        sx={{
          padding: 2,
          boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "white",
        }}
      >
        <BackArrow />
      </Box>

      {/* Middle section - scrollable with padding at bottom to prevent content overlap */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
          paddingBottom: "80px",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <ProductForm
          productName={productName}
          description={description}
          price={price}
          slashedPrice={slashedPrice}
          category={category}
          subCategory={subCategory}
          featured={featured}
          images={images}
          variants={variants}
          isProductNameValid={isProductNameValid}
          isPriceValid={isPriceValid}
          isSlashedPriceValid={isSlashedPriceValid}
          isDescriptionValid={isDescriptionValid}
          isCategoryValid={isCategoryValid}
          isSubCategoryValid={isSubCategoryValid}
          productNameErrorMessage={productNameErrorMessage}
          priceErrorMessage={priceErrorMessage}
          slashedPriceErrorMessage={slashedPriceErrorMessage}
          descriptionErrorMessage={descriptionErrorMessage}
          categoryErrorMessage={categoryErrorMessage}
          subCategoryErrorMessage={subCategoryErrorMessage}
          updateForm={updateFormState}
        />
      </Box>

      {/* Bottom section - fixed with increased bottom spacing */}
      <Box
        sx={{
          padding: 3,
          paddingBottom: 4,
          boxShadow: "0px -2px 4px rgba(0,0,0,0.05)",
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          bgcolor: "white",
        }}
      >
        <ActionBox
          cancelText="Cancel"
          confirmText={isEdit ? "Update" : "Add"}
          isLoading={isLoading}
        />
      </Box>

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
    </Box>
  );
};

export default ProductDetails;
