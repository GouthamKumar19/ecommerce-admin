import React, { useState } from "react";
import { Typography, Grid, Box, Button, IconButton } from "@mui/material";
import ImageSelection from "../common/ImageSelection";
import DeleteIcon from "@mui/icons-material/Delete";

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
  // Instead of a single images state, we'll track current subcategory images
  const [currentSubcategoryId, setCurrentSubcategoryId] = useState<number>(1);
  const [currentImages, setCurrentImages] = useState<ProductImage[]>([]);

  const [subcategories, setSubcategories] = useState<Subcategory[]>([
    { id: 1, name: "", images: [] },
  ]);

  // Update subcategory images when current images change
  const updateSubcategoryImages = () => {
    setSubcategories(
      subcategories.map((sc) =>
        sc.id === currentSubcategoryId ? { ...sc, images: currentImages } : sc
      )
    );
  };

  // Handle adding a new subcategory
  const handleAddSubcategory = () => {
    // Save current images to the current subcategory first
    updateSubcategoryImages();

    const newId =
      subcategories.length > 0
        ? Math.max(...subcategories.map((sc) => sc.id)) + 1
        : 1;

    // Add the new subcategory with empty images
    setSubcategories([...subcategories, { id: newId, name: "", images: [] }]);

    // Set the current subcategory to the new one and reset images
    setCurrentSubcategoryId(newId);
    setCurrentImages([]);
  };

  // Handle removing a subcategory
  const handleRemoveSubcategory = (id: number) => {
    if (subcategories.length > 1) {
      setSubcategories(subcategories.filter((sc) => sc.id !== id));

      // If we're removing the current subcategory, switch to the first remaining one
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

  // Handle changing subcategory name
  const handleNameChange = (id: number, name: string) => {
    setSubcategories(
      subcategories.map((sc) => (sc.id === id ? { ...sc, name } : sc))
    );
  };

  // Handle selecting a subcategory to edit
  const handleSelectSubcategory = (id: number) => {
    // Save current images to the current subcategory first
    updateSubcategoryImages();

    // Switch to the selected subcategory
    setCurrentSubcategoryId(id);

    // Load the selected subcategory's images
    const subcategory = subcategories.find((sc) => sc.id === id);
    setCurrentImages(subcategory?.images || []);
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

          <div className="form-group text-left">
            <Typography variant="subtitle1" gutterBottom align="left">
              SUBCATEGORY NAME
            </Typography>
            <input
              type="text"
              placeholder="Enter SubCategory Name"
              value={subcategory.name}
              onChange={(e) => handleNameChange(subcategory.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                padding: "12px",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginBottom: "16px",
              }}
            />
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
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ImageSelection
                    images={currentImages}
                    setImages={(newImages) => {
                      setCurrentImages(newImages);
                      // Also update the subcategory immediately
                      setSubcategories(
                        subcategories.map((sc) => sc.id === currentSubcategoryId ? { ...sc, images: newImages as ProductImage[] } : sc)
                      );
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      ))}
    </div>
  );
};

export default SubcategoryForm;
