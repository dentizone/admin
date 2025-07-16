

# Dentizone - Admin Dashboard

This repository contains the source code for the **Dentizone Admin Dashboard**, the central control panel for managing the Dentizone e-commerce platform. Built with Angular 20 and styled with Tailwind CSS, this powerful single-page application provides administrators with the tools needed to monitor, manage, and maintain the entire ecosystem.

**[User Frontend Repo](https://github.com/dentizone/user-frontend)** | **[Backend API Repo](https://github.com/dentizone/api)**

## ✨ Key Features

The admin dashboard is a feature-rich application designed for comprehensive platform management.

-   **📊 Analytics Dashboard:**
    -   A central overview of key platform metrics: total users, revenue, post statistics, and pending KYC verifications.
    -   Interactive doughnut charts to visualize **posts by category** and **users by university**.
    -   A live-updating feed of the most recent user activities.

-   **👥 User Management:**
    -   View a paginated list of all platform users.
    -   Search and filter users by status (Active, Blacklisted, Pending, etc.).
    -   Update user account status directly from the dashboard.
    -   View at-a-glance statistics on user states.

-   **📦 Product & Catalog Management:**
    -   **Post Management:** A complete interface to search, filter, and moderate all user-generated posts. Admins can approve, reject, or remove listings.
    -   **Catalog Management:** Full CRUD (Create, Read, Update, Delete) functionality for managing product categories and subcategories to keep the marketplace organized.

-   **💰 Financial Management:**
    -   **Withdrawal Requests:** A dedicated module to review, approve, or reject withdrawal requests from sellers, with the ability to add administrative notes.
    -   **Order Management:** A comprehensive system to view all orders, with advanced filtering by buyer, seller, date, and status. Includes a detailed modal view for individual orders and shipment tracking.

-   **🔧 Platform Administration:**
    -   **University Management:** Easily add, update, and manage the list of supported universities for user registration and verification.
    -   **User Activity Log:** A detailed, filterable log of all user actions on the platform for auditing and monitoring purposes.
    -   **Feedback Review:** A dedicated page to view and analyze user-submitted reviews and feedback with sentiment analysis statistics.

-   **🔐 Secure & Modern Architecture:**
    -   **JWT Authentication:** Secure login for administrators.
    -   **Auth Guard:** Protects all dashboard routes, ensuring only authenticated admins can access the panel.
    -   **HTTP Interceptor:** Automatically attaches the JWT token to all API requests and handles token refresh logic.

## 🛠️ Tech Stack

-   **Framework:** [Angular](https://angular.dev/) v20
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Charting:** [Chart.js](https://www.chartjs.org/) with [ng2-charts](https://valor-software.com/ng2-charts/)
-   **State Management:** [RxJS](https://rxjs.dev/) for reactive state handling.
-   **HTTP Client:** Angular's `HttpClient` with a custom interceptor.

## 🏛️ Project Structure

The project is organized into logical modules to ensure clarity and maintainability.

```
src/app/
├── core/               # Core services, guards, interceptors, and global models.
│   ├── guards/         # Route guards for authentication.
│   ├── interceptors/   # HTTP interceptor for auth tokens.
│   ├── models/         # TypeScript interfaces for data structures.
│   └── services/       # Core singleton services.
│
├── pages/              # Contains all the main views/pages of the dashboard.
│   ├── dashboard/      # The main analytics dashboard view.
│   ├── userManagment/  # User list and management tools.
│   ├── order/          # Order management interface.
│   └── ...             # Other management pages.
│
└── shared/             # Reusable components, layouts, and utilities.
    ├── components/     # Cards, Pagination, Toasts, etc.
    └── layout/         # The main sidebar and header layout component.
```

## 🚀 Getting Started

To get the admin dashboard running locally, follow these steps.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [Angular CLI](https://angular.dev/cli) v20
    ```bash
    npm install -g @angular/cli
    ```
-   A running instance of the [Dentizone Backend API](https://github.com/dentizone/api).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dentizone/admin.git
    cd dentizone-admin
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    The API URLs are configured in `src/environments/environment.ts`. Make sure the `apiBaseUrl` and `analyticsUrl` point to your running backend instance.
    ```typescript
    // src/environments/environment.ts
    export const environment = {
      production: false,
      analyticsUrl: 'http://localhost:5028/api/Analytics', // Example
      apiBaseUrl: 'http://localhost:5028/api',      // Example
    };
    ```

4.  **Run the development server:**
    ```bash
    ng serve
    ```
    Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files. You will be redirected to the `/login` page to authenticate.

## 📦 Build for Production

Run the following command to build the application for production. The optimized build artifacts will be stored in the `dist/` directory.

```bash
ng build --configuration production
```
