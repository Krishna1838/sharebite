# ShareBite 🍎
### *Food Waste Reduction & Sharing Platform*

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-blue.svg?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.2-purple.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/Postgres-15%2B-blue.svg?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

ShareBite is a full-stack web application designed to combat food waste by connecting local food businesses (**Donors**) with community members (**Recipients**) to distribute surplus food.

---

## 🌐 Live Demo & Deployments
*   **Frontend Web App:** [https://sharebite-bcmd.onrender.com](https://sharebite-bcmd.onrender.com)
*   **Backend REST API:** [https://sharebite-backend-41ck.onrender.com](https://sharebite-backend-41ck.onrender.com)

---

## ✨ Key Features

*   **Role-Based User Flows:** Tailored dashboards for Donors (to list food) and Recipients (to claim food).
*   **Real-time Countdown Timers:** Dynamic visual timers monitoring listing expiration times.
*   **Secure Pickup Codes:** Auto-generates unique authorization keys for verifying in-person handovers.
*   **Premium Glassmorphic Design:** Sleek dark-mode user interface with responsive layout grids.

---

## 📁 Repository Structure

*   `/backend` - Spring Boot (Java) REST API engine, JWT security filters, and PostgreSQL configurations.
*   `/frontend` - React SPA (Vite) structured with clean reusable components, context stores, and CSS variables.
*   `/deploy_ready` - Clean, source-only project build folder optimized for dragging-and-dropping to GitHub.

---

## 🚀 How to Run Locally

Ensure you have **Java JDK 17+** and **Node.js 18+** installed.

### 1. Run Backend (Spring Boot)
Double-click `run_backend.bat` in `/backend` or run:
```bash
cd backend
mvn spring-boot:run
