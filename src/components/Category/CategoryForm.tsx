import React, { useEffect, useState, useContext } from "react";
import { Typography, Box, TextField } from "@mui/material";
import ImageSelection from "../common/ImageSelection";
import SubcategoryForm from "./SubcategoryForm";
import {
  createCategory,
  getCategoryById,
  updateCategory,
} from "../../api/category";
import { ActionContext } from "../../context/ActionContext";
import { useParams, useLocation, useNavigate } from "react-router-dom";

// Define interface matching what ImageSelection expects
interface CategoryImage {
  id: number;
  url: string;
  selected: boolean;
}

const CategoryForm: React.FC = () => {
  const [categoryName, setCategoryName] = useState("");
  const [images, setImages] = useState<CategoryImage[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    categoryName: false,
    images: false,
  });

  // Context and routing hooks
  const { setActionHandlers } = useContext(ActionContext);
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're in edit mode and load data if needed
  useEffect(() => {
    const fetchCategoryData = async () => {
      const id = params.id;
      if (id && id !== "new") {
        setIsLoading(true);
        setIsEditMode(true);
        setCategoryId(id);

        console.log("id", isLoading);

        try {
          // You would fetch category data here
          const response = await getCategoryById(id);
          if (response && response.data) {
            setCategoryName(response.data.name || "");
            // Set images if available in the response
          }
        } catch (error) {
          console.error("Error fetching category:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (location.state?.category) {
        // Handle data passed via location state
        const category = location.state.category;
        setIsEditMode(true);
        setCategoryId(String(category.id || category._id));
        setCategoryName(category.name || "");
        // Set images if available
      }
    };

    fetchCategoryData();
  }, [params.id, location.state]);

  // Set up action handlers for the parent component
  useEffect(() => {
    setActionHandlers({
      onConfirm: handleSaveCategory,
      onCancel: handleCancel,
    });

    return () => {
      setActionHandlers({
        onConfirm: () => console.warn("onConfirm is not implemented"),
        onCancel: () => console.warn("onCancel is not implemented"),
      });
    };
  }, [categoryName, images, isEditMode, setActionHandlers]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const regex = /^[A-Za-z\s]+$/;

    if (!regex.test(value)) {
      setErrors((prev) => ({ ...prev, categoryName: true }));
    } else {
      setErrors((prev) => ({ ...prev, categoryName: false }));
    }
    setCategoryName(value);
  };

  const handleSaveCategory = async () => {
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

    // Get the selected image URL or use empty string if none selected
    const selectedImage =
      images.find((img) => img.selected)?.url || "/ecommerce/categories/1.png";

    // Prepare the payload
    const payload = {
      name: categoryName,
      images: selectedImage,
    };

    try {
      let response;
      if (isEditMode && categoryId) {
        // Update existing category
        response = await updateCategory(categoryId, payload);
        console.log("Update Category API Response:", response);
      } else {
        // Create new category
        response = await createCategory(payload);
        console.log("Create Category API Response:", response);
      }
      // Success would be handled by the parent component
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} category:`,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("Category form cancelled");
    navigate("/categories"); // Redirect to categories page or any other route
  };

  return (
    <div className="ml-8 mr-8 mb-6">
      {/* Main Form Content */}
      <div className="space-y-6">
        <div>
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
              id="categoryName"
              value={categoryName}
              onChange={handleNameChange}
              placeholder="Category Name"
              variant="outlined"
              //margin="normal"
              error={errors.categoryName}
              helperText={
                errors.categoryName ? "Only letters and spaces are allowed" : ""
              }
              size="small" // Set the size to small
              style={{ width: "50%" }} // Adjust the width as needed
            />
          </Box>
        </div>

        <div>
          <Typography variant="subtitle1" gutterBottom align="left">
            Banner Image
          </Typography>
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: "6px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              p: 4,
              width: "100%",
              borderColor: errors.images ? "red" : "inherit", // Add red border if there's an error
              borderWidth: errors.images ? "2px" : "1px",
            }}
          >
            <ImageSelection images={images} setImages={setImages} />
            {errors.images && (
              <Typography variant="body2" color="error">
                At least one image must be selected
              </Typography>
            )}
          </Box>
        </div>

        {/* Subcategory Form */}
        <SubcategoryForm />
      </div>
    </div>
  );
};

export default CategoryForm;
