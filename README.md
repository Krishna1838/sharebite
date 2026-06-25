# ShareBite 🍎 (Food Waste Reduction & Sharing Platform)

ShareBite is a full-stack web application designed to connect local food businesses (Donors) with people in the community (Recipients) to redistribute surplus food that would otherwise be discarded. 

This project is a beginner-friendly starter template demonstrating how to build web applications using **Spring Boot (Java)** for secure APIs and **React (JavaScript)** for a responsive, modern frontend dashboard.

---

## 🛠️ The Technology Stack

### 1. Backend: Spring Boot 3.x
*   **Java JDK 17+**: The coding language and platform.
*   **Spring Data JPA**: Simplifies database communication by mapping database tables to Java objects.
*   **Spring Security & JWT**: Manages user logins, hashes passwords, and issues secure **JSON Web Tokens (JWT)**.
*   **H2 Database**: An in-memory database that runs *inside* the backend application itself. **No installation required!** (Resets on restarts).

### 2. Frontend: React + Vite
*   **React 18**: A library for building user interfaces using reusable building blocks (components).
*   **Vite**: A extremely fast build tool that bundles and runs the React site locally.
*   **Vanilla CSS**: Custom styling variables, glassmorphic cards, custom animations, and responsive grids.
*   **Lucide React**: Vector icons used throughout the UI.

---

## 📁 Understanding the File Structure

If you're new to full-stack development, here is what the folders and classes mean:

### Backend Structure (`/backend`)
*   **`model/` (Entities)**: Classes representing database tables. For example, `User.java` maps to the `users` table and `FoodListing.java` maps to the `food_listings` table.
*   **`repository/`**: Interfaces that act as database bridges. They let us perform database actions (like `userRepository.save()` or `findByUsername()`) without writing raw SQL.
*   **`dto/` (Data Transfer Objects)**: Simple classes used to structure the JSON data sent over network requests (e.g. `RegisterRequest`, `ListingDto` to avoid circular references).
*   **`service/`**: Holds the core "business logic" (e.g., checking if a username is already taken, generating random pickup codes, validating expiration times).
*   **`controller/`**: The gateway of our API. Exposes HTTP web addresses (endpoints like `/api/auth/login` or `/api/listings`) that the React frontend calls to fetch/send data.
*   **`security/` & `config/`**: Sets up security filters. Every time React sends an API request, the filter intercepts it, reads the JWT token, and checks if the user is authorized.

### Frontend Structure (`/frontend`)
*   **`src/main.jsx`**: The main entryway that mounts the React app on the browser page.
*   **`src/App.jsx`**: The root component. It reads if a user is logged in, and decides whether to show the Login page or the Dashboard.
*   **`src/context/AuthContext.jsx`**: A global state store. It handles saving the login token (`localStorage`) so users stay logged in when they refresh the page.
*   **`src/services/api.js`**: Helper file containing all `fetch()` calls. It automatically attaches the JWT login token to the request headers.
*   **`src/components/`**: Reusable parts of the screen:
    *   `Navbar.jsx`: Displays top branding, active tabs, and user profile role badges.
    *   `ListingCard.jsx`: Individual food package card displaying details, tags, active countdowns, and claim buttons.
    *   `Modal.jsx`: Lightbox window that floats on top of the page for forms.
*   **`src/pages/`**: The different screen views (Login, Registration, Main Dashboard, Claims History).

---

## 🚀 How to Run the Project Locally

Follow these steps to run both parts of the application:

### Step 1: Start the Backend (Spring Boot)
1. Open your terminal/command prompt.
2. Navigate into the backend folder:
   ```bash
   cd C:\Users\vardh\.gemini\antigravity\scratch\sharebite\backend
   ```
3. Run the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
4. Once you see the message `Started ShareBiteApplication in X seconds`, the backend is active at **`http://localhost:8080`**.

> [!TIP]
> **Inspect the Database**: You can view the live database tables in your web browser! Go to **`http://localhost:8080/h2-console`**. 
> *   **JDBC URL**: Change this line to `jdbc:h2:mem:sharebitedb`
> *   **Username**: `sa`
> *   **Password**: *Leave blank*
> *   Click **Connect** to see the tables!

---

### Step 2: Start the Frontend (React)
1. Open a **second** terminal/command prompt (keep the first one running the backend!).
2. Navigate into the frontend folder:
   ```bash
   cd C:\Users\vardh\.gemini\antigravity\scratch\sharebite\frontend
   ```
3. Install the required Node packages:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to **`http://localhost:3000`** to view the app!

---

## 🧪 Try out the Full Application Flow

To test the application as it was intended:

1.  **Register a Donor Account**:
    *   Go to **`http://localhost:3000`**, click **Create one free**.
    *   Select **Donor**.
    *   Fill out the username (e.g. `baker1`), email (`baker@test.com`), password (`123456`), and business name (e.g. `Sweet Crumb Bakery`).
    *   Submit and wait to load into the Donor Dashboard.
2.  **Post Surplus Food**:
    *   Click **List Surplus Food**.
    *   Enter: Title (`Box of 6 Glazed Donuts`), Quantity (`1 Box`), Expiration (`2 Hours`), Address (`12 Main St`), check `Vegetarian`.
    *   Click **Publish Listing**. The card will appear in your dashboard with an active countdown!
3.  **Register a Recipient Account**:
    *   Click **Sign Out** to exit the donor account.
    *   Click **Create one free** and register a **Recipient** account (e.g. username `alice`, password `123456`).
4.  **Claim the Food**:
    *   On Alice's dashboard, browse the community listings. You will see the donuts posted by Sweet Crumb Bakery.
    *   Click **Claim Surplus Food**.
    *   A success modal will appear displaying your secure **Pickup Verification Code** (e.g., `SB-4820`).
    *   Go to the **My Claims** tab to view your claim and pickup code anytime.
5.  **Donor Verification**:
    *   Sign out of Alice's account, and log back into the donor account (`baker1`).
    *   You will see that the Donuts listing status has changed to **Claimed** by `@alice`.
    *   Click **Verify Pickup Code**, enter `SB-4820`, and click **Verify & Handover**.
    *   The transaction is verified, and the food status changes to **Completed**!
