import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Grid,
  Box,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ImageSelection from "../common/ImageSelection";
import DeleteIcon from "@mui/icons-material/Delete";
import { Subcategory } from "../../types/category.types";

interface ProductImage {
  id: number;
  url: string;
  selected: boolean;
}

// Make sure the Subcategory type allows for ProductImage[] in the images field
interface SubcategoryWithImages extends Omit<Subcategory, "images"> {
  images: ProductImage[];
}

interface SubcategoryFormProps {
  categoryName: string;
  categoryImages: ProductImage[];
  onSaveSuccess: () => void;
  onSubcategoryChange: (updatedSubcategories: Subcategory[]) => void;
  subcategories: Subcategory[];
  onDeleteSubcategories: (subcategoryIds: string[]) => void;
}

const SubcategoryForm: React.FC<SubcategoryFormProps> = ({
  onSubcategoryChange,
  subcategories: initialSubcategories,
  onDeleteSubcategories,
}) => {
  // Initialize subcategories state only once on mount
  const [subcategories, setSubcategories] = useState<SubcategoryWithImages[]>(
    () =>
      initialSubcategories.map((subcategory, index) => {
        // Create properly formatted images array
        const formattedImages =
          subcategory.images && subcategory.images.length > 0
            ? subcategory.images.map((image: any, idx: number) => ({
                id: idx + 1,
                url: typeof image === "string" ? image : image.url || "",
                selected:
                  typeof image === "string" ? true : image.selected || false,
              }))
            : [];

        // Find selected image or use the first one
        const selectedImage =
          formattedImages.find((img) => img.selected) || formattedImages[0];

        return {
          ...subcategory,
          id: index + 1,
          images: formattedImages,
          // Make sure image is set from the selected image in the images array
          image: selectedImage ? selectedImage.url : subcategory.image,
        };
      })
  );

  const [currentSubcategoryId, setCurrentSubcategoryId] = useState<number>(
    () => (subcategories.length > 0 ? subcategories[0].id : 1)
  );

  const [currentImages, setCurrentImages] = useState<ProductImage[]>(() => {
    const currentSubcategory = subcategories.find(
      (sc) => sc.id === (subcategories.length > 0 ? subcategories[0].id : 1)
    );
    return currentSubcategory?.images || [];
  });

  const [errors, setErrors] = useState<{ [key: number]: boolean }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touched, setTouched] = useState<{ [key: number]: boolean }>({});
  const [skipImageEffect, setSkipImageEffect] = useState(true);
  const [skipSubcategoryEffect, setSkipSubcategoryEffect] = useState(true);

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<{
    id: number;
    _id: string;
  } | null>(null);
  const [subcategoryIdsToDelete, setSubcategoryIdsToDelete] = useState<
    string[]
  >([]);

  // Helper function to convert SubcategoryWithImages to Subcategory
  const convertToSubcategories = useCallback(
    (items: SubcategoryWithImages[]): Subcategory[] => {
      return items.map((item) => {
        // Find selected image or use the first one
        const selectedImage =
          item.images.find((img) => img.selected) || item.images[0];
        const mainImage = selectedImage ? selectedImage.url : item.image;

        return {
          ...item,
          // Make sure image is set from the selected image
          image: mainImage,
        };
      });
    },
    []
  );

  // Update current images when active subcategory changes
  // This effect should only run when the current subcategory ID changes
  useEffect(() => {
    const currentSubcategory = subcategories.find(
      (sc) => sc.id === currentSubcategoryId
    );
    if (currentSubcategory) {
      setCurrentImages(currentSubcategory.images || []);
    }
  }, [currentSubcategoryId]);

  // Only notify parent when subcategories change (not on first render)
  useEffect(() => {
    if (skipSubcategoryEffect) {
      setSkipSubcategoryEffect(false);
      return;
    }

    if (subcategories.length > 0) {
      onSubcategoryChange(convertToSubcategories(subcategories));
    }
  }, [
    subcategories,
    onSubcategoryChange,
    convertToSubcategories,
    skipSubcategoryEffect,
  ]);

  // Update subcategory images when currentImages changes (not on first render)
  useEffect(() => {
    if (skipImageEffect) {
      setSkipImageEffect(false);
      return;
    }

    if (currentImages.length > 0) {
      setSubcategories((prevSubcategories) =>
        prevSubcategories.map((sc) => {
          if (sc.id === currentSubcategoryId) {
            // Find the selected image or use the first one
            const selectedImage =
              currentImages.find((img) => img.selected) || currentImages[0];
            return {
              ...sc,
              images: currentImages,
              // Make sure to set the image property to the selected image URL
              image: selectedImage ? selectedImage.url : sc.image,
            };
          }
          return sc;
        })
      );
    }
  }, [currentImages, currentSubcategoryId]);

  // Process deletion of subcategories when the array is updated
  useEffect(() => {
    if (subcategoryIdsToDelete.length > 0) {
      // Call the parent function to handle deletion in the API
      onDeleteSubcategories(subcategoryIdsToDelete);

      // Reset the array after processing
      setSubcategoryIdsToDelete([]);
    }
  }, [subcategoryIdsToDelete, onDeleteSubcategories]);

  const handleAddSubcategory = () => {
    // Create new subcategory
    const newId =
      subcategories.length > 0
        ? Math.max(...subcategories.map((sc) => sc.id)) + 1
        : 1;

    const newSubcategory = {
      id: newId,
      name: "",
      images: [],
      _id: "",
      image: "",
      createdAt: "",
      updatedAt: "",
    };

    const newSubcategories = [...subcategories, newSubcategory];

    setSubcategories(newSubcategories);
    setCurrentSubcategoryId(newId);
    setCurrentImages([]);
    setIsSubmitted(true);
  };

  const handleOpenDeleteDialog = (id: number, _id: string) => {
    setSubcategoryToDelete({ id, _id });
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSubcategoryToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (subcategoryToDelete) {
      // Only add to deletion array if it has a valid _id (exists in the database)
      if (subcategoryToDelete._id) {
        setSubcategoryIdsToDelete((prev) => [...prev, subcategoryToDelete._id]);
      }

      // Remove from UI
      if (subcategories.length > 1) {
        const newSubcategories = subcategories.filter(
          (sc) => sc.id !== subcategoryToDelete.id
        );
        setSubcategories(newSubcategories);

        // Update currentSubcategoryId if needed
        if (subcategoryToDelete.id === currentSubcategoryId) {
          const firstRemainingId = newSubcategories[0].id;
          setCurrentSubcategoryId(firstRemainingId);
        }
      }
    }

    handleCloseDeleteDialog();
  };

  const handleNameChange = (id: number, name: string) => {
    setTouched((prev) => ({ ...prev, [id]: true }));

    const regex = /^[A-Za-z\s]*$/;
    if (!regex.test(name)) {
      setErrors((prev) => ({ ...prev, [id]: true }));
    } else {
      setErrors((prev) => ({ ...prev, [id]: false }));
    }

    setSubcategories((prevSubcategories) =>
      prevSubcategories.map((sc) => (sc.id === id ? { ...sc, name } : sc))
    );
  };

  const handleSelectSubcategory = (id: number) => {
    setCurrentSubcategoryId(id);
  };

  return (
    <div className="subcategories-container">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Subcategories</Typography>
        <Button
          variant="contained"
          onClick={handleAddSubcategory}
          sx={{
            backgroundColor: "#0d7f3f",
            "&:hover": {
              backgroundColor: "#0a6633",
            },
          }}
        >
          Add Subcategory
        </Button>
      </Box>

      {subcategories.map((subcategory) => (
        <Box
          key={subcategory.id}
          sx={{
            mb: 4,
            p: 3,
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            position: "relative",
            borderColor:
              currentSubcategoryId === subcategory.id ? "#0d7f3f" : "#e0e0e0",
          }}
          onClick={() => handleSelectSubcategory(subcategory.id)}
        >
          {subcategories.length > 1 && (
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDeleteDialog(subcategory.id, subcategory._id);
              }}
              sx={{ position: "absolute", top: 10, right: 10 }}
            >
              <DeleteIcon />
            </IconButton>
          )}

          <div className="mb-4">
            <Typography variant="subtitle1" gutterBottom align="left">
              Name
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <TextField
                id={`subcategoryName-${subcategory.id}`}
                size="small"
                value={subcategory.name}
                variant="outlined"
                onChange={(e) =>
                  handleNameChange(subcategory.id, e.target.value)
                }
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, [subcategory.id]: true }))
                }
                placeholder="Subcategory Name"
                error={touched[subcategory.id] && errors[subcategory.id]}
                helperText={
                  touched[subcategory.id] && errors[subcategory.id]
                    ? "Only letters and spaces are allowed"
                    : ""
                }
                style={{ height: "40px", width: "50%" }}
              />
            </Box>
          </div>

          {currentSubcategoryId === subcategory.id && (
            <Grid
              container
              spacing={3}
              justifyContent="flex-start"
              style={{ flex: 1 }}
            >
              <Grid item xs={12} style={{ height: "100%" }}>
                <Typography variant="subtitle1" gutterBottom align="left">
                  Subcategory Images
                </Typography>
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: "6px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    p: 4,
                    width: "100%",
                    borderColor:
                      isSubmitted &&
                      touched[subcategory.id] &&
                      !subcategory.images.length
                        ? "red"
                        : "inherit",
                    borderWidth:
                      isSubmitted &&
                      touched[subcategory.id] &&
                      !subcategory.images.length
                        ? "2px"
                        : "1px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ImageSelection
                    images={currentImages}
                    setImages={(newImages) => {
                      const imagesList =
                        typeof newImages === "function"
                          ? newImages(currentImages)
                          : (newImages as ProductImage[]);

                      setCurrentImages(imagesList);
                      setTouched((prev) => ({
                        ...prev,
                        [subcategory.id]: true,
                      }));
                    }}
                    type="subcategory"
                  />
                  {isSubmitted &&
                    touched[subcategory.id] &&
                    !subcategory.images.length && (
                      <Typography variant="body2" color="error">
                        At least one image must be selected
                      </Typography>
                    )}
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      ))}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Subcategory"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this subcategory? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SubcategoryForm;
