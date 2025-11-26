## TeamFinder App (CS-699 Project)

The **TeamFinder App** addresses the difficulty students and professionals face in finding **compatible teammates** for hackathons and competitions. It serves as a unified platform to **browse events, view teams, and efficiently facilitate team creation and matching.**

| Developer | Role |
| :--- | :--- |
| **Alan Babu** (25M0746) | Backend Module |
| **M Ziyad** (25M0747) | Frontend Module |
| **Ragav R** (25M2121) | WebScraping Module |

### **Architecture Summary**

The application follows a full-stack architecture with three main modules:

| Module | Technologies Used | Primary Role |
| :--- | :--- | :--- |
| **Frontend** | **React**, Vite, Material UI, Axios | Provides the **User Interface**, navigation, and handles all user actions (create, join, edit profile). |
| **Backend** | **Django**, Django REST Framework, Python | Manages **Authentication**, defines **Database Models**, and exposes the secured **REST API**. |
| **Web Scraping** | Python, Kaggle API | **Fetches and extracts external event data** from sources like Kaggle and Devpost. |

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
| **`README.md`** | This file providing an overview of the project, setup instructions, and code organization. |
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

# Backend

## Directory Structure

The project follows a standard Django structure, consisting of a **project configuration directory** (`teamfinder`) and one primary **application directory** (`TFapp`).

## Root Directory Files (`/`)

These files manage the overall project environment and execution.

| File | Role |
| :--- | :--- |
| **`.gitignore`** | Specifies files and directories (like virtual environments, compiled Python files) that Git should **ignore** and not commit to the repository. |
| **`manage.py`** | A command-line utility used to interact with the project (e.g., running the development server, performing database migrations, and executing management commands). |
| **`requirements.txt`** | Lists all the Python packages and their versions required to run the project. Used for setting up the environment with `pip install -r requirements.txt`. |

---

## Project Configuration (`teamfinder/`)

This directory acts as the main container for the project-level settings and configuration.

| File | Role |
| :--- | :--- |
| **`settings.py`** | Contains the **configuration** for the Django project, including database settings, installed apps, middleware, template configuration, static files. |
| **`urls.py`** | The **root URL configuration** for the entire project. It routes incoming requests to the appropriate application-specific URL configurations (e.g., those defined in `TFapp/urls.py`). |
| **`wsgi.py`** | Configuration for the **WSGI (Web Server Gateway Interface)** server, used for deploying the application in production environments (e.g., Gunicorn, uWSGI). |
| **`asgi.py`** | Configuration for the **ASGI (Asynchronous Server Gateway Interface)** server, enabling support for asynchronous features like WebSockets. |
| **`__init__.py`** | Marks the directory as a Python package. |

---

## Main Application (`TFapp/`)

This directory contains the core logic, models, views, and functionality of the application.

### Core Application Files

| File | Role |
| :--- | :--- |
| **`models.py`** | Defines the **data models** (database schema) for the application, representing entities like Users, Teams, and Events. |
| **`views/`** | Contains the **view logic** (controllers) that handle HTTP requests, interact with models and serializers, and return HTTP responses. These are further organized by domain: |
| &nbsp; &nbsp; &nbsp; &nbsp; *`event_view.py`* | Handles requests related to **Events**. |
| &nbsp; &nbsp; &nbsp; &nbsp; *`membership_view.py`* | Handles requests related to **Team/Event Memberships**. |
| &nbsp; &nbsp; &nbsp; &nbsp; *`team_view.py`* | Handles requests related to **Teams**. |
| &nbsp; &nbsp; &nbsp; &nbsp; *`user_view.py`* | Handles requests related to **Users**. |
| **`urls.py`** | The **URL patterns** specific to the `TFapp` application, mapping URLs to the views defined in the `views/` directory. |
| **`serializers.py`** | Defines classes using Django REST Framework for translating data types (like models) into native Python data types that can be easily rendered into JSON/XML, and *vice versa*. |
| **`admin.py`** | Registers models with the Django **Admin interface**, allowing them to be managed via the web-based backend. |
| **`apps.py`** | Contains the **configuration** for the `TFapp` application. |
| **`permissions.py`** | Defines custom **access rules** and authorization logic (e.g., "only team admins can edit the team"). |
| **`adapters.py`** | Contains an adapter for djang-allauth, for email verfication. |
| **`scheduler.py`** | Implements logic for **scheduling tasks** that run at set intervals, for generating recommendations and scarping events. |
| **`tests.py`** | For Unit tests(not used). |
| **`__init__.py`** | Marks the directory as a Python package. |

### Sub-directories

| Directory/Files | Role |
| :--- | :--- |
| **`migrations/`** | Contains files that store **database schema changes** (migrations) generated by Django. These files are used to apply or undo changes to the database structure. |
| &nbsp; &nbsp; &nbsp; &nbsp; *`000*` files* | Individual migration steps (e.g., adding a field, creating a table, modifying a model). |
| **`recommendation/`** | Houses the logic for generating **recommendations**. |
| &nbsp; &nbsp; &nbsp; &nbsp; *`fasttext.py`* | Uses the **FastText** model for generating word and sentence embeddings which are used for the recommendation logic. |
| **`Scraping/`** | Contains scripts designed to **extract data** from external websites. |
| &nbsp; &nbsp; &nbsp; &nbsp; *`DevpostScrap.py`* | A script specifically for scraping data from the **Devpost** platform. |
| &nbsp; &nbsp; &nbsp; &nbsp; *`Webscrap.py`* | A script specifically for scraping data from the **Kaggle** platform. |

# WebScraping
Contains script used for initially testing scraping, moved to `backend/TFapp/Scraping`
