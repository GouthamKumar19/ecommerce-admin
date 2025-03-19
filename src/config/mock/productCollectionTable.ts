// mock/ProductData.ts
import { Product } from "../../types/product.types";
import product1 from "/src/assets/Products/product1.png";

export const productMockData: Product[] = [
  // @ts-ignore

  {
    id: "1",
    name: "Wireless Noise-Cancelling Headphones",
    description:
      "Premium wireless headphones with active noise cancellation, 30-hour battery life, and comfortable over-ear design.",
    price: 249.99,
    discountPrice: 199.99,
    quantity: 45,
    featured: true,
    imageUrl: product1,
    category: "Audio",
    sku: "WH-1000XM4",
    brand: "SoundMaster",
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
  // @ts-ignore

  {
    id: "2",
    name: 'Ultra HD Smart TV 55"',
    description:
      "Crystal clear 4K Ultra HD display with smart functionality, voice control, and minimalist design.",
    price: 799.99,
    discountPrice: 649.99,
    quantity: 12,
    featured: true,
    imageUrl: product1,
    category: "Electronics",
    sku: "TV-UHD55-2025",
    brand: "VisionTech",
    createdAt: "2024-11-05T10:20:00Z",
    updatedAt: "2025-01-20T09:15:00Z",
    status: "in-stock",
    tags: ["4k", "smart tv", "wifi", "hdmi"],
    rating: 4.5,
  },
  // @ts-ignore

  {
    id: "3",
    name: "Professional DSLR Camera",
    description:
      "High-performance DSLR with 24.2MP sensor, 4K video recording, and advanced autofocus system.",
    price: 1299.99,
    discountPrice: 1149.99,
    quantity: 8,
    featured: false,
    imageUrl: product1,
    category: "Photography",
    sku: "CAM-D7500",
    brand: "PhotoPro",
    createdAt: "2024-10-15T14:30:00Z",
    updatedAt: "2025-02-02T11:10:00Z",
    status: "low-stock",
    tags: ["professional", "camera", "4k", "photography"],
    rating: 4.9,
  },
];
