# ShopSmart App

Hello Everyone !

ShopSmart is an online store application built using Next.js and Typrecrsipt. The app integrates features such as product browsing, category filtering, a shopping cart, user authentication, and more. To access my deployed website, visit: [https://shop-smartt-next-js.vercel.app/]

## Overview of the Application
ShopSmart allows users to explore a variety of products, filter by categories, and add items to their shopping cart. Users can log in to manage their accounts, while the shopping cart is accessible to both logged-in and non-logged-in users. The app is designed to be intuitive and responsive, ensuring ease of use across devices.

To log-in to the account use:

Email : sutris@mail.com
Password: Qwerty123
 

## Features Implemented
- **Product Listing and Filtering**: Users can view products and filter them by categories and price range.
- **Landing Page**: Highlights featured products and categories.
- **Shopping Cart**: Allows users to add, remove, and update product quantities.
- **Authentication**: Users can register, log in, and access their dashboard.
- **Responsive Design**: Ensures compatibility with various devices.

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/rifqisaleh/ShopSmartt-Next.js.git
   ```
2. Navigate to the project directory:
   ```bash
   cd shopSmart
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used

**Frontend**

   1. Framework: Next.js (React)

   2. Language: TypeScript

   3. Styling: Tailwind CSS

   4. Icons: Font Awesome


**Backend API**

   `https://fakeapi.platzi.com/en/about/introduction/`

 **Routing** 
 
   React Router

**State Management** 

   React Context API

**Icon** 

   Font Awesome

## Project Structure

```
shopSmart/
├── public/
├── src/
│   ├── __tests__/          # Unit and integration tests
│   ├── components/         # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── Layout.tsx
│   │   ├── ShoppingCart.tsx
│   ├── context/            # React context for global states
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   ├── pages/              # Next.js pages
│   │   ├── api/            # API route handlers
│   │   ├── cart/           # Cart-related pages
│   │   ├── login/          # Login and registration pages
│   │   ├── product/        # Product details and listing
│   │   ├── shop/           # Shop-related pages
│   │   ├── index.tsx       # Landing page
│   ├── styles/             # Global and component-specific styles
├── .env.local              # Environment variables
├── .eslintrc               # Linter configuration
├── jest.config.js          # Jest configuration for testing
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.



