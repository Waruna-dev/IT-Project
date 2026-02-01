# 🛍️ Harsha Fashion – Full Stack Web Application

A full-stack MERN web application with secure authentication, role-based access control, admin management, password recovery, and PDF report generation.
Built with modern web technologies and best practices, focusing on scalability, security, and clean architecture.

---

![Web Preview](frontend/Harsha.jpg)

# 🌐 Live Features Overview

**👤 User Features**

   - User registration & login
   - Secure JWT-based authentication
   - Forgot password & reset password via email (token-based)
   - Password strength validation
   - Role-based access (Customer, Staff, Delivery, Owner, Admin)
   - Shopping cart support
   - Account activity tracking (Last login, Created date)

**🛠️ Admin Features**

   - Admin dashboard
   - View all users
   - Update user roles
   - Delete users
   - Activate / deactivate users
   - Generate PDF reports for users
   - Name
   - Email
   - Role
   - Created date
   - Last login time

**📄 Report Generation**

   - Generate downloadable PDF reports
   - Uses server-side PDF creation
   - Useful for auditing & analytics

**🧱 Tech Stack**

**Frontend**

   - React.js (Vite)
   - Axios
   - React Router
   - Tailwind CSS
   - React Toastify

**Backend**

   - Node.js
   - Express.js
   - MongoDB
   - Mongoose
   - JWT Authentication
   - bcrypt
   - Nodemailer
   - PDFKit

**🔐 Authentication & Security**

   - JWT-based authentication
   - Password hashing using bcrypt
   - Token-based password reset with expiration
   - Secure email delivery using Nodemailer
   - Role-based route protection