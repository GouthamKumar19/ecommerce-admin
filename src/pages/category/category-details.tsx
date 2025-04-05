import { useState, useEffect, useContext } from "react";
import { Box, CircularProgress } from "@mui/material";
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import CategoryForm from "../../components/Category/CategoryForm";
import { ActionContext } from "../../context/ActionContext";
import { useParams, useNavigate } from "react-router-dom";
import {
  createCategory,
  getCategoryById,
  updateCategory,
  createSubCategory,
  updateSubcategories,
} from "../../api/category";
import { getPresignedUrl, uploadFile } from "../../api/collectionImage";
import { Subcategory } from "../../types/category.types"; // Import Subcategory type

export const CategoryDetails = () => {
  const { setActionHandlers } = useContext(ActionContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [images, setImages] = useState<
    { id: number; url: string; selected: boolean }[]
  >([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
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

          if (response && response.status === 200) {
            console.log("API Response:", response); // Log the API response

            // Set category name
            setCategoryName(response.data.name || "");

            // Set images if available in the response
            if (response.data.image) {
              setImages([{ id: 1, url: response.data.image, selected: true }]);
            }

            // Set subcategories if available in the response
            if (
              response.data.subcategories &&
              response.data.subcategories.length > 0
            ) {
              const formattedSubcategories = response.data.subcategories.map(
                (subcategory: any, index: number) => ({
                  id: index + 1,
                  _id: subcategory._id || "",
                  name: subcategory.name || "",
                  // Format images for the subcategory as expected by the form
                  images: subcategory.image
                    ? [
                        {
                          id: 1,
                          url: subcategory.image,
                          selected: true,
                        },
                      ]
                    : [],
                  image: subcategory.image || "",
                  createdAt: subcategory.createdAt || "",
                  updatedAt: subcategory.updatedAt || "",
                })
              );

              console.log("Formatted subcategories:", formattedSubcategories);
              setSubcategories(formattedSubcategories);
            } else {
              // If no subcategories, initialize with one empty subcategory
              setSubcategories([
                {
                  id: 1,
                  _id: "",
                  name: "",
                  images: [],
                  image: "",
                  createdAt: "",
                  updatedAt: "",
                } as Subcategory,
              ]);
            }
          } else {
            console.error("Invalid response format:", response);
            throw new Error("Invalid response format");
          }
        } catch (error) {
          console.error("Error fetching category:", error);
          // Set default values in case of error
          setCategoryName("");
          setImages([]);
          setSubcategories([
            {
              id: 1,
              _id: "",
              name: "",
              images: [],
              image: "",
              createdAt: "",
              updatedAt: "",
            } as Subcategory,
          ]);
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
  }, [setActionHandlers, categoryName, images, isEdit, subcategories]);

  const uploadPendingImages = async () => {
    const selectedImages = images.filter(
      (img: { id: number; url: string; selected: boolean }) => img.selected
    );
    if (selectedImages.length < 1) {
      return null;
    }

    const uploadedImageUrls = await Promise.all(
      selectedImages.map(
        async (selectedImage: {
          id: number;
          url: string;
          selected: boolean;
        }) => {
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
        }
      )
    );

    return uploadedImageUrls;
  };

  // Helper function to upload subcategory images
  const uploadSubcategoryImages = async (subcategory: Subcategory) => {
    const selectedImages = (subcategory.images || []).filter(
      (img: { id: number; url: string; selected: boolean }) => img.selected
    );

    if (selectedImages.length < 1) {
      return subcategory.image || "/ecommerce/categories/default.png";
    }

    const uploadedImageUrls = await Promise.all(
      selectedImages.map(
        async (selectedImage: {
          id: number;
          url: string;
          selected: boolean;
        }) => {
          if (selectedImage.url.startsWith("data:image")) {
            setUploadInProgress(true);
            try {
              // Convert base64 to blob
              const response = await fetch(selectedImage.url);
              const blob = await response.blob();

              // Create a file from the blob
              const fileName = `subcategory_image_${Date.now()}_${subcategory.id}.jpg`;
              const imageFile = new File([blob], fileName, {
                type: "image/jpeg",
              });

              // Store the formatted filename
              const formattedFileName = `/public/ecommerce/subcategory/${fileName.toLowerCase().replace(/\s+/g, "_")}`;

              // Get presigned URL and upload
              const presignedUrl = await getPresignedUrl(
                fileName,
                "subcategory"
              );
              await uploadFile(presignedUrl, imageFile);

              return formattedFileName;
            } catch (error) {
              console.error("Error uploading subcategory image:", error);
              return subcategory.image || "/ecommerce/categories/default.png";
            } finally {
              setUploadInProgress(false);
            }
          }

          // If the image is already a URL, just return it
          return selectedImage.url;
        }
      )
    );

    return uploadedImageUrls;
  };

  const handleSave = async () => {
    const errorsCopy = { ...errors };

    if (categoryName.trim() === "") {
      errorsCopy.categoryName = true;
    }

    if (
      images.length === 0 ||
      !images.some(
        (img: { id: number; url: string; selected: boolean }) => img.selected
      )
    ) {
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

      const categoryPayload = {
        name: categoryName,
        image:
          uploadedImageUrls && uploadedImageUrls.length > 0
            ? uploadedImageUrls[0]
            : "/ecommerce/categories/default.png",
      };

      console.log("Category Payload:", categoryPayload); // Debugging line

      let categoryResponse: any;
      if (isEdit && id && id !== "new") {
        // Update existing category
        categoryResponse = await updateCategory(id, categoryPayload);
        console.log("Update Category API Response:", categoryResponse);

        if (categoryResponse && categoryResponse.status === 200) {
          // Prepare subcategory payloads with processed images
          const validSubcategories = subcategories.filter(
            (subcategory) => subcategory.name.trim() !== ""
          );

          const subcategoryPayloadsPromises = validSubcategories.map(
            async (subcategory) => {
              // Upload subcategory image if needed
              const subcategoryImageUrls =
                await uploadSubcategoryImages(subcategory);

              return {
                _id: subcategory._id,
                name: subcategory.name,
                categoryId: id,
                image:
                  subcategoryImageUrls && subcategoryImageUrls.length > 0
                    ? subcategoryImageUrls[0]
                    : "/ecommerce/categories/default.png",
              };
            }
          );

          const subcategoryPayloads = await Promise.all(
            subcategoryPayloadsPromises
          );
          console.log("Payload to update subcategories:", subcategoryPayloads);

          if (subcategoryPayloads.length > 0) {
            try {
              const response = await updateSubcategories(subcategoryPayloads);
              console.log("Update Subcategory API Response:", response);
            } catch (error) {
              console.error("Error updating subcategory:", error);
            }
          }

          navigate("/category");
        }
      } else {
        // Create new category
        categoryResponse = await createCategory(categoryPayload);
        console.log("Create Category API Response:", categoryResponse);

        // Check for success in the response
        if (categoryResponse && categoryResponse.status === 200) {
          console.log("New Category ID:", categoryResponse.data.id);

          // Prepare subcategory payloads with processed images
          const validSubcategories = subcategories.filter(
            (subcategory) => subcategory.name.trim() !== ""
          );

          const subcategoryPayloadsPromises = validSubcategories.map(
            async (subcategory) => {
              // Upload subcategory image if needed
              const subcategoryImageUrls =
                await uploadSubcategoryImages(subcategory);

              return {
                name: subcategory.name,
                categoryId: categoryResponse.data.id,
                image:
                  subcategoryImageUrls && subcategoryImageUrls.length > 0
                    ? subcategoryImageUrls[0]
                    : "/ecommerce/categories/default.png",
              };
            }
          );

          const subcategoryPayloads = await Promise.all(
            subcategoryPayloadsPromises
          );
          console.log("Payload to create subcategories:", subcategoryPayloads);

          if (subcategoryPayloads.length > 0) {
            try {
              const response = await createSubCategory(subcategoryPayloads);
              console.log("Create Subcategory API Response:", response);
            } catch (error) {
              console.error("Error creating subcategory:", error);
            }
          }

          navigate("/category");
        } else {
          console.error("Failed to create category:", categoryResponse.message);
          throw new Error(categoryResponse.message);
        }
      }
    } catch (error) {
      console.error("Error during category save operation:", error);
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
    console.log("Category Name Updated:", name); // Debugging line
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
    console.log("Images Updated:", updatedImages); // Debugging line
  };

  const handleSubcategoryChange = (updatedSubcategories: Subcategory[]) => {
    console.log(updateSubcategories, "Subcategories in CategoryDetails"); // Debugging line
    setSubcategories(updatedSubcategories);
    console.log("Subcategories Updated:", updatedSubcategories); // Debugging line
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
          onSubcategoryChange={handleSubcategoryChange}
          isEditMode={isEdit}
          subcategories={subcategories} // Pass the subcategories prop
          // Pass loading state to disable form interaction during loading
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
