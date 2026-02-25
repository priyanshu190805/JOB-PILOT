# JobPilot - Employer Portal

JobPilot is a modern, full-stack recruitment platform tailored for employers. Built with a focus on type safety using **TypeScript** across the entire stack, it provides a seamless experience for posting jobs, managing listings, and tracking applicants. The project is engineered with a mobile-first philosophy, ensuring high performance and visual excellence across all devices.

## 📖 Brief Project Overview
JobPilot serves as a bridge between employers and talent. It automates the job lifecycle—from initial account setup and company branding (logo uploads) to active job management. The system is designed to handle complex data like multi-state location mapping, advanced search queries, and dynamic filtering, all while providing a premium, animated user experience.

---

## 🚀 Tech Stack

### Frontend
- **Language**: TypeScript - Ensuring type safety and better developer experience.
- **Framework**: Next.js (App Router) - For server-side rendering and optimized performance.
- **State Management**: Redux Toolkit - Centralized state for auth and job data.
- **Styling**: Tailwind CSS 4 - Aesthetically pleasing, utility-first design.
- **Animations**: 
  - **GSAP**: High-performance entrance and scroll-based animations.
  - **Framer Motion**: Smooth component transitions, layout changes, and modal interactions.
- **Icons**: Lucide React - Modern, consistent iconography.
- **Location Data**: `country-state-city` - Comprehensive global database.
- **Hosting**: AWS Amplify - Continuous deployment and hosting.

### Backend
- **Environment**: Node.js & TypeScript
- **Framework**: Express.js - Robust API middleware and routing.
- **Database**: MongoDB & Mongoose - NoSQL flexibility for job dynamic schemas.
- **Storage**: AWS S3 - Scalable cloud storage for logos.
- **Authentication**: JWT-based security with password hashing.
- **Hosting**: Railway - High-performance backend deployment.

---

## ✨ Key Features & Technical Highlights

### 📝 CRUD Features & Management
- **Full Lifecycle**: Create, Read, Update, and Delete jobs with real-time state updates.
- **Job Status Tracking**: Automated calculation of "Time Remaining" (e.g., "Expiring in 5 days" vs "Expired").

### 🔐 Authentication & Security
- **Secure Auth**: JWT (JSON Web Tokens) are used for session management, ensuring only authorized employers can manage their specific jobs.
- **Protected Routes**: Middleware verifies user tokens for every sensitive API request.

### 🖼️ AWS S3 Logo Configuration
- **S3 Integration**: Uses `@aws-sdk/client-s3` and `multer-s3` to handle image uploads directly to the cloud.
- **Optimized Storage**: Logos are stored in a dedicated `logos/` subdirectory with unique timestamps to prevent collisions.

### 🔍 Search, Pagination & Filtering
- **Dynamic Search**: Search across multiple fields (Title, Role, Education, Country) with case-insensitive regex.
- **Advanced Filters**: A robust filtering system allowing simultaneous narrowing by Job Type, Level, Status, Work Type (Remote/On-site), Experience, and Education.
- **Server-Side Pagination**: Efficiently handles large datasets by fetching only needed jobs per page.

### 📱 Mobile Responsiveness & Components
- **Hybrid UI**: 
  - **`JobTable.tsx`**: A detailed, information-dense table for desktop view.
  - **`JobCard.tsx`**: A **mobile-only** card-based component that optimizes vertical space and readability on small screens.
- **Touch-Friendly**: Large interactive targets and responsive layouts built using Tailwind's `md:` and `lg:` prefixes.

### ✅ Custom Validations & Logic
- **Interactive Forms**: Custom validation logic for job salaries, dates, and required fields.
- **Specialized Inputs**: Integration of `react-phone-input-2` for international phone formatting.
- **Location Selectors**: Uses `country-state-city` to provide cascading dropdowns (choosing a country updates the available states).

---

## 🏗️ Technical Architecture & Workflow

JobPilot follows a structured, layered architecture to maintain clear separation of concerns between the frontend UI and backend business logic.

### 🟢 Frontend: State & API Layer

The frontend is built with **Next.js** and uses a modular approach for data management:

- **Redux Slices (`src/store/`)**: 
  - **`authSlice`**: Manages global user authentication state, tokens, and persistent login sessions.
  - **`jobSlice`**: Handles the global collection of jobs, current job details, and real-time CRUD feedback.
  - **`companySlice`**: Manages company profile information and logo states.
  - **Workflow**: Slices utilize `createAsyncThunk` to dispatch asynchronous API requests and update the global store based on the results.

- **API Services (`src/services/`)**: 
  - Centralized **Axios** instances communicate with the backend. These services abstract away the HTTP complexities, handling headers (like JWT tokens) and error parsing before passing data back to the Redux Slices.

### 🔵 Backend: Route & Controller Pattern

The backend is organized into a clean 3-layer pattern for scalability and maintainability:

- **API Routes (`src/routes/`)**: 
  - Entry points for all frontend requests. These files define the URL structure (e.g., `/api/jobs`, `/api/auth`) and apply security **Middleware** (like `protect` for JWT verification) before passing the request to the controllers.

- **Controllers (`src/controllers/`)**: 
  - The "brain" of the backend. They process incoming data, interact with **Mongoose Models**, execute business logic (like salary parsing or date validation), and return structured JSON responses to the frontend.

- **Utils (`src/utils/`)**: 
  - Shared helper functions (e.g., `jobHelpers.ts`) used by controllers for common tasks like data formatting or time calculations.

---

## � Project Directory Mapping

### 🔙 Backend Architecture (`job-pilot-be/src`)

| Layer | Responsibility | Key Files |
| :--- | :--- | :--- |
| **Models** | Database schemas for MongoDB/Mongoose. | `User.ts`, `Company.ts`, `Job.ts` |
| **Routes** | API entry points and route protection. | `authRoutes.ts`, `companyRoutes.ts`, `jobRoutes.ts` |
| **Controllers** | Core business logic and request handling. | `authController.ts`, `companyController.ts`, `jobController.ts` |
| **Utils** | Shared logic for all controllers. | `jobHelpers.ts` |

### 🚀 Frontend Architecture (`jobpilot-fe/src`)

#### 📄 Pages & Routing (`app/`)
- `/` - **Landing Page**: Animated hero section and employer introduction.
- `/account-setup` - **Onboarding**: Multi-step form for company profile configuration.
- `/dashboard/overview` - **Overview**: Summary cards and recent job activity.
- `/dashboard/post-jobs` - **Job Editor**: Feature-rich form for creating new listings.
- `/dashboard/my-jobs` - **Management**: List of all posted jobs with filtering/search.
- `/dashboard/edit-job/[id]` - **Edit**: Dynamic route for updating existing job details.

#### 🧩 Components (`components/`)
- **Navigation**: `Navbar`, `Sidebar`, `BottomBar` (Mobile).
- **UI Elements**: `Dropdown`, `SuccessPopup`, `ConfirmationModal`, `DeleteModal`.
- **Data Display**: `JobTable` (Desktop), `JobCard` (Mobile).
- **Global**: `Providers` (Redux & Framer Motion wrapper).

#### 🧪 State Management & Logic
- **Services (`services/`)**: `authService.ts`, `companyService.ts`, `jobService.ts`.
- **Redux Slices (`store/`)**: `authSlice.ts`, `companySlice.ts`, `jobSlice.ts`.
- **Types & Enums (`types/`)**: `enums.ts`, `job.ts`.

---

## �🛠️ Setup Instructions

### Backend Setup (`job-pilot-be`)
1. `cd job-pilot-be`
2. `npm install`
3. Configure `.env` (Mongo URI, JWT Secret, AWS Credentials).
4. `npm run dev`

### Frontend Setup (`jobpilot-fe`)
1. `cd jobpilot-fe`
2. `npm install`
3. Configure `.env.local` (`NEXT_PUBLIC_API_URL`).
4. `npm run dev`
