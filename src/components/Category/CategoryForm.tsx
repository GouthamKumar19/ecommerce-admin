import React, { useEffect, useState, useContext } from "react";
import { Typography, Box } from "@mui/material";
import ImageSelection from "../common/ImageSelection";
import SubcategoryForm from "./SubcategoryForm"; // Import the SubcategoryForm component
import {
  createCategory,
  getCategoryById,
  updateCategory,
} from "../../api/category"; // Now all these functions are properly exported
import { ActionContext } from "../../context/ActionContext";
import { useParams, useLocation } from "react-router-dom";

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

  // Context and routing hooks
  const { setActionHandlers } = useContext(ActionContext);
  const params = useParams();
  const location = useLocation();

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
      onCancel: () => {
        console.log("Category form cancelled");
      },
    });

    return () => {
      setActionHandlers({
        onConfirm: () => console.warn("onConfirm is not implemented"),
        onCancel: () => console.warn("onCancel is not implemented"),
      });
    };
  }, [categoryName, images, isEditMode, setActionHandlers]);

  const handleSaveCategory = async () => {
    if (categoryName.trim() === "") {
      console.error("Category name is required");
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

  return (
    <div className="ml-8 mr-8 mb-6">
      {/* Main Form Content */}
      <div className="space-y-6">
        <div>
          <Typography variant="subtitle1" gutterBottom align="left">
            Name
          </Typography>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category Name"
            className="w-full md:w-2/3 p-2 border rounded-md input-box"
          />
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
            }}
          >
            <ImageSelection images={images} setImages={setImages} />
          </Box>
        </div>

        {/* Subcategory Form */}
        <SubcategoryForm />
      </div>
    </div>
  );
};

export default CategoryForm;
