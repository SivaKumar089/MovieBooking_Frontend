# 🎬 Bookit Cinema — Frontend Application

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-State-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" />
  <img src="https://img.shields.io/badge/QR_Scanner-HTML5_Camera-10B981?style=for-the-badge&logo=qrcode&logoColor=white" />
</p>

> **A modern, responsive, and cinema-themed web application for Movie Ticket Booking**, crafted with **React 19**, **Tailwind CSS**, and **Vite**. Features dynamic interactive seat layouts, real-time status synchronization, owner auditorium management, and Gatebox QR pass scanning.

---

## 📑 Table of Contents

- [Visual Showcase & Aesthetics](#-visual-showcase--aesthetics)
- [Key Features](#-key-features)
- [Interactive Seating Map System](#-interactive-seating-map-system)
- [Gatebox QR Ticket Verification](#-gatebox-qr-ticket-verification)
- [State Management & Session Persistence](#-state-management--session-persistence)
- [Route Architecture](#-route-architecture)
- [Installation & Local Setup](#-installation--local-setup)
- [Production Build](#-production-build)

---

## 🎨 Visual Showcase & Aesthetics

The application adopts a **premium dark cinema aesthetic** (`#090d16` background) with glassmorphism, amber cinematic accents, and subtle micro-animations:
* **Curved Cinema Screen:** Glowing projection arc emphasizing front-of-house orientation.
* **Tiered Seating Layout:** Distinct visual styling for VIP (Rows A–B), Premium (Rows C–F), and Standard (Rows G–J) tiers.
* **Responsive Layouts:** Desktop navigation bar with instant role badges, and an intuitive mobile navigation drawer.

---

## 🚀 Key Features

* 🎟️ **End-to-End Booking Workflow:** Browse active screenings, select available seats, review itemized price calculations, and complete instant simulated checkout.
* 👑 **Owner Booking Capability:** Theater owners can book seats directly from the auditorium inspector or browse the catalog like customers without permission barriers.
* 💺 **Live State Synchronization:** Seat statuses update immediately upon booking; available seat counters decrement in real-time.
* 📱 **Verifiable Digital Tickets:** Confirmed bookings generate a scannable QR pass with unique booking codes, auditorium details, and seat coordinates.
* 🛡️ **Role-Guarded QR Scanner:** Scanner features and manual verification pages are strictly hidden and blocked for regular customers, restricted to authorized owners and administrators.
* 💳 **Sandbox Checkout:** Zero-friction simulated digital checkout with 1-click approvals, mock wallets, and test session resets.

---

## 🪑 Interactive Seating Map System

The seat selection grid adheres to a strict **4-state visual color hierarchy** synchronized across customer views, owner dashboards, and status inspectors:

| Seat State | Color Palette | Tailwind Classes | Description |
| :--- | :---: | :--- | :--- |
| **My Booked Seat** | 🟦 **Blue** | `bg-blue-600 border-blue-400 text-white` | Matches the blue visual identity of "Your Tickets"; cannot be re-booked. |
| **Booked by Others** | 🟥 **Muted Red** | `bg-rose-950/50 border-rose-800/60 text-rose-300` | Clearly indicates seats unavailable due to other customer bookings. |
| **Selected** | 🟨 **Amber** | `bg-amber-500 border-amber-400 text-slate-950` | Currently selected in active checkout session (up to 8 seats). |
| **Available** | ⬛ **Dark Slate** | `bg-slate-900 border-slate-700 text-slate-300` | Open for booking; displays tier-based pricing on hover. |

> **Persistence Guarantee:** Refreshing or navigating directly via URL preserves the selected show ID and re-synchronizes seat statuses directly from the backend database.

---

## 📷 Gatebox QR Ticket Verification

The application integrates an on-device camera scanner powered by `html5-qrcode` alongside manual booking code entry:

1. **Permission Guarding:** Only users with `role: 'owner'` or `role: 'admin'` see the "Verify Pass" trigger in the navbar, homepage, and dashboard.
2. **Route Protection:** Accessing `/user/verify` directly as a regular customer redirects automatically with an access-denied notification.
3. **Database Validation:** Scanned codes are sent to `/bookings/verify/` to confirm legitimacy, seat assignment, customer identity, and cancellation status.

---

## 🔄 State Management & Session Persistence

* **Redux Toolkit (`authSlice`):** Manages access and refresh JWT tokens alongside decoded user identity.
* **Persistent Storage:** Access tokens, refresh tokens, and user profiles (`id`, `username`, `role`) are cached in `localStorage` for uninterrupted sessions across browser refreshes.
* **Axios Interceptor (`axios.js`):** Automatically injects the `Authorization: Bearer <token>` header and handles seamless access token refreshes when expired.

---

## 🗺️ Route Architecture

```
/ (Home Landing Page)
├── /auth
│   ├── /login (User & Owner Login)
│   ├── /signup (Account Registration)
│   ├── /profile (User Profile)
│   ├── /forgot-password (OTP Reset)
│   └── /logout (Session Teardown)
├── /user
│   ├── /dashboard (Customer Hub)
│   ├── /movies (Catalog of Now Showing Movies)
│   ├── /theaters (Theater Directory)
│   ├── /shows (Upcoming Screenings)
│   ├── /seat-layout (Interactive 100-Seat Grid)
│   ├── /payment (Sandbox Checkout)
│   └── /my-tickets (Confirmed Scannable Passes)
└── /owner
    ├── /dashboard (Owner KPI Hub & Quick Actions)
    ├── /status (Live Auditorium Seat Map & Inspector)
    ├── /shows (Screening List with Live Counters)
    ├── /movies (Managed Movie Catalog)
    ├── /theaters (Managed Multiplex Locations)
    └── /bookings (Auditorium Revenue & Bookings)
```

---

## 💻 Installation & Local Setup

### Prerequisites
* **Node.js 18+** or **Node.js 20+**
* **npm** or **yarn**

### Quick Start

```bash
# 1. Navigate to frontend folder
cd MovieBooking_Frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional)
# Create a .env file (defaults to http://127.0.0.1:8000/ if omitted):
# VITE_BACKEND_URL=http://127.0.0.1:8000/

# 4. Launch Vite development server
npm run dev
```

The app will start at `http://localhost:5173/`.

---

## 📦 Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The compiled assets will be output to the `dist/` folder, ready for zero-config deployment to **Vercel**, **Netlify**, or **Cloudflare Pages**.

---

<p align="center">
  Crafted with care by <b>Siva Kumar</b> • Designed for immersive cinematic experiences.
</p>
