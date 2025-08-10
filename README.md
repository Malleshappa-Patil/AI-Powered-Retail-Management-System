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

```
## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### **1. Prerequisites**

Ensure you have the following software installed:
-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   [MySQL Server](https://dev.mysql.com/downloads/mysql/)
-   [MongoDB Community Server](https://www.mongodb.com/try/download/community)
-   A code editor like [VS Code](https://code.visualstudio.com/)

---

### **2. Database Setup**

1.  **Start Services:** Ensure both your MySQL and MongoDB servers are running.
2.  **Create MySQL Database:** Log into your MySQL client and run the following command:
    ```sql
    CREATE DATABASE inventory_db;
    ```
3.  **Create Tables & Data:** Use the new database (`USE inventory_db;`) and then execute the **entire SQL script** provided in the project files. This will create all necessary tables and insert sample data.

---

### **3. Backend Setup**

1.  **Navigate to the backend folder:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create environment file:**
    ```bash
    cp .env.example .env
    ```
4.  **Configure `.env` file:** Open the new `.env` file and fill in your details:
    ```
    MYSQL_USER=your_mysql_username
    MYSQL_PASSWORD=your_mysql_password
    JWT_SECRET=your_super_secret_random_string
    ```
5.  **Start the backend server:**
    ```bash
    node server.js
    ```
    The server should now be running on `http://localhost:5001`.

---

### **4. Frontend Setup**

1.  **Open a new terminal window.**
2.  **Navigate to the frontend folder:**
    ```bash
    cd frontend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the frontend server:**
    ```bash
    npm start
    ```
    Your browser should automatically open to `http://localhost:3000`.

---

### **5. Usage**

-   Navigate to `http://localhost:3000`.
-   **Sign up** for a new user account, or log in with the default admin credentials:
    -   **Username:** `admin`
    -   **Password:** `admin123`
-   Explore the application!

---

## 📄 API Endpoints

A brief overview of the main API routes available:

-   `POST /api/users/register`: Create a new user account.
-   `POST /api/users/login`: Log in and receive a JWT.
-   `GET /api/products`: Fetch all products or products by category.
-   `POST /api/products`: (Admin) Add a new product.
-   `PUT /api/products/:id`: (Admin) Update product details.
-   `PUT /api/products/:id/image`: (Admin) Update a product's image.
-   `DELETE /api/products/:id`: (Admin) Delete a product.
-   `POST /api/billing/checkout`: Process a user's shopping cart and record the sale.

---

## 📧 Contact

For any questions or feedback regarding this project, feel free to reach out.

-   **Email:** `mdpatil2004@gmail.com`

Thank you for checking out the project!
