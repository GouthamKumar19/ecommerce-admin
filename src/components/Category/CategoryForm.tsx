import React, { useEffect, useState } from "react";
import { Typography, Grid, Box } from "@mui/material";
import ImageSelection from "../common/ImageSelection";
import SubcategoryForm from "./SubcategoryForm"; // Import the SubcategoryForm component
import { createCategory } from "../../api/category"; // Adjust the import path as necessary

// Define interface matching what ImageSelection expects
interface CollectionForm {
  id: number;
  url: string;
  selected: boolean;
}

const CollectionForm: React.FC = () => {
  const [categoryName, setCollectionName] = useState("");
  const [images, setImages] = useState<CollectionForm[]>([]);

  // useEffect to handle the category creation logic
  useEffect(() => {
    if (categoryName.trim() !== "" || images.length > 0) {
      // Get the selected image URL or use empty string if none selected
      //const selectedImage = images.find((img) => img.selected)?.url || "";

      // Prepare the payload
      const payload = {
        name: categoryName,
        images: "/ecommerce/categories/1.png",
      };

      const handleCreateCategory = async () => {
        console.log("Creating category with data:", payload);
        try {
          const response = await createCategory(payload);
          console.log("Create Category API Response:", response);
          // Handle success logic
        } catch (error) {
          console.error("Error creating category:", error);
          // Handle error logic
        }
      };

      // Call the function to create the category
      handleCreateCategory();
    }
  }, [categoryName, images]); // Dependency array to call when collectionName or images change

  return (
    <div className="ml-8 mr-8 mb-6">
      {/* Fixed Back Button Section */}

      {/* Main Form Content */}
      <div
        className="collection-form-content mb-4 space-y-8 mx-auto overflow-hidden"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }} // Prevent overlap
      >
        <div className="form-group text-left ">
          <Typography variant="subtitle1" gutterBottom align="left">
            CATEGORY NAME
          </Typography>
          <input
            type="text"
            id="collectionName"
            placeholder="Enter Category Name"
            value={categoryName}
            onChange={(e) => setCollectionName(e.target.value)}
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

        <Grid
          container
          spacing={3}
          justifyContent="flex-start"
          style={{ flex: 1 }}
        >
          <Grid item xs={12} style={{ height: "100%" }}>
            <Typography variant="subtitle1" gutterBottom align="left">
              PRODUCT IMAGES
            </Typography>
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: "6px",

                p: 4,
                width: "100%",
              }}
            >
              <ImageSelection images={images} setImages={setImages} />
            </Box>
          </Grid>
        </Grid>

        {/* Include SubcategoryForm here */}
        <SubcategoryForm />
      </div>
    </div>
  );
};

export default CollectionForm;
