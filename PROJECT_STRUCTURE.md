# 📁 Project Structure
advanced_mern/
├── 📂 client/ # React TypeScript Frontend
│ ├── 📂 src/
│ │ ├── 📂 api/ # API clients and services
│ │ │ ├── rpcClient.ts # RPC client configuration
│ │ │ └── simpleClient.ts # Simplified REST API client
│ │ ├── 📂 components/ # Reusable React components
│ │ │ ├── 📂 Emergency/ # Emergency-related components
│ │ │ ├── 📂 Navigation/ # App navigation components
│ │ │ ├── 📂 Safety/ # Safety feature components
│ │ │ └── 📂 ...others
│ │ ├── 📂 hooks/ # Custom React hooks
│ │ ├── 📂 pages/ # Main app pages
│ │ │ ├── EmergencyContactsPage.tsx
│ │ │ ├── EvidenceRecorderPage.tsx
│ │ │ ├── HomePage.tsx
│ │ │ ├── LocationSharingPage.tsx
│ │ │ ├── SafetyAssessmentPage.tsx
│ │ │ ├── SafetyPlanPage.tsx
│ │ │ └── ...others
│ │ ├── 📂 store/ # State management (Zustand)
│ │ │ ├── authStore.ts
│ │ │ └── panicStore.ts
│ │ ├── 📂 utils/ # Utilities and helpers
│ │ │ ├── storage.ts
│ │ │ ├── useSocket.ts
│ │ │ └── ...others
│ │ └── main.tsx # App entry point
│ ├── index.html
│ ├── package.json
│ ├── vite.config.ts
│ └── vercel.json # Vercel deployment config
│
├── 📂 server/ # Node.js Express Backend
│ ├── app.js # Main server file (production)
│ ├── 📂 src/ # TypeScript source (development)
│ │ ├── index.ts # Main server entry point
│ │ ├── 📂 config/ # Configuration files
│ │ │ └── database.ts # MongoDB connection
│ │ ├── 📂 utils/ # Server utilities
│ │ │ └── logger.ts # Logging utility
│ │ └── ...other source files
│ ├── 📂 dist/ # Compiled JavaScript (production)
│ ├── package.json
│ └── tsconfig.json # TypeScript configuration
│
├── 📄 .gitignore
├── 📄 README.md
├── 📄 PROJECT_STRUCTURE.md
└── 📄 SETUP.md

text

## 🔧 Key Files Description

### Frontend (Client)
- **simpleClient.ts** - Main API communication with backend
- **EvidenceRecorderPage.tsx** - Evidence collection interface
- **EmergencyContactsPage.tsx** - Kenya emergency contacts
- **SafetyPlanPage.tsx** - Safety planning interface
- **authStore.ts** - User authentication and session management

### Backend (Server)
- **app.js** - Production server with REST API endpoints
- **src/index.ts** - Development server source
- **/api/evidence** - Evidence saving endpoint
- **/api/safehouses** - Safe locations data
- **/api/contacts** - Emergency contacts
- **/api/panic** - Emergency alert system

## 🗂️ Deployment Structure
- **Frontend:** Static files served from Vercel CDN
- **Backend:** Node.js server running on Render.com
- **Database:** MongoDB Atlas cloud database
- **Environment:** Separate config for development and production
