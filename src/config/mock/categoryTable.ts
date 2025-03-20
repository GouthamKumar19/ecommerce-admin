import { Category } from "../../types/category.types";

const currentDate = "2025-03-10T07:33:23Z"; // Use ISO 8601 format for dates
const currentUser = "AnmolSShetty";

export const mockCategoryData: Category[] = [
    {
        _id: '67932226bc41aa3e4fcb4941', // mocked unique id
        name: 'Men',
        image: '/ecommerce/categories/men.png',
        subcategories: [
            {
                _id: '67932226bc41aa3e4fcb4942',
                name: 'T-Shirts',
                image: '/ecommerce/men/tshirts.png',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                _id: '67932226bc41aa3e4fcb4943',
                name: 'Jeans',
                image: '/ecommerce/men/jeans.png',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                _id: '67932226bc41aa3e4fcb4944',
                name: 'Shoes',
                image: '/ecommerce/men/shoes.png',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                _id: '67932226bc41aa3e4fcb4945',
                name: 'Accessories',
                image: '/ecommerce/men/accessories.png',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                _id: '67932226bc41aa3e4fcb4946',
                name: 'Formal Wear',
                image: '/ecommerce/men/formalwear.png',
                createdAt: currentDate,
                updatedAt: currentDate
            }
        ],
        createdAt: currentDate,
        updatedAt: currentDate
    },
    {
        _id: '67932226bc41aa3e4fcb4947', // mocked unique id
        name: 'Women',
        image: '/ecommerce/categories/women.png',
        subcategories: [
            {
                _id: '67932226bc41aa3e4fcb4948',
                name: 'Dresses',
                image: '/ecommerce/women/dresses.png',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                _id: '67932226bc41aa3e4fcb4949',
                name: 'Tops',
                image: '/ecommerce/women/tops.png',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                _id: '67932226bc41aa3e4fcb4950',
                name: 'Skirts',
                image: '/ecommerce/women/skirts.png',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                _id: '67932226bc41aa3e4fcb4951',
                name: 'Accessories',
                image: '/ecommerce/women/accessories.png',
                createdAt: currentDate,
                updatedAt: currentDate
            }
        ],
        createdAt: currentDate,
        updatedAt: currentDate
    },
    {
        _id: '67932226bc41aa3e4fcb4952', // mocked unique id
        name: 'Kids',
        image: '/ecommerce/categories/kids.png',
        subcategories: [
            {
                _id: '67932226bc41aa3e4fcb4953',
                name: 'T-Shirts',
                image: '/ecommerce/kids/tshirts.png',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                _id: '67932226bc41aa3e4fcb4954',
                name: 'Pants',
                image: '/ecommerce/kids/pants.png',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                _id: '67932226bc41aa3e4fcb4955',
                name: 'Dresses',
                image: '/ecommerce/kids/dresses.png',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                _id: '67932226bc41aa3e4fcb4956',
                name: 'Shoes',
                image: '/ecommerce/kids/shoes.png',
                createdAt: currentDate,
                updatedAt: currentDate
            }
        ],
        createdAt: currentDate,
        updatedAt: currentDate
    }
];
