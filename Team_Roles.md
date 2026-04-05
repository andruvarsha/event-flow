# EventFlow: Team Roles & Responsibilities

The successful development and deployment of the EventFlow ecosystem require a balanced distribution of work. Below is the breakdown of the project divided among a 4-member team, detailing each member's core responsibilities and documentation requirements.

---

## 👨‍💻 Member 1 – Project Lead & Frontend Developer
**Focus:** Project Architect, React Strategy, and Core UI Implementation.

### Responsibilities:
*   **Project Architecture:** Setup the Vite + React frontend environment and establish the initial folder structure.
*   **State Management:** Implement the core React Context API (`AuthContext`, `EventContext`) to manage global user state and application data.
*   **Core UI Development:** Build the primary user interfaces, including the Dashboard, Navigation bars, and reusable components (Buttons, Modals).
*   **Integration:** Map frontend services to backend endpoints using Axios, ensuring API calls correctly handle JWT tokens and intercept unauthorized responses globally.
*   **Code Review & Merge:** Act as the primary gatekeeper for the GitHub repository, reviewing Pull Requests and resolving merge conflicts.

### Documentation Work:
*   Write the comprehensive project `README.md` outlining the tech stack, setup instructions, and architecture.
*   Document the Frontend folder structure and React component hierarchy.

---

## 🎨 Member 2 – UI/UX Specialist & Frontend Developer
**Focus:** Visual Design, User Experience, and Animations.

### Responsibilities:
*   **Design System:** Establish the visual language, typography, and color palette (e.g., dark-themed, glassmorphism aesthetics).
*   **Responsive Design:** Ensure the application is fully responsive and looks professional on all devices (mobile, tablet, desktop).
*   **Animations:** Implement subtle CSS animations and interactions using libraries like `framer-motion` to enhance the modern feel of the application.
*   **Specific Views:** Develop specialized components such as the "My Events" interactive dashboard, intelligent search bars, and complex filtering UIs.
*   **Accessibility:** Ensure the application meets basic accessibility standards (alt text, ARIA labels where necessary, keyboard navigation).

### Documentation Work:
*   Maintain a design system document or style guide.
*   Write documentation on how to use reusable UI components (e.g., how to implement the standard Button or Card component).

---

## ⚙️ Member 3 – Backend Developer & API Engineer
**Focus:** Express.js Logic, Express Routing, and Security.

### Responsibilities:
*   **Server Setup:** Initialize the Node.js/Express server and configure essential middleware (CORS, body parsing).
*   **API Routing:** Design and implement robust RESTful API endpoints for Authentication (`/api/auth`), Events (`/api/events`), and Registrations (`/api/registrations`).
*   **Authentication Logic:** Implement highly secure login and registration flows, including domain-specific email enforcement, password hashing (bcrypt), and JWT generation.
*   **Middleware:** Develop custom middleware for protecting routes (verifying JWTs) and validating user roles (Student vs. Admin).

### Documentation Work:
*   Write the comprehensive **API Reference Document**. This must detail every endpoint, requested payloads, required headers (JWT), and expected JSON responses.

---

## 🗄️ Member 4 – Database Engineer & Backend Integrator
**Focus:** MongoDB Schemas, Transaction Logic, and Deployment. 

### Responsibilities:
*   **Database Design:** Design and implement Mongoose schemas focusing on data integrity (Users, Events, Registrations).
*   **Complex Queries & Transactions:** Write the logic to ensure atomic updates (e.g., decrementing event capacity during registration without race conditions) and preventing duplicate registrations via compound unique indexes.
*   **Data Validation:** Implement strict Mongoose schema validations to drop malicious or poorly formatted payloads before insertion.
*   **Deployment Operations:** Manage environment variables and handle the deployment pipeline to host the backend (e.g., Render/Heroku) and the database (MongoDB Atlas).

### Documentation Work:
*   Create detailed **Database Schema Documentation**, illustrating the collections, their fields, constraints, and how they relate (e.g., the Many-to-Many relationship between Users and Events via the Registration junction).
*   Document the step-by-step **Deployment Guide** and environment variable setup for production.
