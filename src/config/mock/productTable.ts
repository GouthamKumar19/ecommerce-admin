import { Product } from "../../types/product.types";
import product1 from "/src/assets/Products/product1.png";

export const productMockData: Product[] = [
  {
    _id: "6512c5f3e4b09a12d8f42b80",
    name: "Wireless Headphones",
    description:
      "High-quality noise-canceling wireless headphones with 30-hour battery life.",
    price: 199.99,
    slashedPrice: 249.99,
    quantity: 45,
    isFeatured: true ,
    categoryId: "60c72b2f9b1e8a3d4c8f1234",
    subCategoryId: "60c72b2f9b1e8a3d4c8f5678",
    images: [product1, product1, product1],
    thumbnailImage: product1,
    createdAt: "2024-03-04T12:30:00Z",
    updatedAt: "2024-03-04T14:50:00Z",
  },
  {
    _id: "6512c5f3e4b09a12d8f42b81",
    name: "Bluetooth Speaker",
    description:
      "Portable Bluetooth speaker with deep bass, waterproof design, and 20-hour battery life.",
    price: 149.99,
    slashedPrice: 179.99,
    quantity: 30,
    isFeatured: false,
    categoryId: "60c72b2f9b1e8a3d4c8f5678",
    subCategoryId: "60c72b2f9b1e8a3d4c8f9101",
    images: [
      "/ecommerce/products/speaker1.png",
      "/ecommerce/products/speaker2.png",
      "/ecommerce/products/speaker3.png",
      "/ecommerce/products/speaker4.png",
    ],
    thumbnailImage: "/ecommerce/products/thumbnail/speaker.png",
    createdAt: "2024-05-10T09:20:00Z",
    updatedAt: "2024-05-10T11:40:00Z",
  },
];

export const mockProductsApiResponse = {
  status: 200,
  message: "Success",
  data: {
    totalCount: productMockData.length,
    tableData: productMockData,
  },
};
