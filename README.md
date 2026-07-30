<div align="center">

# 🎬 Movie Booking Management System

### *A Full Stack Movie Ticket Booking Platform built with Spring Boot, React & MySQL*

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=E50914&center=true&vCenter=true&width=750&lines=Book+Movie+Tickets+Online+🎟️;Spring+Boot+%2B+React+%2B+MySQL;JWT+Authentication+%7C+REST+API;Admin+Dashboard+%7C+Seat+Booking+System" />

<br/>

<img src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk"/>
<img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot"/>
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react"/>
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite"/>
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql"/>
<img src="https://img.shields.io/badge/JPA-Hibernate-orange?style=for-the-badge"/>
<img src="https://img.shields.io/badge/JWT-Authentication-red?style=for-the-badge"/>
<img src="https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss"/>
<img src="https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven"/>

<br/><br/>

<img src="https://img.shields.io/github/stars/chelsi1704/MovieBookingProject?style=social"/>
&nbsp;
<img src="https://img.shields.io/github/forks/chelsi1704/MovieBookingProject?style=social"/>
&nbsp;
<img src="https://img.shields.io/github/watchers/chelsi1704/MovieBookingProject?style=social"/>
&nbsp;
<img src="https://img.shields.io/github/last-commit/chelsi1704/MovieBookingProject?style=social"/>

</div>

---

# 🎯 Project Overview

Movie Booking Management System is a modern full-stack web application that enables users to browse movies, select theatres, choose seats, complete secure bookings, and manage tickets online.

The application provides dedicated dashboards for **Users** and **Administrators**, making movie management, show scheduling, and booking operations simple and efficient.

---

# ✨ Key Features

## 👤 User Module

- User Registration & Login
- JWT Authentication
- Google OAuth Login
- Browse Movies
- Search Movies
- View Movie Details
- Wishlist Management
- Seat Selection
- Real-time Seat Locking
- Booking Review
- Coupon Support
- OTP Based Payment
- Ticket Generation
- Booking History
- Notifications
- User Profile

---

## 🎬 Admin Module

- Dashboard Analytics
- Movie Management
- Showtime Management
- Theater Management
- User Management
- Booking Management
- Offer & Coupon Management

---

# 🛠 Tech Stack

| Layer | Technology |
|---------|------------|
| Frontend | React.js + Vite |
| Backend | Spring Boot |
| Security | Spring Security + JWT |
| ORM | Spring Data JPA (Hibernate) |
| Database | MySQL |
| Styling | Tailwind CSS |
| Build Tool | Maven |
| API Testing | Postman |
| Version Control | Git & GitHub |

---

# 🏗 System Architecture

```text
                React Frontend
                      │
                      │ REST APIs
                      ▼
          Spring Boot Backend
                      │
      Spring Security + JWT
                      │
             JPA / Hibernate
                      │
                    MySQL
```

---

# 📂 Project Structure

```text
MovieBookingProject
│
├── movie-booking-frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
├── movie-booking-backend
│   ├── src/main/java
│   ├── src/main/resources
│   ├── pom.xml
│   └── mvnw
│
└── README.md
```

---

# 🔐 User Roles

## 👤 User

- Register/Login
- Browse Movies
- Book Tickets
- Wishlist
- Payments
- My Bookings
- Notifications

---

## 👨‍💼 Admin

- Manage Movies
- Manage Theaters
- Manage Showtimes
- Manage Bookings
- Manage Offers
- Manage Users

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/chelsi1704/MovieBookingProject.git
```

---

## Backend Setup

```bash
cd movie-booking-backend
```

Configure

```
application.properties
```

Update

- Database Username
- Database Password
- JWT Secret
- Google OAuth Keys
- Mail Configuration

Run

```bash
mvn spring-boot:run
```

Backend runs at

```
http://localhost:8081
```

---

## Frontend Setup

```bash
cd movie-booking-frontend
```

Install dependencies

```bash
npm install
```

Run

```bash
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# 🚀 Future Enhancements

- Online Payment Gateway (Razorpay/Stripe)
- Live Seat Updates using WebSockets
- Email Ticket PDF
- QR Code Based Ticket Verification
- Movie Recommendation System
- Reviews & Ratings
- Multi-language Support
- Mobile Responsive UI Improvements

---

# 🤝 Contributing

```bash
Fork Repository

Create Feature Branch

git checkout -b feature/new-feature

Commit Changes

git commit -m "Added new feature"

Push Changes

git push origin feature/new-feature

Create Pull Request
```

---

<div align="center">

### ⭐ If you like this project, don't forget to Star the repository.

Made with ❤️ using Spring Boot, React & MySQL

</div>
