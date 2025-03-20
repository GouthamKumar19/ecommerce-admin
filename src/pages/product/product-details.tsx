import  { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "../../components/Product/ProductForm";
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/product";
import type { Product, ProductFormData } from "../../types/product.types";

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [productData, setProductData] = useState<ProductFormData | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      console.log("Fetching product with ID:", id);
      if (id === "new") {
        setProduct(null);
      } else if (id) {
        setLoading(true);
        setError(null);

        try {
          const response = await getProductById(id);
          setProduct(response.data);
          console.log("Fetched product details:", response.data);
        } catch (err: any) {
          setError(err.message || "Failed to fetch product details");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Product ID is not defined");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async () => {
    console.log("Submit action triggered with product data:", productData);
    if (!productData) return;

    try {
      let response;
      if (id === "new") {
        response = await createProduct(productData);
        console.log("Product created successfully:", response.data);
      } else {
        response = await updateProduct({ _id: id, ...productData });
        console.log("Product updated successfully:", response.data);
      }
      navigate("/products");
    } catch (error) {
      console.error("Error adding/updating product:", error);
    }
  };

  const handleCancel = () => {
    console.log("Cancel action triggered");
    navigate(-1);
  };

  const handleDelete = async () => {
    try {
      if (id) {
        await deleteProduct(id);
        console.log("Product deleted successfully");
        navigate("/products");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleFormChange = (newProductData: ProductFormData) => {
    setProductData(newProductData);
  };

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
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <ProductForm
            product={product ?? undefined}
            onChange={handleFormChange}
            onDelete={handleDelete}
          />
        )}
      </Box>

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
        <ActionBox handleSubmit={handleSubmit} handleCancel={handleCancel} />
      </Box>
    </Box>
  );
};

export default ProductDetails;
