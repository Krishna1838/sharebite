# ShareBite 🍎
### *Food Waste Reduction & Sharing Platform*

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.2-green.svg?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-blue.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.2-purple.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/Postgres-15%2B-blue.svg?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

### 🌐 Live Deployments
*   **Frontend Web App:** [https://sharebite-bcmd.onrender.com](https://sharebite-bcmd.onrender.com)
*   **Backend API Service:** [https://sharebite-backend-41ck.onrender.com](https://sharebite-backend-41ck.onrender.com)

---

**ShareBite** is a full-stack, real-time web application designed to combat food waste by connecting local food businesses (**Donors**) with community members (**Recipients**) to distribute surplus food. 

It features secure role-based JWT authentication, a modern dark-themed glassmorphic user interface, real-time expiration countdown timers, and a secure pickup verification system.

---

## 📸 Application Flow & User Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Donor
    participant Server as Spring Boot API
    actor Recipient

    Donor->>Server: Register / Log In as Donor
    Recipient->>Server: Register / Log In as Recipient
    
    Donor->>Server: List Surplus Food (Set expiry, location, tags)
    Note over Server: Status: AVAILABLE (with countdown)
    
    Recipient->>Server: Search & Claim Food Listing
    Note over Server: Status: CLAIMED (Generates unique code)
    Server-->>Recipient: Returns Pickup Verification Code (e.g. SB-1094)
    
    Note over Donor, Recipient: Recipient meets Donor at store location
    Recipient->>Donor: Presents Pickup Verification Code
    
    Donor->>Server: Submit Code for Verification
    Note over Server: Status: COMPLETED
    Server-->>Donor: Confirm successful handover
