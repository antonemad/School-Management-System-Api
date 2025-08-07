# School Management System API

A RESTful API for managing a school system, including users, students, teachers, academic years, classes, programs, and more. Built using **Node.js**, **Express**, and **MongoDB**.

## 🚀 Features

- User authentication & authorization (JWT-based)
- Role-based access control (Admin, Teacher, Student, etc.)
- Manage academic years and terms
- Manage students, teachers, classes, and programs
- Password reset via email
- Clean and modular project structure

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Token)
- Bcrypt
- Nodemailer
- dotenv
- Morgan

## 📦 Installation

```bash
git clone https://github.com/antonemad/School-Management-System-Api.git
cd School-Management-System-Api
npm install
npm run dev
```

Make sure to create a `.env` file with the following environment variables:

```env
PORT=3000
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:3000
```

## 📄 API Documentation

👉 [View full API documentation on Postman](https://documenter.getpostman.com/view/39188598/2sB3BDJqi6)

## 📁 Project Structure

```
.
├── controllers/        # Route logic
├── models/             # Mongoose models
├── routes/             # Route definitions
├── middlewares/        # Custom middleware
├── utils/              # Helper functions
├── config/             # DB connection and other config
├── server.js           # App entry point
└── package.json
```

## 📬 Example Request

```http
POST /admins/register
Host: localhost:3000
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

## ✅ Scripts

```bash
npm run dev     # Run in development (with nodemon)
npm start       # Run in production
```

## 🧠 Future Improvements

- Admin dashboard (frontend)
- Logs and monitoring
- Swagger documentation (optional)

## 👤 Author

Anton Emad  

---
