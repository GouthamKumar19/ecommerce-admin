# Admin Panel Project Structure

This document outlines the structure of the Admin Panel project, designed for managing users, products, and other administrative tasks.

## Folder Structure

```
src/
│
├── assets/           # Static files like images, fonts, etc.
│
├── components/       # Reusable components
│   ├── common/       # Common components (Header, Sidebar, etc.)
│   └── ui/           # UI components (buttons, inputs, etc.)
│
├── hooks/            # Custom React hooks
│
├── layouts/          # Layout components
│   ├── AuthLayout.tsx     # Layout for authentication pages
│   └── MainLayout.tsx     # Main layout with header and sidebar
│
├── pages/            # Page components
│   ├── auth/         # Authentication pages
│   │   └── LoginPage.tsx
│   ├── dashboard/    # Dashboard page
│   │   └── DashboardPage.tsx
│   ├── users/        # User management pages
│   │   ├── UsersPage.tsx
│   │   └── UserDetailsPage.tsx
│   └── NotFoundPage.tsx
│
├── routes/           # Routing configuration
│   └── index.tsx     # Main router configuration
│
├── types/            # TypeScript type definitions
│
└── utils/            # Utility functions
```

## Key Features

1. **Authentication**: Login page with form validation
2. **Dashboard**: Overview with statistics and recent activity
3. **User Management**: List, view, and manage users
4. **Responsive Design**: Works on mobile, tablet, and desktop devices
5. **Modular Structure**: Well-organized code for maintainability

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Navigate to `http://localhost:5173` in your browser

## Technology Stack

- React 19
- TypeScript
- React Router DOM
- Tailwind CSS

## Extending the Project

To add more features:

1. Create new page components in the appropriate folders
2. Add routes in `routes/index.tsx`
3. Update sidebar navigation in `components/common/Sidebar.tsx`
