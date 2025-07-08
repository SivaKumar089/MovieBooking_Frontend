
All-in-One README.md for Movie Ticket Booking App
markdown
Copy
Edit
# 🎬 Movie Ticket Booking System

A full-stack Movie Ticket Booking application built with **React.js** (Frontend) and **Django REST Framework** (Backend). Users can browse movies, view available shows, select seats, and make bookings. Admins and owners have role-based dashboards to manage the entire platform.

---

## 🔥 Tech Stack

### 🖥 Frontend
- React.js (with Hooks)
- React Router DOM
- Redux Toolkit
- Axios
- Tailwind CSS
- React Icons
- React Toastify
- AOS (Animate on Scroll)


### 🔙 Backend
- Django
- Django REST Framework (DRF)
- Simple JWT Authentication
- PostgreSQL (or SQLite for dev)
- Custom `AbstractUser` with roles (admin, owner, user)
- OTP-based Password Reset via Email

---

## 📁 Project Folder Structure

movie-ticket-app/
├── backend/ # Django Project
│ ├── users/ # Custom User model and Auth
│ ├── theaters/ # Theater, Movie, Show, Seat models
│ ├── bookings/ # Booking logic
│ └── ...
├── frontend/ # React Frontend
│ ├── components/
│ ├── pages/
│ ├── redux/
│ ├── router/
│ ├── utils/
│ └── App.js

yaml
Copy
Edit

---

## ⚙️ Backend Setup (Django)

### 1. Clone the Project

```bash
git clone https://github.com/your-username/movie-ticket-app.git
cd movie-ticket-app/backend
2. Create Virtual Environment
bash
Copy
Edit
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
3. Install Requirements
bash
Copy
Edit
pip install -r requirements.txt
4. Create .env file
ini
Copy
Edit
SECRET_KEY=your-secret-key
DEBUG=True
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
5. Migrate and Run Server
bash
Copy
Edit
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
🌐 Frontend Setup (React)
1. Navigate to Frontend
bash
Copy
Edit
cd ../frontend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Create .env file
env
Copy
Edit
REACT_APP_API_BASE_URL=http://localhost:8000/api/
4. Run the Frontend
bash
Copy
Edit
npm start
Access: http://localhost:3000

🔐 Authentication Features
Signup with role: Admin / Owner / User

JWT-based login with refresh token

Password reset using OTP via email

Auth stored in Redux & LocalStorage

Protected routes with role check

🎟 Booking Features
Seat map (10x10 grid) for each show

Auto-select/unselect logic for seats

Real-time seat availability updates

Booking confirmation and fake payment

Booked seats marked as is_booked: true

🛠 Admin & Owner Features
Admin:

Manage all users

Add/edit/delete movies

View all bookings

Owner:

Create Theaters

Create Shows with seats

View bookings for their shows

🧪 Sample Testing Steps
Register as Admin, Owner, or User

Admin logs in and adds Movies

Owner creates Theaters and Shows

User books seats for a show

Booked seats become unavailable

💻 Deployment Guide
Frontend
bash
Copy
Edit
npm run build
# Deploy to Netlify, Vercel, or GitHub Pages
Backend
bash
Copy
Edit
# Setup Gunicorn + Nginx or use platforms like:
# - Railway
# - Render
# - Heroku (with PostgreSQL)
Production Notes
Set DEBUG=False

Use real email backend for OTP

Use PostgreSQL in production

Enable CORS in Django for React domain

📸 Screenshots
Add screenshots like:

Landing page

Admin dashboard

Seat selection UI

Mobile responsiveness

👨‍💻 Author
Siva Kumar

Full Stack Developer (React + Django)

GitHub: @your-username