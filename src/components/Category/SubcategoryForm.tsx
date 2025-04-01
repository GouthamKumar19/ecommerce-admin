import React, { useState } from "react";
import {
  Typography,
  Grid,
  Box,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import ImageSelection from "../common/ImageSelection";
import DeleteIcon from "@mui/icons-material/Delete";
import { createSubCategory } from "../../api/category"; // Adjust the import path as necessary

// Use the same interface as your CategoryForm
interface ProductImage {
  id: number;
  url: string;
  selected: boolean;
}

interface Subcategory {
  id: number;
  name: string;
  images: ProductImage[];
}

const SubcategoryForm: React.FC = () => {
  const [currentSubcategoryId, setCurrentSubcategoryId] = useState<number>(1);
  const [currentImages, setCurrentImages] = useState<ProductImage[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([
    { id: 1, name: "", images: [] },
  ]);
  const [errors, setErrors] = useState<{ [key: number]: boolean }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touched, setTouched] = useState<{ [key: number]: boolean }>({});

  const updateSubcategoryImages = () => {
    setSubcategories(
      subcategories.map((sc) =>
        sc.id === currentSubcategoryId ? { ...sc, images: currentImages } : sc
      )
    );
  };

  const handleAddSubcategory = () => {
    setIsSubmitted(true);
    updateSubcategoryImages();

    const newId =
      subcategories.length > 0
        ? Math.max(...subcategories.map((sc) => sc.id)) + 1
        : 1;

    setSubcategories([...subcategories, { id: newId, name: "", images: [] }]);
    setCurrentSubcategoryId(newId);
    setCurrentImages([]);
  };

  const handleRemoveSubcategory = (id: number) => {
    if (subcategories.length > 1) {
      setSubcategories(subcategories.filter((sc) => sc.id !== id));

      if (id === currentSubcategoryId) {
        const firstRemainingId =
          subcategories.find((sc) => sc.id !== id)?.id || 1;
        setCurrentSubcategoryId(firstRemainingId);
        setCurrentImages(
          subcategories.find((sc) => sc.id === firstRemainingId)?.images || []
        );
      }
    }
  };

  const handleNameChange = (id: number, name: string) => {
    // Mark this field as touched
    setTouched((prev) => ({ ...prev, [id]: true }));

    const regex = /^[A-Za-z\s]*$/;
    if (!regex.test(name)) {
      setErrors((prev) => ({ ...prev, [id]: true }));
    } else {
      setErrors((prev) => ({ ...prev, [id]: false }));
    }
    setSubcategories(
      subcategories.map((sc) => (sc.id === id ? { ...sc, name } : sc))
    );
  };

  const handleSelectSubcategory = (id: number) => {
    updateSubcategoryImages();
    setCurrentSubcategoryId(id);
    const subcategory = subcategories.find((sc) => sc.id === id);
    setCurrentImages(subcategory?.images || []);
  };

  const validateSubcategories = () => {
    let valid = true;
    const newErrors: { [key: number]: boolean } = {};
    subcategories.forEach((subcategory) => {
      if (
        !subcategory.name ||
        errors[subcategory.id] ||
        !subcategory.images.length
      ) {
        newErrors[subcategory.id] = true;
        valid = false;
      }
    });
    setErrors(newErrors);
    return valid;
  };

  const handleSaveCategory = async () => {
    // Mark all fields as touched when saving
    const allTouched: { [key: number]: boolean } = {};
    subcategories.forEach((sc) => {
      allTouched[sc.id] = true;
    });
    setTouched(allTouched);
    setIsSubmitted(true);

    if (!validateSubcategories()) {
      console.error("All fields are required and must be valid");
      return;
    }

    const payload = subcategories.map((subcategory) => {
      const { name, images } = subcategory;
      const selectedImage = images.find((img) => img.selected)?.url || "";

      return {
        name: name || "Default Subcategory Name", // Provide a default name if undefined
        categoryId: "67cbd3f910f8a7e83ac9e3a0", // Replace with the appropriate category ID
        image: selectedImage,
      };
    });

    console.log("Payload to create subcategories:", payload); // Log the entire payload

    try {
      for (const subcategoryData of payload) {
        const response = await createSubCategory(subcategoryData);
        console.log("Create Subcategory API Response:", response);
      }
    } catch (error) {
      console.error("Error creating subcategory:", error);
    }
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
                handleRemoveSubcategory(subcategory.id);
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
                alignItems: "flex-start", // Align items to the start (left)
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
                // margin="normal"
                error={touched[subcategory.id] && errors[subcategory.id]}
                helperText={
                  touched[subcategory.id] && errors[subcategory.id]
                    ? "Only letters and spaces are allowed"
                    : ""
                }
                // Set the size to small
                style={{ height: "40px", width: "50%" }} // Adjust the width as needed
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
                      setCurrentImages(newImages);
                      setTouched((prev) => ({
                        ...prev,
                        [subcategory.id]: true,
                      }));
                      setSubcategories(
                        subcategories.map((sc) =>
                          sc.id === currentSubcategoryId
                            ? { ...sc, images: newImages as ProductImage[] }
                            : sc
                        )
                      );
                    }}
                    type="collection"
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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleSaveCategory}
          sx={{
            backgroundColor: "#0d7f3f",
            "&:hover": {
              backgroundColor: "#0a6633",
            },
          }}
        >
          Save Category
        </Button>
      </Box>
    </div>
  );
};

export default SubcategoryForm;
