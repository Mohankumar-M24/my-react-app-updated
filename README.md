## E-Commerce Frontend (React)

- This is the frontend for a full-stack E-Commerce application built using React, Tailwind CSS, and React Router, connected to a Node.js + Express + MongoDB backend.

## Live Site (if deployed)

- https://your-ecommerce-frontend.netlify.app

## Tech Stack

- React
- Tailwind CSS
- React Router DOM
- Axios
- React Icons
- React Toastify
- Context API for Auth, Cart, Wishlist
- Netlify (Deployment)

## Features

## User Features

- Register/Login (Buyer or Seller)
- View Products
- Filter by category, search, and price
- Add to Cart
- Add/Remove Wishlist items
- Place orders (Razorpay integration)
- View order history
- Submit product reviews

## Seller Features

- Add / Edit / Delete Products
- View orders received
- Manage Store Info (Name, Logo, Location)

## Important Notes

- Cart & Wishlist use localStorage

- Razorpay uses window.Razorpay (no SDK needed)

- Auth token is stored in httpOnly cookie — not visible in frontend

## Ensure backend has proper CORS and credentials: true

Security Recommendations

- Sanitize user input for reviews
- Restrict dashboard access based on role
- Handle image upload limits on seller side
