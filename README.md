# Full-Stack Inventory Tracking System

A complete, full-stack web application designed for small businesses to manage product inventory, track sales, and provide a seamless shopping experience for customers. This project features a modern frontend built with React and a robust backend powered by Node.js, Express.js, and a hybrid database system using both MySQL and MongoDB.

## ✨ Key Features

* **Secure Authentication:** JWT-based login and registration system with password hashing (`bcrypt`).
* **Role-Based Access Control:** Differentiates between **Admin** (full CRUD access) and **Viewer** (read-only and purchasing) roles.
* **Complete Inventory Management:** Admins can add, view, update, and delete products, including details like name, price, quantity, category, and images.
* **Hybrid Database System:**
    * **MySQL:** For structured, relational data (users, products, inventory, sales history).
    * **MongoDB:** For flexible, unstructured data like product images (stored as base64) and metadata.
* **Dynamic Frontend:** A clean, responsive UI inspired by modern e-commerce sites like Zepto.
    * **Category Navigation:** Browse products by specific categories.
    * **Real-time Stock Updates:** Product cards intelligently update stock availability as items are added to the cart.
    * **Search Functionality:** A modal-based search to quickly find products.
* **Shopping Cart & Billing:**
    * Users can add products to a cart and adjust quantities.
    * Secure checkout process that updates inventory levels in real-time.
    * Admins can track sales history for each user.
    * Users can download a PNG image of their final bill.
* **Admin Reporting:** Admins can export a CSV report of low-stock items.

## 🛠️ Technology Stack

| Area          | Technology                                                                                                |
| :------------ | :-------------------------------------------------------------------------------------------------------- |
| **Frontend** | React.js (Hooks, Context API), React Router, Axios, `html2canvas`, `react-icons`                          |
| **Backend** | Node.js, Express.js                                                                                       |
| **Databases** | **MySQL** (with `mysql2` driver), **MongoDB** (with `mongoose` ODM)                                         |
| **Auth** | JSON Web Tokens (JWT), `bcrypt` for password hashing                                                      |
| **API & Comms** | RESTful API, CORS, `multer` for image uploads, `Joi` for validation                                       |

## 📂 Project Structure

```plaintext
inventory-tracking-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        ├── services/
        └── App.js# Inventory-Tracking-System
