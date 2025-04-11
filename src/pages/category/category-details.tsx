import { useState, useEffect, useContext } from "react";
import { Box, CircularProgress, Snackbar, Alert } from "@mui/material";
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
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const previousPath = location.state?.from || "/category";

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (id && id !== "new") {
        setIsEdit(true);
        setIsLoading(true);

        try {
          const response = await getCategoryById(id);

          if (response && response.status === 200) {
            setCategoryName(response.data.name || "");

            if (response.data.image) {
              setImages([{ id: 1, url: response.data.image, selected: true }]);
            }

            if (
              response.data.subcategories &&
              response.data.subcategories.length > 0
            ) {
              const formattedSubcategories = response.data.subcategories.map(
                (subcategory: any, index: number) => ({
                  id: index + 1,
                  _id: subcategory._id || "",
                  name: subcategory.name || "",
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

              setSubcategories(formattedSubcategories);
            } else {
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
            throw new Error("Invalid response format");
          }
        } catch (error) {
          console.log(error)
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
    setActionHandlers({
      onConfirm: handleSave,
      onCancel: handleCancel,
    });

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
                const response = await fetch(selectedImage.url);
                const blob = await response.blob();

                const fileName = `category_image_${Date.now()}.jpg`;
                const imageFile = new File([blob], fileName, {
                  type: "image/jpeg",
                });

                const formattedFileName = `public/ecommerce/category/${fileName
                  .toLowerCase()
                  .replace(/\s+/g, "_")}`;

                const presignedUrl = await getPresignedUrl(
                  fileName,
                  "category"
                );
                await uploadFile(presignedUrl, imageFile);

                return formattedFileName;
              } catch {
                return "/ecommerce/categories/default.png";
              } finally {
                setUploadInProgress(false);
              }
            }

            return selectedImage.url;
          }
        )
      );

      return uploadedImageUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      return ["/ecommerce/categories/default.png"];
    }
  };

  const handleSave = async () => {
    if (isLoading || uploadInProgress) {
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

    const hasValidSubcategories = subcategories.some(
      (subcategory) => subcategory.name.trim() !== ""
    );

    if (!hasValidSubcategories) {
      setSnackbarOpen(true); // Open Snackbar
      return;
    }

    setErrors(errorsCopy);

    if (errorsCopy.categoryName || errorsCopy.images) {
      return;
    }

    setIsLoading(true);

    try {
    

      let operationsSuccessful = true;

      if (isEdit && subcategoryIdsToDelete.length > 0) {
        const deleteResponse = await deleteSubcategories(
          subcategoryIdsToDelete
        );

        if (!deleteResponse || deleteResponse.status !== 200) {
          operationsSuccessful = false;
        } else {
          setSubcategoryIdsToDelete([]);
        }
      }

      const uploadedImageUrls = await uploadPendingImages();

      const categoryPayload = {
        name: categoryName,
        image:
          uploadedImageUrls && uploadedImageUrls.length > 0
            ? uploadedImageUrls[0]
            : "/ecommerce/categories/default.png",
      };

      const processedSubcategories = await Promise.all(
        subcategories
          .filter((subcategory) => subcategory.name.trim() !== "")
          .map(async (subcategory) => {
            const imageUrl = await uploadPendingImages();
            return {
              ...subcategory,
              image: imageUrl ? imageUrl[0] : subcategory.image,
            };
          })
      );

      let categoryResponse: any;

      if (isEdit && id && id !== "new") {
        categoryResponse = await updateCategory(id, categoryPayload);

        if (categoryResponse && categoryResponse.status === 200) {
          const existingSubcategories = processedSubcategories.filter(
            (subcategory) => subcategory._id && subcategory._id.trim() !== ""
          );

          const newSubcategories = processedSubcategories.filter(
            (subcategory) => !subcategory._id || subcategory._id.trim() === ""
          );

          if (existingSubcategories.length > 0) {
            const updatePayloads = existingSubcategories.map((subcategory) => ({
              _id: subcategory._id,
              name: subcategory.name,
              categoryId: id,
              image: subcategory.image,
            }));

            const response = await updateSubcategories(updatePayloads);

            if (!response || response.status !== 200) {
              operationsSuccessful = false;
            }
          }

          if (newSubcategories.length > 0) {
            const createPayloads = newSubcategories.map((subcategory) => ({
              name: subcategory.name,
              categoryId: id,
              image: subcategory.image,
            }));

            const response = await createSubCategory(createPayloads);

            if (!response || response.status !== 200) {
              operationsSuccessful = false;
            }
          }
        } else {
          operationsSuccessful = false;
        }
      } else {
        categoryResponse = await createCategory(categoryPayload);

        if (categoryResponse && categoryResponse.status === 200) {
          const subcategoryPayloads = processedSubcategories.map(
            (subcategory) => ({
              name: subcategory.name,
              categoryId: categoryResponse.data.id,
              image: subcategory.image,
            })
          );

          if (subcategoryPayloads.length > 0) {
            const response = await createSubCategory(subcategoryPayloads);

            if (!response || response.status !== 200) {
              operationsSuccessful = false;
            }
          }

          // Update table immediately by dispatching the event
          if (typeof window !== "undefined" && window.dispatchEvent) {
            window.dispatchEvent(
              new CustomEvent("categoryAdded", {
                detail: categoryResponse.data,
              })
            );
          }
        } else {
          operationsSuccessful = false;
        }
      }

      if (!operationsSuccessful) {
        console.error("Some operations failed.");
      } else {
        // Navigate back to the category list only after the operation is successful
        navigate(previousPath, { replace: true });
      }
    } catch (error) {
      console.error("Error during category save operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(previousPath);
  };

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

  const handleSubcategoryChange = (updatedSubcategories: Subcategory[]) => {
    if (
      JSON.stringify(updatedSubcategories) !== JSON.stringify(subcategories)
    ) {
      setSubcategories(updatedSubcategories);
    }
  };

  const handleDeleteSubcategories = (subcategoryIds: string[]) => {
    setSubcategoryIdsToDelete((prev) => [...prev, ...subcategoryIds]);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
        <CategoryForm
          categoryName={categoryName}
          images={images}
          errors={errors}
          onNameChange={handleNameChange}
          onImagesChange={handleImagesChange}
          onSubcategoryChange={handleSubcategoryChange}
          onDeleteSubcategories={handleDeleteSubcategories}
          isEditMode={isEdit}
          subcategories={subcategories}
        />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          You must add at least one subcategory.
        </Alert>
      </Snackbar>

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