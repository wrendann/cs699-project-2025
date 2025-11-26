# cs699-project-2025

TeamFinder App

This app will help you find, join or create teams, for various events and competitions.

To be developed using Django backend and a React frontend.

Events will be scraped from different websites like Kaggle.

Done by,

* Ragav R - 25M2121
* M ziyad - 25M0747
* Alan - 25M0746


Resumes will be automatically analyzed and teams can set tags to filter candidates.

We will be using the default sqlite Django database initially.

# Frontend

## Directory Structure

The project follows a standard structure for a front-end application:

* **`/` (Root):** Contains configuration files, package manifests, and the main entry point HTML.
* **`public/`:** Holds static assets that are served directly at the root, often without being processed by the build tool.
* **`src/`:** Contains the main source code of the application, including JavaScript/React components, styles, and utility modules.

---

## Root Level Files

These files manage dependencies, configuration, and the initial application loading.

| File Name | Role |
| :--- | :--- |
| **`.gitignore`** | Specifies files and directories that should be **ignored** by Git (e.g., `node_modules/`, build artifacts). |
| **`eslint.config.js`** | Configuration for **ESLint**, used for static code analysis to enforce coding standards and find potential errors. |
| **`index.html`** | The **main HTML file** that serves as the entry point for the web application. The built JavaScript bundle will be injected here. |
| **`package.json`** | Defines project **metadata**, scripts (e.g., `start`, `build`), and lists all project **dependencies** and dev dependencies. |
| **`package-lock.json`** | Records the exact version tree of the installed dependencies, ensuring reproducible builds across different environments. |
| **`README.md`** | **This file**, providing an overview of the project, setup instructions, and code organization. |
| **`vite.config.js`** | Configuration file for **Vite**, the build tool, managing bundling, development server setup, and plugins. |

---

## `public/` Directory

This directory contains static assets.

| File Name | Role |
| :--- | :--- |
| **`vite.svg`** | A static image asset, currently the default **Vite logo**, served directly. |

---

## `src/` Directory

This directory holds the core application logic and presentation.

### Main Source Files in `src/`

| File Name | Role |
| :--- | :--- |
| **`main.jsx`** | The **main entry point** for the React application. It handles importing global styles, configuring routing, and rendering the root component (`<App />`) into `index.html`. |
| **`App.jsx`** | The **root component** of the React application. It contains the primary layout, routing setup, and acts as a container for all other components. |
| **`index.css`** | Global CSS styles applied across the entire application. |

---

### `src/assets/` Directory

This directory stores images and other static media that are bundled and processed by the build tool.

| File Name | Role |
| :--- | :--- |
| **`react.svg`** | An image asset, likely the **React logo**. |
| **`src/assets/sidebar/`** | A dedicated folder for image assets used specifically in the **SideBar** component, such as navigational icons (`dashboardicon.png`, `events.png`, etc.) and the application **`logo.png`**. |

---

### `src/components/` Directory

This is the central location for all **reusable React components** that make up the application's UI.

| Component Group | Files | Role |
| :--- | :--- | :--- |
| **Layout/Navigation** | `SideBarManager.jsx`, `TopBar.jsx` | Define the main structure and navigation elements of the application. |
| **Feature Pages** | `Dashboard.jsx`, `Events.jsx`, `PastEvents.jsx`, `EventPage.jsx`, `Teams.jsx`, `TeamPage.jsx`, `Profile.jsx` | Components that represent **main views** or pages in the application. |
| **Forms/Actions** | `AddNewEvent.jsx`, `AddNewTeam.jsx`, `PopUpForm.jsx` | Components handling user input for creating new records or managing data rendered in a modal or pop-up. |
| **Authentication** | `Signin.jsx`, `ForgotPassword.jsx` | Components for user **login** and **password recovery**. |
| **Smaller UI Elements** | `EventMiniBox.jsx`, `TeamDetailBox.jsx` | Reusable components that display summarized information for an event or a team. |

---

### `src/services/` Directory

This directory contains utility modules responsible for handling **data fetching** and interacting with the backend **API**. This separation keeps API logic out of the UI components.

| File Name | Role |
| :--- | :--- |
| **`apiClient.js`** | Sets up and configures the **base API client** (e.g., using Axios). It handles headers, authentication tokens, and base URL configuration. |
| **`events.js`** | Contains functions for making API calls related to **event management** (e.g., fetching all events, creating a new event, viewing event details). |
| **`teams.js`** | Contains functions for making API calls related to **team management**. |
| **`users.js`** | Contains functions for API calls related to user accounts, such as **signup** or user details. |
| **`profile.js`** | Contains functions for API calls specifically for fetching or updating the current **user's profile** data. |
| **`resetPassword.js`** | Contains functions for handling the API calls required for the **password reset** process. |

***