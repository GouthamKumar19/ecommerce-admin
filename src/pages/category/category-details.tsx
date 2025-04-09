import { useState, useEffect, useContext } from "react";
import { Box, CircularProgress } from "@mui/material";
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import CategoryForm from "../../components/Category/CategoryForm";
import { ActionContext } from "../../context/ActionContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  createCategory,
  getCategoryById,
  updateCategory,
  createSubCategory,
  updateSubcategories,
  deleteSubcategories,
} from "../../api/category";
import { getPresignedUrl, uploadFile } from "../../api/collectionImage";
import { Subcategory } from "../../types/category.types";

export const CategoryDetails = () => {
  const { setActionHandlers } = useContext(ActionContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [images, setImages] = useState<
    { id: number; url: string; selected: boolean }[]
  >([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [subcategoryIdsToDelete, setSubcategoryIdsToDelete] = useState<
    string[]
  >([]);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    categoryName: false,
    images: false,
  });
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const previousPath = location.state?.from || "/category";

  useEffect(() => {
    // Check if we're in edit mode and fetch category data
    const fetchCategoryData = async () => {
      if (id && id !== "new") {
        setIsEdit(true);
        setIsLoading(true);

        try {
          const response = await getCategoryById(id);

          if (response && response.status === 200) {
            console.log("API Response:", response);

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
  }, [categoryName, images, isEdit, subcategories, subcategoryIdsToDelete]);

  const uploadPendingImages = async () => {
    const selectedImages = images.filter(
      (img: { id: number; url: string; selected: boolean }) => img.selected
    );
    if (selectedImages.length < 1) {
      return null;
    }

    try {
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
                const formattedFileName = `public/ecommerce/category/${fileName.toLowerCase().replace(/\s+/g, "_")}`;

                // Get presigned URL and upload
                const presignedUrl = await getPresignedUrl(
                  fileName,
                  "category"
                );
                await uploadFile(presignedUrl, imageFile);

                // Return the formatted filename instead of the presigned URL
                return formattedFileName;
              } catch (error) {
                console.error("Error uploading image:", error);
                // Return a default image URL in case of error
                return "/ecommerce/categories/default.png";
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
    } catch (error) {
      console.error("Error in uploadPendingImages:", error);
      return ["/ecommerce/categories/default.png"];
    }
  };

  // Helper function to upload subcategory images
  const uploadSubcategoryImages = async (subcategory: Subcategory) => {
    // Fix: Check if subcategory has images and if there's a selected image
    if (!subcategory.images || subcategory.images.length === 0) {
      return subcategory.image || "/ecommerce/categories/default.png";
    }

    // Find selected image or use the first one
    const selectedImage =
      subcategory.images.find((img) => img.selected) || subcategory.images[0];

    if (!selectedImage) {
      return subcategory.image || "/ecommerce/categories/default.png";
    }

    // If the image is already a URL that's not a data URL, just return it
    if (!selectedImage.url.startsWith("data:image")) {
      return selectedImage.url;
    }

    // Handle data URL images that need to be uploaded
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
      const formattedFileName = `public/ecommerce/subcategory/${fileName.toLowerCase().replace(/\s+/g, "_")}`;

      // Get presigned URL and upload
      const presignedUrl = await getPresignedUrl(fileName, "subcategory");
      await uploadFile(presignedUrl, imageFile);

      return formattedFileName;
    } catch (error) {
      console.error("Error uploading subcategory image:", error);
      return subcategory.image || "/ecommerce/categories/default.png";
    } finally {
      setUploadInProgress(false);
    }
  };

  const handleSave = async () => {
    // Prevent multiple clicks by checking if already loading
    if (isLoading || uploadInProgress) {
      console.log("Save operation already in progress, ignoring click");
      return;
    }

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

    // Set loading state immediately to prevent multiple clicks
    setIsLoading(true);

    try {
      let operationsSuccessful = true;

      // First, handle subcategory deletions if we're in edit mode
      if (isEdit && subcategoryIdsToDelete.length > 0) {
        console.log("Deleting subcategories:", subcategoryIdsToDelete);
        try {
          const deleteResponse = await deleteSubcategories(
            subcategoryIdsToDelete
          );
          console.log("Delete Subcategories API Response:", deleteResponse);

          if (!deleteResponse || deleteResponse.status !== 200) {
            console.error("Failed to delete subcategories");
            operationsSuccessful = false;
          } else {
            // Clear the deletion array after successful deletion
            setSubcategoryIdsToDelete([]);
          }
        } catch (error) {
          console.error("Error deleting subcategories:", error);
          operationsSuccessful = false;
        }
      }

      // Upload images and get the URLs
      const uploadedImageUrls = await uploadPendingImages();

      const categoryPayload = {
        name: categoryName,
        image:
          uploadedImageUrls && uploadedImageUrls.length > 0
            ? uploadedImageUrls[0]
            : "/ecommerce/categories/default.png",
      };

      console.log("Category Payload:", categoryPayload);

      // Process all subcategories first to ensure images are uploaded and urls are captured
      const processedSubcategories = await Promise.all(
        subcategories
          .filter((subcategory) => subcategory.name.trim() !== "")
          .map(async (subcategory) => {
            // Upload and get the image URL
            const imageUrl = await uploadSubcategoryImages(subcategory);

            // Return subcategory with updated image URL
            return {
              ...subcategory,
              image: imageUrl,
            };
          })
      );

      // Log processed subcategories for debugging
      console.log(
        "Processed subcategories with images:",
        processedSubcategories
      );

      let categoryResponse: any;

      if (isEdit && id && id !== "new") {
        // Update existing category
        categoryResponse = await updateCategory(id, categoryPayload);
        console.log("Update Category API Response:", categoryResponse);

        if (categoryResponse && categoryResponse.status === 200) {
          // Separate subcategories into existing ones and new ones
          const existingSubcategories = processedSubcategories.filter(
            (subcategory) => subcategory._id && subcategory._id.trim() !== ""
          );

          const newSubcategories = processedSubcategories.filter(
            (subcategory) => !subcategory._id || subcategory._id.trim() === ""
          );

          // Handle existing subcategories (update)
          if (existingSubcategories.length > 0) {
            const updatePayloads = existingSubcategories.map((subcategory) => ({
              _id: subcategory._id,
              name: subcategory.name,
              categoryId: id,
              image: subcategory.image,
            }));

            console.log("Payload to update subcategories:", updatePayloads);

            try {
              const response = await updateSubcategories(updatePayloads);
              console.log("Update Subcategory API Response:", response);
              if (!response || response.status !== 200) {
                operationsSuccessful = false;
              }
            } catch (error) {
              console.error("Error updating subcategories:", error);
              operationsSuccessful = false;
            }
          }

          // Handle new subcategories (create)
          if (newSubcategories.length > 0) {
            const createPayloads = newSubcategories.map((subcategory) => ({
              name: subcategory.name,
              categoryId: id, // Use the category ID from URL params
              image: subcategory.image,
            }));

            console.log("Payload to create new subcategories:", createPayloads);

            try {
              const response = await createSubCategory(createPayloads);
              console.log("Create New Subcategory API Response:", response);
              if (!response || response.status !== 200) {
                operationsSuccessful = false;
              }
            } catch (error) {
              console.error("Error creating new subcategories:", error);
              operationsSuccessful = false;
            }
          }
        } else {
          operationsSuccessful = false;
        }
      } else {
        // Create new category
        categoryResponse = await createCategory(categoryPayload);
        console.log("Create Category API Response:", categoryResponse);

        // Check for success in the response
        if (categoryResponse && categoryResponse.status === 200) {
          console.log("New Category ID:", categoryResponse.data.id);

          // Create subcategory payloads for API
          const subcategoryPayloads = processedSubcategories.map(
            (subcategory) => ({
              name: subcategory.name,
              categoryId: categoryResponse.data.id,
              image: subcategory.image, // Use the processed image URL
            })
          );

          console.log("Payload to create subcategories:", subcategoryPayloads);

          if (subcategoryPayloads.length > 0) {
            try {
              const response = await createSubCategory(subcategoryPayloads);
              console.log("Create Subcategory API Response:", response);
              // If creation fails, prevent navigation
              if (!response || response.status !== 200) {
                operationsSuccessful = false;
              }
            } catch (error) {
              console.error("Error creating subcategory:", error);
              operationsSuccessful = false;
            }
          }
        } else {
          console.error(
            "Failed to create category:",
            categoryResponse?.message
          );
          operationsSuccessful = false;
        }
      }

      // Only navigate if all operations were successful
      if (operationsSuccessful) {
        console.log("All operations successful. Navigating to:", previousPath);
        navigate(previousPath, { replace: true });
      } else {
        console.error("Some operations failed, not navigating");
      }
    } catch (error) {
      console.error("Error during category save operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("Category form cancelled, navigating to:", previousPath);
    navigate(previousPath);
  };

  // Handlers to update state from form
  const handleNameChange = (name: string, isValid: boolean) => {
    setCategoryName(name);
    setErrors((prev) => ({ ...prev, categoryName: !isValid }));
    console.log("Category Name Updated:", name);
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
    console.log("Images Updated:", updatedImages);
  };

  const handleSubcategoryChange = (updatedSubcategories: Subcategory[]) => {
    // Only update if there's an actual change to prevent infinite loops
    if (
      JSON.stringify(updatedSubcategories) !== JSON.stringify(subcategories)
    ) {
      console.log(
        "Subcategories update received in CategoryDetails:",
        updatedSubcategories
      );
      setSubcategories(updatedSubcategories);
    }
  };

  // Handler for collecting subcategory IDs to delete
  const handleDeleteSubcategories = (subcategoryIds: string[]) => {
    console.log("Collecting subcategory IDs to delete:", subcategoryIds);
    setSubcategoryIdsToDelete((prev) => [...prev, ...subcategoryIds]);
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
          onDeleteSubcategories={handleDeleteSubcategories} // Add this prop
          isEditMode={isEdit}
          subcategories={subcategories}
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
