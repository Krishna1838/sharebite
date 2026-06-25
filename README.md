# 🍎 ShareBite: Food Waste Reduction & Sharing Platform

This project is a full-stack web application designed to combat food waste by connecting local food businesses (Donors) with community members (Recipients) to distribute surplus food. It features a modern dark-themed glassmorphic user interface, real-time expiration countdown timers, secure JWT authentication, and a secure pickup verification system.

---

## 🚀 Live Demo

🌐 [Click here to try the app](https://sharebite-bcmd.onrender.com)  
⚙️ [Backend API Endpoint](https://sharebite-backend-41ck.onrender.com)  

---

## 🎯 Features

- 🔐 **Role-Based Authentication:** Distinct interfaces and permissions for Donors and Recipients.  
- 📝 **Surplus Food Listing:** Donors can list surplus items with descriptions, location, and dietary tags.  
- ⏳ **Dynamic Countdown Timers:** Listings display active expiration timers updating in real-time.  
- 🤝 **Seamless Claim Flow:** Recipients can browse and claim available surplus food with a single click.  
- 🔐 **Pickup Code Verification:** Auto-generates secure pickup verification codes for safe handover.  
- 🎨 **Glassmorphic Theme:** Stunning dark-mode visual interface with clean animations.  

---

## 🔧 How It Works

1. **Donors** register and list surplus food items, setting an expiration countdown (e.g. 2 hours).  
2. **Recipients** register, browse the active community listings, and claim an item.  
3. Upon claiming, the system generates a secure **Pickup Verification Code** (e.g. `SB-1094`) visible only to the recipient.  
4. The Recipient meets the Donor in person and presents the code.  
5. The Donor enters the code in their dashboard to verify and mark the transaction as completed.  

---

## 📸 Screenshots

**Donor & Recipient Dashboard**  
![Dashboard Screenshot](https://github.com/Krishna1838/ShareBite/blob/main/DASHBOARD.png?raw=true)

**Verify & Handover Modal**  
![Handover Screenshot](https://github.com/Krishna1838/ShareBite/blob/main/VERIFY.png?raw=true)

---

## 🗂 Project Structure

- `backend/` – Spring Boot (Java) REST API server with JWT authentication and PostgreSQL integration  
- `frontend/` – React SPA (Vite) client with custom glassmorphic styling and services  
- `deploy_ready/` – Clean source-only directory optimized for manual GitHub upload  

---

## 📊 Results

- Real-time expiration checking works seamlessly.  
- Fast response with robust REST API architecture.  
- Secure and authorized session states across logouts and logins.  

---

## 👨‍💻 Author

- **Student Name:** Krishna Vardhan Baratam  
- **College Name:** VIT-AP  
- **Email:** krishnavardhanbaratam248@gmail.com

---

## 📄 License

This project is for educational purposes.
