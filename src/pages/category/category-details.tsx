import { useState, useEffect, useContext } from "react";
import { Box } from "@mui/material";
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import CategoryForm from "../../components/Category/CategoryForm";
import { ActionContext } from "../../context/ActionContext";
import { useParams, useNavigate } from "react-router-dom";
import {
  createCategory,
  getCategoryById,
  updateCategory,
} from "../../api/category";
import { getPresignedUrl, uploadFile } from "../../api/collectionImage";

export const CategoryDetails = () => {
  const { setActionHandlers } = useContext(ActionContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [images, setImages] = useState<
    { id: number; url: string; selected: boolean }[]
  >([]);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    categoryName: false,
    images: false,
  });
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Check if we're in edit mode and fetch category data
    const fetchCategoryData = async () => {
      if (id && id !== "new") {
        setIsEdit(true);
        setIsLoading(true);

        try {
          const response = await getCategoryById(id);
          if (response && response.data) {
            setCategoryName(response.data.name || "");
            // Set images if available in the response
            if (response.data.image) {
              setImages([{ id: 1, url: response.data.image, selected: true }]);
            }
          }
        } catch (error) {
          console.error("Error fetching category:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCategoryData();
  }, [id]);

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
  }, [setActionHandlers, categoryName, images, isEdit]);

  const uploadPendingImages = async () => {
    const selectedImages = images.filter((img) => img.selected);
    if (selectedImages.length < 1) {
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
            const fileName = `category_image_${Date.now()}.jpg`;
            const imageFile = new File([blob], fileName, {
              type: "image/jpeg",
            });

            // Store the formatted filename that will be sent to the server
            const formattedFileName = `/public/ecommerce/category/${fileName.toLowerCase().replace(/\s+/g, "_")}`;

            // Get presigned URL and upload
            const presignedUrl = await getPresignedUrl(fileName, "category");
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

  const handleSave = async () => {
    const errorsCopy = { ...errors };

    if (categoryName.trim() === "") {
      errorsCopy.categoryName = true;
    }

    if (images.length === 0 || !images.some((img) => img.selected)) {
      errorsCopy.images = true;
    }

    setErrors(errorsCopy);

    if (errorsCopy.categoryName || errorsCopy.images) {
      console.error("All fields are required and must be valid");
      return;
    }

    setIsLoading(true);

    try {
      // Upload images and get the URLs
      const uploadedImageUrls = await uploadPendingImages();

      const payload = {
        name: categoryName,
        image:
          uploadedImageUrls && uploadedImageUrls.length > 0
            ? uploadedImageUrls[0]
            : "/ecommerce/categories/default.png",
      };

      let response;
      if (isEdit && id && id !== "new") {
        // Update existing category
        response = await updateCategory(id, payload);
        console.log("Update Category API Response:", response);

        if (response && response.status === 200) {
          navigate("/category");
        }
      } else {
        // Create new category
        response = await createCategory(payload);
        console.log("Create Category API Response:", response);

        // Check for success in the response
        if (response && response.status === 200) {
          // Display success message or navigate
          console.log("New Category ID:", response.data.id);
          navigate("/category");
        } else {
          console.error("Failed to create category:", response.message);
          throw new Error(response.message);
        }
      }
    } catch (error) {
      console.error("Error during category save operation: ", error);
      // Optionally display a toast or error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("Category form cancelled");
    navigate("/category");
  };

  // Handlers to update state from form
  const handleNameChange = (name: string, isValid: boolean) => {
    setCategoryName(name);
    setErrors((prev) => ({ ...prev, categoryName: !isValid }));
  };

  const handleImagesChange = (
    updatedImages: { id: number; url: string; selected: boolean }[]
  ) => {
    setImages(updatedImages);
    setErrors((prev) => ({
      ...prev,
      images:
        updatedImages.length === 0 ||
        !updatedImages.some((img) => img.selected),
    }));
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
          paddingBottom: "80px", // Add extra padding at the bottom to prevent overlap
          scrollbarWidth: "none", // For Firefox
          "&::-webkit-scrollbar": {
            display: "none", // For Chrome, Safari, and Opera
          },
        }}
      >
        <CategoryForm
          categoryName={categoryName}
          images={images}
          errors={errors}
          onNameChange={handleNameChange}
          onImagesChange={handleImagesChange}
          isEditMode={isEdit}
        />
      </Box>

      {/* Bottom section with ActionBox component */}
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
          isLoading={isLoading || uploadInProgress}
        />
      </Box>
    </Box>
  );
};

export default CategoryDetails;
