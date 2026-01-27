# Utilities Dashboard

A comprehensive personal finance and utility management application built with **React**, **TypeScript**, and **Firebase**. This application helps users track monthly utility payments across multiple addresses, visualize expenditure trends, and manage property details efficiently.

## 🚀 Key Features

*   **📊 Interactive Dashboard**:
    *   Visual analytics using [Recharts](https://recharts.org/).
    *   Track revenue, user stats, and monthly trends.
    *   Dynamic context switching between different property addresses.
*   **🏠 Address Management**:
    *   Create and manage multiple property profiles.
    *   Store detailed address information (City, Street, House/Flat numbers).
*   **🧾 Utility Tracking**:
    *   Record monthly payments for various services (Rent, Internet, Gas, etc.).
    *   Support for different currencies.
    *   Historical year archives.
*   **🌍 Internationalization (i18n)**:
    *   Full support for **English** and **Ukrainian** languages.
    *   Instant language switching via Settings.
*   **🎨 UI/UX**:
    *   Modern, responsive design using **Material-UI (MUI)**.
    *   Dark Mode support (customizable theme).
    *   Seamless modal-based interactions for data entry.
*   **🔐 Security**:
    *   Authentication powered by **Firebase Auth**.
    *   Secure data storage with **Cloud Firestore**.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), TypeScript
*   **UI Framework**: Material UI (MUI)
*   **State Management**: React Hooks & Context API
*   **Database**: Firebase Firestore
*   **Auth**: Firebase Auth
*   **Charts**: Recharts
*   **I18n**: i18next, react-i18next
*   **Forms**: React Hook Form

## 📂 Project Structure

```
src/
├── app/             # App entry point, routing, and global styles
├── components/      # Reusable UI components (Charts, Modals, Inputs)
├── constants/       # Global constants and theme definitions
├── controller/      # Logic controllers (e.g., Modal state)
├── firebase/        # Firebase configuration and Firestore API wrappers
├── i18n/            # Internationalization setup and locales (en/uk)
├── pages/           # Main page views (Dashboard, Address, Auth, Settings)
├── types/           # TypeScript interfaces and type definitions
└── main.tsx         # Application root
```

## ⚡ Getting Started

### Prerequisites

*   Node.js (v16+)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd utilities
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Firebase Configuration**:
    *   Ensure you have a `firebaseConfig` set up in `src/firebase/firebase.config.ts`.
    *   *Note: You may need to create a project in the [Firebase Console](https://console.firebase.google.com/) and enable Firestore and Auth.*

4.  Run the development server:
    ```bash
    npm run dev
    ```

## 🌍 Language Support

The application automatically detects the browser language but defaults to **English**.
You can switch to **Ukrainian** at any time by navigating to the **Settings** page.

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
