# 🎬 Movie Ticket Booking App – Frontend

This is the **frontend** of the Movie Ticket Booking System built using **React.js**. It allows users to sign up, log in, view movies and showtimes, select seats, and book tickets. It also includes role-based dashboards for Admins and Owners.
---              
## 🚀 Features

- 🔐 User authentication (Signup/Login with JWT)
- 🎞 View movies and shows
- 🪑 Select and book seats
- 👥 Role-based dashboards (Admin, Owner, User)
- 💳 Fake payment flow
- 📅 Real-time seat availability
- 📱 Fully responsive with animations

---

## 🛠️ Technologies Used

- React.js
- React Router DOM
- Redux Toolkit
- Axios
- Tailwind CSS
- React Icons
- React Toastify
- AOS (Animate on Scroll)

---
## 📁 Folder Structure
src/
├── components/ # Reusable components (Navbar, Seats, etc.)
├── pages/ # Page-level views
│ ├── auth/ # Login, Signup, OTP
│ ├── user/ # User pages (Booking, Shows)
│ ├── owner/ # Owner dashboard
│ └── admin/ # Admin dashboard
├── redux/ # Redux store & slices
├── router/ # App routes
├── utils/ # Axios instance, helpers
└── App.js # Root component



---

## 🧑‍💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/movie-ticket-frontend.git
cd movie-ticket-frontend
2. Install dependencies

npm install
3. Setup environment variables
Create a .env file in the root:
 

REACT_APP_API_BASE_URL=http://localhost:8000/api/
(Replace with your actual backend API URL)

4. Start the development server

npm start
Visit: http://localhost:3000

🔐 Authentication Flow
Signup/Login using email & password

JWT tokens stored in Redux/localStorage

Auto token refresh on expiry

OTP-based password reset

Protected routes by role (user/owner/admin)

🎟 Booking Flow
User selects a show

Seat grid loads with availability

User selects number of seats

Fake payment process triggers

On success, seats are marked as booked

📦 Build for Production
npm run build
The production-ready files will be in the /build directory. You can deploy them on:

Netlify      