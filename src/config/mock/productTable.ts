// mock/ProductData.ts
import { Product } from "../../types/product.types";
import product1 from "/src/assets/Products/product1.png";

export const productMockData: Product[] = [
  {
    _id: "1", // Changed id to _id
    name: "Wireless Noise-Cancelling Headphones",
    description:
      "Premium wireless headphones with active noise cancellation, 30-hour battery life, and comfortable over-ear design.",
    price: 249.99,
    slashedPrice: 199.99, // Changed discountPrice to slashedPrice
    quantity: 45,
    isFeatured: true, // Changed featured to isFeatured
    categoryId: "Audio", // Changed category to categoryId
    subCategoryId: "", // Subcategory ID can be added if needed
    images: [product1], // Array for images
    thumbnailImage: product1, // Optional thumbnail image
    createdAt: "2024-12-10T08:30:00Z",
    updatedAt: "2025-02-15T14:45:00Z",
    status: "in-stock",
    tags: ["wireless", "noise-cancelling", "bluetooth", "premium"],
    rating: 4.8,
    specifications: {
      "Bluetooth Version": "5.0",
      "Battery Life": "30 hours",
      "Charging Time": "3 hours",
      Weight: "254g",
      "Has Microphone": true,
    },
  },
  {
    _id: "2", // Changed id to _id
    name: 'Ultra HD Smart TV 55"',
    description:
      "Crystal clear 4K Ultra HD display with smart functionality, voice control, and minimalist design.",
    price: 799.99,
    slashedPrice: 649.99, // Changed discountPrice to slashedPrice
    quantity: 12,
    isFeatured: true, // Changed featured to isFeatured
    categoryId: "Electronics", // Changed category to categoryId
    subCategoryId: "", // Subcategory ID can be added if needed
    images: [product1], // Array for images
    thumbnailImage: product1, // Optional thumbnail image
    createdAt: "2024-11-05T10:20:00Z",
    updatedAt: "2025-01-20T09:15:00Z",
    status: "in-stock",
    tags: ["4k", "smart tv", "wifi", "hdmi"],
    rating: 4.5,
  },
  {
    _id: "3", // Changed id to _id
    name: "Professional DSLR Camera",
    description:
      "High-performance DSLR with 24.2MP sensor, 4K video recording, and advanced autofocus system.",
    price: 1299.99,
    slashedPrice: 1149.99, // Changed discountPrice to slashedPrice
    quantity: 8,
    isFeatured: false, // Changed featured to isFeatured
    categoryId: "Photography", // Changed category to categoryId
    subCategoryId: "", // Subcategory ID can be added if needed
    images: [product1], // Array for images
    thumbnailImage: product1, // Optional thumbnail image
    createdAt: "2024-10-15T14:30:00Z",
    updatedAt: "2025-02-02T11:10:00Z",
    status: "low-stock",
    tags: ["professional", "camera", "4k", "photography"],
    rating: 4.9,
  },
  {
    _id: "4", // Changed id to _id
    name: "Ergonomic Office Chair",
    description:
      "Adjustable ergonomic office chair with lumbar support, breathable mesh back, and 360° swivel.",
    price: 299.99,
    slashedPrice: 249.99, // Changed discountPrice to slashedPrice
    quantity: 23,
    isFeatured: false, // Changed featured to isFeatured
    categoryId: "Furniture", // Changed category to categoryId
    subCategoryId: "", // Subcategory ID can be added if needed
    images: [product1], // Array for images
    thumbnailImage: product1, // Optional thumbnail image
    createdAt: "2024-09-20T09:45:00Z",
    updatedAt: "2025-01-10T16:30:00Z",
    status: "in-stock",
    tags: ["office", "ergonomic", "chair", "furniture"],
    rating: 4.3,
  },
  {
    _id: "5", // Changed id to _id
    name: "Stainless Steel Smart Watch",
    description:
      "Advanced smartwatch with health monitoring, GPS, water resistance, and 7-day battery life.",
    price: 349.99,
    slashedPrice: 299.99, // Changed discountPrice to slashedPrice
    quantity: 34,
    isFeatured: true, // Changed featured to isFeatured
    categoryId: "Wearables", // Changed category to categoryId
    subCategoryId: "", // Subcategory ID can be added if needed
    images: [product1], // Array for images
    thumbnailImage: product1, // Optional thumbnail image
    createdAt: "2024-12-01T11:15:00Z",
    updatedAt: "2025-02-25T13:40:00Z",
    status: "in-stock",
    tags: ["smartwatch", "fitness", "health", "gps"],
    rating: 4.7,
    specifications: {
      Display: 'AMOLED 1.4"',
      "Water Resistance": "50m",
      "Battery Life": "7 days",
      GPS: true,
      "Heart Rate Monitor": true,
    },
  },
  // ... Continue for other products similarly adjusting their fields to match the new structure
  {
    _id: "6", // Changed id to _id
    name: "Portable Bluetooth Speaker",
    description:
      "Waterproof portable speaker with 360° sound, 20-hour battery life, and built-in microphone.",
    price: 129.99,
    slashedPrice: 99.99, // Changed discountPrice to slashedPrice
    quantity: 56,
    isFeatured: false, // Changed featured to isFeatured
    categoryId: "Audio", // Changed category to categoryId
    subCategoryId: "", // Subcategory ID can be added if needed
    images: [product1], // Array for images
    thumbnailImage: product1, // Optional thumbnail image
    createdAt: "2024-11-15T16:20:00Z",
    updatedAt: "2025-01-05T10:35:00Z",
    status: "in-stock",
    tags: ["speaker", "bluetooth", "waterproof", "portable"],
    rating: 4.4,
  },
  // ... Add remaining products similarly
];

// Note: Make sure to adjust any other products in the array with the same key updates as shown above.