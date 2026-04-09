# Utilities Dashboard

A comprehensive personal finance and utility management application built with **React**, **TypeScript**, and **Firebase**. This application helps users track monthly utility payments across multiple addresses, visualize expenditure trends, and manage property details efficiently.

## 🚀 Key Features

- **📊 Interactive Dashboard**:
  - Visual analytics using **MUI X Charts**.
  - Track revenue, user stats, and monthly trends.
  - Dynamic context switching between different property addresses.
- **🏠 Address Management**:
  - Create and manage multiple property profiles.
  - Store detailed address information (City, Street, House/Flat numbers).
- **🧾 Utility Tracking**:
  - Record monthly payments for various services (Rent, Internet, Gas, etc.).
  - Support for different currencies.
  - Historical year archives.
- **🌍 Internationalization (i18n)**:
  - Full support for **English** and **Ukrainian** languages.
  - Instant language switching via Settings.
- **🎨 UI/UX**:
  - Modern, responsive design using **Material-UI (MUI)**.
  - Dark Mode support (customizable theme).
  - Seamless modal-based interactions for data entry.
- **🔐 Security**:
  - Authentication powered by **Firebase Auth**.
  - Secure data storage with **Cloud Firestore**.
  - Admin controls with role-based page access management.
- **💾 Data Management**:
  - Backup and restore address data via JSON export/import.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TypeScript
- **UI Framework**: Material UI (MUI)
- **State Management**: React Hooks & Context API
- **Database**: Firebase Firestore
- **Auth**: Firebase Auth
- **Routing**: React Router DOM v7
- **Charts**: MUI X Charts
- **Notifications**: React Toastify
- **I18n**: i18next, react-i18next
- **Forms**: React Hook Form

## 📂 Project Structure

```
src/
├── app/             # App entry point, routing, and global providers
├── assets/          # Static assets
├── components/      # Reusable UI components (Charts, Modals, Inputs)
├── constants/       # Global constants and theme definitions
├── controller/      # Logic controllers (e.g., Modal state)
├── features/        # Feature-specific logic (addresses, utilities)
├── firebase/        # Firebase configuration and Firestore API wrappers
├── helpers/         # Utility functions
├── hooks/           # Custom React hooks
├── i18n/            # Internationalization setup and locales (en/uk)
├── pages/           # Main page views (Dashboard, Address, Auth, Info, Rental, Settings, Users)
├── types/           # TypeScript interfaces and type definitions
└── main.tsx         # Application root
```

## ⚡ Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

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
    - Ensure you have a `firebaseConfig` set up in `src/firebase/firebase.config.ts`.
    - _Note: You may need to create a project in the [Firebase Console](https://console.firebase.google.com/) and enable Firestore and Auth._

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

## GitHub Copilot Agents

### Agents

#### Code Reviewer

Reviews the currently open file for bugs, type-safety issues, security vulnerabilities (OWASP), and violations of project conventions (TypeScript strict, component/hook/API/test patterns). Returns a structured report with severity-tagged findings and concrete fix suggestions — does NOT edit files.

**How to invoke:**

1. Open the file you want reviewed.
2. Open the Copilot Chat panel.
3. Switch the agent to **Code Reviewer** using the agent picker.
4. Send a message like "review this file".

---

#### Performance Analyzer

Memory-focused performance analysis for the currently open file. Detects memory leaks, component lifecycle issues, missing cleanup, event listener problems, and React re-render inefficiencies. Generates a detailed report with metrics, bottlenecks, and prioritized recommendations — can apply optimizations automatically.

**How to invoke:**

1. Open the file you want analyzed.
2. Open the Copilot Chat panel.
3. Switch the agent to **Performance Analyzer** using the agent picker.
4. Send a message like "analyze this file for memory leaks".

---

#### Readme Updater

Keeps README.md in sync whenever a new prompt (.prompt.md) or agent (.agent.md) is added or changed. Reads all files in .github/prompts/ and .github/agents/, then updates the "GitHub Copilot Agents" section in README.md to reflect the current state — without touching any other section.

**How to invoke:**

1. Open the Copilot Chat panel.
2. Switch the agent to **Readme Updater** using the agent picker.
3. Send a message like "update the readme".

---

#### Refactoring Specialist

Restructures code to follow project conventions after Code Reviewer identifies improvements. Extracts components/hooks, renames for clarity, converts patterns, and improves file organization — preserves behavior, verifies with tests.

**How to invoke:**

1. Open the file you want refactored.
2. Open the Copilot Chat panel.
3. Switch the agent to **Refactoring Specialist** using the agent picker.
4. Send a message describing the refactor you want.

---

#### Security Auditor

Deep security analysis for the currently open file. Identifies OWASP Top 10 vulnerabilities, secrets exposure, injection flaws, authentication bypasses, and insecure dependencies. Returns a threat-prioritized report with exploit scenarios and remediation steps — does NOT edit files.

**How to invoke:**

1. Open the file you want audited.
2. Open the Copilot Chat panel.
3. Switch the agent to **Security Auditor** using the agent picker.
4. Send a message like "audit this file for security issues".

---

### Prompts

_No prompts directory found; no slash commands available._
