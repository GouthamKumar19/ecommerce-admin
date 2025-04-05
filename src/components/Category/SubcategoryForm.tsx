import React, { useState, useEffect } from "react";
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
import { Subcategory } from "../../types/category.types";

interface ProductImage {
  id: number;
  url: string;
  selected: boolean;
}

// Make sure the Subcategory type allows for ProductImage[] in the images field
// If you can't modify the original type, create a local interface that extends it
interface SubcategoryWithImages extends Omit<Subcategory, "images"> {
  images: ProductImage[];
}

interface SubcategoryFormProps {
  categoryName: string;
  categoryImages: ProductImage[];
  onSaveSuccess: () => void;
  onSubcategoryChange: (updatedSubcategories: Subcategory[]) => void;
  subcategories: Subcategory[]; // Add subcategories prop
}

const SubcategoryForm: React.FC<SubcategoryFormProps> = ({
  
  onSaveSuccess,
  onSubcategoryChange,
  subcategories: initialSubcategories, // Add subcategories prop
}) => {
  const [currentSubcategoryId, setCurrentSubcategoryId] = useState<number>(1);
  const [currentImages, setCurrentImages] = useState<ProductImage[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryWithImages[]>(
    initialSubcategories.map((subcategory, index) => ({
      ...subcategory,
      id: index + 1,
      images: subcategory.images.map((image, idx) => ({
        id: idx + 1,
        url: image.url,
        selected: image.selected,
      })), // Map images to the expected format
    }))
  );
  const [errors, setErrors] = useState<{ [key: number]: boolean }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touched, setTouched] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    console.log(initialSubcategories, "INIIIL SUBCATEGORIES");
    // Set initial subcategory images
    const initialCurrentSubcategory = subcategories.find(
      (sc) => sc.id === currentSubcategoryId
    );
    setCurrentImages(initialCurrentSubcategory?.images || []);
  }, [subcategories, currentSubcategoryId]);

  // Helper function to extract proper path from image URL or return empty string
  const getProperImagePath = (url: string): string => {
    console.log(url, "URL IN GET PROPER IMAGE PATH");
    // If the URL already has the correct format, return it
    if (url.startsWith("/public/ecommerce/category/")) {
      return url;
    }

    // Extract the filename from the URL if possible
    const parts = url.split("/");
    const filename = parts[parts.length - 1];

    // Generate a timestamp-based filename if needed
    const timestamp = Date.now();
    const newFilename = filename || `category_image_${timestamp}.jpg`;

    // Return the properly formatted path
    return `/public/ecommerce/category/${newFilename}`;
  };

  const updateSubcategoryImages = () => {
    setSubcategories((prevSubcategories) =>
      prevSubcategories.map((sc) =>
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

    const newSubcategories = [
      ...subcategories,
      {
        id: newId,
        name: "",
        images: [],
        _id: "",
        image: "",
        createdAt: "",
        updatedAt: "",
      },
    ];

    setSubcategories(newSubcategories);
    setCurrentSubcategoryId(newId);
    setCurrentImages([]);
    onSubcategoryChange(convertToSubcategories(newSubcategories));
  };

  // Helper function to convert SubcategoryWithImages to Subcategory
  const convertToSubcategories = (
    items: SubcategoryWithImages[]
  ): Subcategory[] => {
    return items.map((item) => {
      // Extract the images array
      const { images, ...rest } = item;

      // Set the main image to the first selected image URL (properly formatted) or empty string
      const mainImage =
        images.length > 0 ? getProperImagePath(images[0].url) : "";

      // Create a new object with the Subcategory shape
      const subcategory: Subcategory = {
        ...rest,
        // Set the single image property to the main image
        image: mainImage,
        // Convert the images array to the format expected by the Subcategory type
        images: images.map((image) => ({
          id: image.id,
          url: getProperImagePath(image.url),
          selected: image.selected,
        })),
      };
      return subcategory;
    });
  };

  const handleRemoveSubcategory = (id: number) => {
    if (subcategories.length > 1) {
      const newSubcategories = subcategories.filter((sc) => sc.id !== id);

      setSubcategories(newSubcategories);

      if (id === currentSubcategoryId) {
        const firstRemainingId = newSubcategories[0].id;
        setCurrentSubcategoryId(firstRemainingId);
        setCurrentImages(newSubcategories[0].images);
      }

      onSubcategoryChange(convertToSubcategories(newSubcategories));
    }
  };

  const handleNameChange = (id: number, name: string) => {
    setTouched((prev) => ({ ...prev, [id]: true }));

    const regex = /^[A-Za-z\s]*$/;
    if (!regex.test(name)) {
      setErrors((prev) => ({ ...prev, [id]: true }));
    } else {
      setErrors((prev) => ({ ...prev, [id]: false }));
    }

    const newSubcategories = subcategories.map((sc) =>
      sc.id === id ? { ...sc, name } : sc
    );
    console.log(subcategories, "SUBCATEGORIES IN NAME CHANGE");
    setSubcategories(newSubcategories);
    onSubcategoryChange(convertToSubcategories(newSubcategories));
    console.log(`Subcategory ID ${id} Name:`, name); // Debugging line
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

    onSaveSuccess();
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
                      const imagesList = newImages as ProductImage[];
                      setCurrentImages(imagesList);
                      setTouched((prev) => ({
                        ...prev,
                        [subcategory.id]: true,
                      }));

                      // Get the proper formatted path for the main image
                      const mainImagePath =
                        imagesList.length > 0
                          ? getProperImagePath(imagesList[0].url)
                          : "";

                      const newSubcategories = subcategories.map((sc) =>
                        sc.id === currentSubcategoryId
                          ? {
                              ...sc,
                              images: imagesList,
                              image: mainImagePath,
                            }
                          : sc
                      );
                      setSubcategories(newSubcategories);
                      onSubcategoryChange(
                        convertToSubcategories(newSubcategories)
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
