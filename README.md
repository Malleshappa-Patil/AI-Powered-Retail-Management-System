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


🚀 Getting Started
Follow these instructions to get the project up and running on your local machine.

Prerequisites
Ensure you have the following software installed:

Node.js (LTS version recommended)

[suspicious link removed]

MongoDB Community Server

A code editor like VS Code

1. Database Setup
Start MySQL and MongoDB: Ensure both database servers are running on your machine.

Create MySQL Database: Log into your MySQL client and run the following command:

SQL

CREATE DATABASE inventory_db;
Create Tables & Data: Use the new database (USE inventory_db;) and then execute the entire SQL script provided in the project files to create all necessary tables and insert sample data.

2. Backend Setup
Navigate to the backend folder:

Bash

cd backend
Install dependencies:

Bash

npm install
Create environment file: Copy the .env.example file to a new file named .env.

Bash

cp .env.example .env
Configure .env: Open the .env file and fill in your MySQL credentials and a custom JWT_SECRET.

MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
JWT_SECRET=your_super_secret_random_string
Start the backend server:

Bash

node server.js
The server should now be running on http://localhost:5001.

3. Frontend Setup
Open a new terminal window.

Navigate to the frontend folder:

Bash

cd frontend
Install dependencies:

Bash

npm install
Start the frontend server:

Bash

npm start
Your browser should automatically open to http://localhost:3000.

4. Usage
Navigate to http://localhost:3000.

Sign up for a new user account, or log in with the default admin credentials:

Username: admin

Password: admin123

Explore the application!

📄 API Endpoints
A brief overview of the main API routes available:

POST /api/users/register: Create a new user account.

POST /api/users/login: Log in and receive a JWT.

GET /api/products: Fetch all products or products by category.

POST /api/products: (Admin) Add a new product.

PUT /api/products/:id: (Admin) Update product details.

PUT /api/products/:id/image: (Admin) Update a product's image.

DELETE /api/products/:id: (Admin) Delete a product.

POST /api/billing/checkout: Process a user's shopping cart and record the sale.

Thank you for checking out the project!