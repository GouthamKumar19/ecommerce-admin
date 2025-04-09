import { useState, useEffect, useContext } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import ProductForm from "../../components/Product/ProductForm";
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import { ActionContext } from "../../context/ActionContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getProductById, updateProduct, addProduct, addProductVariants,updateProductVariants } from "../../api/product";
import { getPresignedUrl, uploadFile } from "../../api/collectionImage";
import { Product } from "../../types/product.types";
import { Variant } from "../../components/Product/VariantManager"; // Import Variant type
import { getImage } from "../../utils/imagePreview";


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
  const [variants, setVariants] = useState<Variant[]>([]);

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

  // Helper function to process variants from API response
  // Helper function to process variants from API response
  // Helper function to process variants from API response
  // Helper function to process variants from API response
  const processVariantsFromAPI = (apiResponse: any): Variant[] => {
    // Get the product ID from the response
    const productId = apiResponse._id || "";

    // Check if we have variantDetails array in the response
    if (
      apiResponse.variantDetails &&
      Array.isArray(apiResponse.variantDetails)
    ) {
      // Group variants by optionName
      const variantGroups: {
        [key: string]: { values: string[]; ids: string[] };
      } = {};

      apiResponse.variantDetails.forEach((variant: any) => {
        const { _id, name, value } = variant;
        if (!variantGroups[name]) {
          variantGroups[name] = { values: [], ids: [] };
        }
        // Only add unique values
        if (!variantGroups[name].values.includes(value)) {
          variantGroups[name].values.push(value);
          variantGroups[name].ids.push(_id);
        }
      });

      // Convert to Variant array format preserving IDs
      return Object.entries(variantGroups).map(([optionName, data]) => ({
        id: productId, // Keep the product ID
        optionName,
        optionValues: data.values,
        optionIds: data.ids, // Store variant IDs
        isComplete: true,
      }));
    }
    // Check if we have structured variants data in the response
    else if (apiResponse.variants && typeof apiResponse.variants === "object") {
      // Handle the case where variants are already grouped
      return Object.entries(apiResponse.variants).map(
        ([optionName, optionValues]) => ({
          id: productId,
          optionName,
          optionValues: Array.isArray(optionValues) ? optionValues : [],
          optionIds: [], // No IDs available in this format
          isComplete: true,
        })
      );
    }

    // Return empty array if no variants found
    return [];
  };

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
        setFeatured(product.isFeatured || false);
        setImages(
          product.images.map((url: string, index: number) => ({
            id: index,
            url: getImage(url), // Use getImage to format the URL
            selected: true,
          }))
        );

        setVariants(processVariantsFromAPI(product));
      } else {
        // Fetch product data from API if not available in location state
        setIsLoading(true);
        getProductById(id)
          .then((response) => {
            const product = response.data;
            console.log("API Response:", response.data);
            console.log(
              "Processed Variants:",
              processVariantsFromAPI(response.data)
            );
            setProductName(product.name || "");
            setDescription(product.description || "");
            setPrice(product.price?.toString() || "");
            setSlashedPrice(product.slashedPrice?.toString() || "");
            setCategory(product.categoryId || DEFAULT_CATEGORY_ID);
            setSubCategory(product.subCategoryId || DEFAULT_SUBCATEGORY_ID);
            setFeatured(product.isFeatured || false);
            setImages(
              product.images.map((url: string, index: number) => ({
                id: index,
                url: getImage(url), // Use getImage to format the URL
                selected: true,
              }))
            );

            // Process variants if they exist
            setVariants(processVariantsFromAPI(product));
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
            const fileName = `image_${Date.now()}.jpg`;
            const imageFile = new File([blob], fileName, {
              type: "image/jpeg",
            });

            // Store the formatted filename that will be sent to the server
            const formattedFileName = `public/ecommerce/product/${fileName.toLowerCase().replace(/\s+/g, "_")}`;

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

  // Function to add product variants after the product is saved
 const saveProductVariants = async (productId: string) => {
   // Only process completed variants that have values
   const completedVariants = variants.filter(
     (variant) => variant.isComplete && variant.optionValues.length > 0
   );

   if (completedVariants.length === 0) {
     return; // No variants to add or update
   }

   try {
     if (isEdit) {
       // For edit mode, we need to be careful to only update existing variants and only add new ones
       const updatePayload: Array<{
         _id: string;
         name: string;
         value: string;
       }> = [];
       const newVariantsPayload: Array<{
         productId: string;
         name: string;
         value: string;
       }> = [];

       // Process each variant
       completedVariants.forEach((variant) => {
         // Track which values have matching IDs to avoid duplicates
         const processedValues = new Set<string>();

         // First process existing variants (with IDs)
         if (variant.optionIds && variant.optionIds.length > 0) {
           variant.optionIds.forEach((id, idIndex) => {
             if (id && idIndex < variant.optionValues.length) {
               const value = variant.optionValues[idIndex];
               updatePayload.push({
                 _id: id,
                 name: variant.optionName,
                 value: value,
               });
               processedValues.add(value);
             }
           });
         }

         // Then add only truly new values (that weren't processed above)
         variant.optionValues.forEach((value) => {
           if (!processedValues.has(value)) {
             newVariantsPayload.push({
               productId: productId,
               name: variant.optionName,
               value: value,
             });
           }
         });
       });

       // Update existing variants only if there are any
       if (updatePayload.length > 0) {
         console.log("Updating existing variants:", updatePayload);
         await updateProductVariants(updatePayload);
       }

       // Add new variants only if there are any
       if (newVariantsPayload.length > 0) {
         console.log("Adding new variant values:", newVariantsPayload);
         await addProductVariants(newVariantsPayload);
       }

       console.log("Product variants processed successfully");
     } else {
       // For new products, use the existing addProductVariants function
       const variantPayload = completedVariants.flatMap((variant) =>
         variant.optionValues.map((value) => ({
           productId: productId,
           name: variant.optionName,
           value: value,
         }))
       );

       await addProductVariants(variantPayload);
       console.log("Product variants added successfully");
     }
   } catch (error) {
     console.error(`Error handling product variants:`, error);
     // Still consider the product save successful even if variants fail
     setSnackbarMessage(
       `Product saved, but there was an issue with the variants`
     );
     setSnackbarSeverity("error");
     setOpenSnackbar(true);
   }
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
      };

      let response;
      let productId = "";

      if (isEdit && id) {
        // Update existing product
        response = await updateProduct(id, productData);
        productId = id;
      } else {
        // Add new product
        response = await addProduct(productData);
        // Extract the ID from the response
        productId = response.data?._id || "";
      }

      if (response.status === 200) {
        // If we have a product ID and variants, save them
        if (productId && variants.length > 0) {
          await saveProductVariants(productId);
        }

        setSnackbarMessage(
          isEdit ? "Product updated successfully" : "Product added successfully"
        );
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        // Navigate back to product list after a short delay
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