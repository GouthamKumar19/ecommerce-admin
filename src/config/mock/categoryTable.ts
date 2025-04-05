import { Category } from "../../types/category.types";

const currentDate = "2025-03-10T07:33:23Z"; // Use ISO 8601 format for dates

export const mockCategoryData: Category[] = [
  {
    _id: "67932226bc41aa3e4fcb4941", // mocked unique id
    name: "Men",
    image: "/ecommerce/categories/men.png",
    subcategories: [
      {
        _id: "67932226bc41aa3e4fcb4942",
        id: 1,
        name: "T-Shirts",
        image: "/ecommerce/men/tshirts.png",
        images: [
          { id: 1, url: "/ecommerce/men/tshirts1.png", selected: true },
          { id: 2, url: "/ecommerce/men/tshirts2.png", selected: false },
        ],
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        _id: "67932226bc41aa3e4fcb4943",
        id: 2,
        name: "Jeans",
        image: "/ecommerce/men/jeans.png",
        images: [
          { id: 1, url: "/ecommerce/men/jeans1.png", selected: true },
          { id: 2, url: "/ecommerce/men/jeans2.png", selected: false },
        ],
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        _id: "67932226bc41aa3e4fcb4944",
        id: 3,
        name: "Shoes",
        image: "/ecommerce/men/shoes.png",
        images: [
          { id: 1, url: "/ecommerce/men/shoes1.png", selected: true },
          { id: 2, url: "/ecommerce/men/shoes2.png", selected: false },
        ],
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        _id: "67932226bc41aa3e4fcb4945",
        id: 4,
        name: "Accessories",
        image: "/ecommerce/men/accessories.png",
        images: [
          { id: 1, url: "/ecommerce/men/accessories1.png", selected: true },
          { id: 2, url: "/ecommerce/men/accessories2.png", selected: false },
        ],
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        _id: "67932226bc41aa3e4fcb4946",
        id: 5,
        name: "Formal Wear",
        image: "/ecommerce/men/formalwear.png",
        images: [
          { id: 1, url: "/ecommerce/men/formalwear1.png", selected: true },
          { id: 2, url: "/ecommerce/men/formalwear2.png", selected: false },
        ],
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    ],
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    _id: "67932226bc41aa3e4fcb4947", // mocked unique id
    name: "Women",
    image: "/ecommerce/categories/women.png",
    subcategories: [
      {
        _id: "67932226bc41aa3e4fcb4948",
        id: 6,
        name: "Dresses",
        image: "/ecommerce/women/dresses.png",
        images: [
          { id: 1, url: "/ecommerce/women/dresses1.png", selected: true },
          { id: 2, url: "/ecommerce/women/dresses2.png", selected: false },
        ],
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        _id: "67932226bc41aa3e4fcb4949",
        id: 7,
        name: "Tops",
        image: "/ecommerce/women/tops.png",
        images: [
          { id: 1, url: "/ecommerce/women/tops1.png", selected: true },
          { id: 2, url: "/ecommerce/women/tops2.png", selected: false },
        ],
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        _id: "67932226bc41aa3e4fcb4950",
        id: 8,
        name: "Skirts",
        image: "/ecommerce/women/skirts.png",
        images: [
          { id: 1, url: "/ecommerce/women/skirts1.png", selected: true },
          { id: 2, url: "/ecommerce/women/skirts2.png", selected: false },
        ],
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        _id: "67932226bc41aa3e4fcb4951",
        id: 9,
        name: "Accessories",
        image: "/ecommerce/women/accessories.png",
        images: [
          { id: 1, url: "/ecommerce/women/accessories1.png", selected: true },
          { id: 2, url: "/ecommerce/women/accessories2.png", selected: false },
        ],
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    ],
    createdAt: currentDate,
    updatedAt: currentDate,
  },
  {
    _id: "67932226bc41aa3e4fcb4952", // mocked unique id
    name: "Kids",
    image: "/ecommerce/categories/kids.png",
    subcategories: [
      {
        _id: "67932226bc41aa3e4fcb4953",
        id: 10,
        name: "T-Shirts",
        image: "/ecommerce/kids/tshirts.png",
        images: [
          { id: 1, url: "/ecommerce/kids/tshirts1.png", selected: true },
          { id: 2, url: "/ecommerce/kids/tshirts2.png", selected: false },
        ],
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        _id: "67932226bc41aa3e4fcb4954",
        id: 11,
        name: "Pants",
        image: "/ecommerce/kids/pants.png",
        images: [
          { id: 1, url: "/ecommerce/kids/pants1.png", selected: true },
          { id: 2, url: "/ecommerce/kids/pants2.png", selected: false },
        ],
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        _id: "67932226bc41aa3e4fcb4955",
        id: 12,
        name: "Dresses",
        image: "/ecommerce/kids/dresses.png",
        images: [
          { id: 1, url: "/ecommerce/kids/dresses1.png", selected: true },
          { id: 2, url: "/ecommerce/kids/dresses2.png", selected: false },
        ],
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        _id: "67932226bc41aa3e4fcb4956",
        id: 13,
        name: "Shoes",
        image: "/ecommerce/kids/shoes.png",
        images: [
          { id: 1, url: "/ecommerce/kids/shoes1.png", selected: true },
          { id: 2, url: "/ecommerce/kids/shoes2.png", selected: false },
        ],
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    ],
    createdAt: currentDate,
    updatedAt: currentDate,
  },
];
