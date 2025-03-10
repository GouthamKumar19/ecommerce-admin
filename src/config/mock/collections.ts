// config/mock/collectionData.ts
import { Collection } from "../../types/collections.types";
import product1 from "/src/assets/collection/summer.jpg";

export const collectionMockData: Collection[] = [
  {
    id: "1",
    name: "Summer Collection",
    description: "The latest summer fashion trends with breathable fabrics and vibrant colors.",
    imageUrl: product1,
    status: "active",
    createdAt: "2024-12-15T08:30:00Z",
    updatedAt: "2025-02-10T14:45:00Z",
    featured: true,
    startDate: "2025-03-01T00:00:00Z",
    endDate: "2025-08-31T23:59:59Z",
    position: 1,
    products: ["1", "5", "6", "9"],
    tags: ["summer", "seasonal", "featured"],
    seoTitle: "Summer Collection 2025 | Latest Trends",
    seoDescription: "Discover our Summer 2025 Collection featuring the latest trends in summer fashion.",
    seoKeywords: ["summer fashion", "summer collection", "2025 fashion", "seasonal clothing"]
  },
  {
    id: "2",
    name: "Winter Essentials",
    description: "Stay warm with our carefully curated winter essentials collection.",
    imageUrl: product1,
    status: "active",
    createdAt: "2024-11-10T10:15:00Z",
    updatedAt: "2025-01-15T09:30:00Z",
    featured: true,
    startDate: "2025-01-01T00:00:00Z",
    endDate: "2025-03-15T23:59:59Z",
    position: 2,
    products: ["2", "7", "10", "12"],
    tags: ["winter", "seasonal", "featured"],
    seoTitle: "Winter Essentials 2025 | Stay Warm in Style",
    seoDescription: "Explore our Winter Essentials collection to stay warm without compromising on style."
  },
  {
    id: "3",
    name: "Tech Gadgets",
    description: "Cutting-edge technology and innovative gadgets for modern living.",
    imageUrl: product1,
    status: "active",
    createdAt: "2024-10-25T14:20:00Z",
    updatedAt: "2025-02-05T11:40:00Z",
    featured: false,
    position: 3,
    products: ["1", "2", "5", "7", "9", "10"],
    tags: ["tech", "gadgets", "electronics"]
  },
  {
    id: "4",
    name: "Home Essentials",
    description: "Everything you need to make your house a home.",
    imageUrl: product1,
    status: "draft",
    createdAt: "2024-12-05T09:45:00Z",
    updatedAt: "2025-01-20T15:30:00Z",
    featured: false,
    position: 4,
    products: ["4", "8"],
    tags: ["home", "furniture", "essentials"]
  },
  {
    id: "5",
    name: "Special Deals",
    description: "Limited time offers on our most popular products.",
    imageUrl: product1,
    status: "active",
    createdAt: "2025-01-05T11:30:00Z",
    updatedAt: "2025-02-20T10:15:00Z",
    featured: true,
    startDate: "2025-02-15T00:00:00Z",
    endDate: "2025-03-15T23:59:59Z",
    position: 5,
    products: ["1", "3", "5", "7", "9", "11"],
    tags: ["sale", "special", "deals", "featured"]
  }
];