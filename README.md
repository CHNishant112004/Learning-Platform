# Saathi Learn - AI Learning Platform (React + .NET + MSSQL)

## 1. Folder Structure
```
.
├── backend
│   └── LearningPlatform.Api
│       ├── Controllers
│       ├── Data
│       ├── Models
│       ├── Program.cs
│       └── appsettings.json
└── frontend
    ├── index.html
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    └── src
        ├── components
        ├── context
        ├── data
        ├── pages
        ├── services
        ├── App.jsx
        ├── index.css
        └── main.jsx
```

## 2. Component Breakdown
- **Header**: brand, language display, simple sticky navigation.
- **BottomNav**: mobile-first tabs for Home, Courses, Live, Notebook AI, Profile.
- **CourseCard**: course info + progress bar.
- **ChapterList**: shows chapters and completion status.
- **TopicContent**: topic title + explanation + audio CTA.
- **AIResponseCard**: structured AI sections (simple, summary, example, practice).
- **QuizCard**: MCQ with feedback and retry.
- **Loader**: skeleton placeholders.
- **ErrorMessage**: friendly error state.

## 3. Sample React Components
- See `frontend/src/components` and `frontend/src/pages` for the full UI and page flows.
- Example: AI Explainer and NotebookLM-style assistant are in `frontend/src/pages/AIExplainer.jsx` and `frontend/src/pages/NotebookAssistant.jsx`.

## 4. Sample API Service Setup
- Central Axios client with JWT auth: `frontend/src/services/api.js`.
- Example endpoints: `/auth/login`, `/courses`, `/ai/explain`, `/live-sessions`, `/notebook/query`.

## 4.1 API Endpoints (Backend)
- `POST /api/auth/register` → create user and get JWT
- `POST /api/auth/login` → login and get JWT
- `GET /api/auth/me` → authenticated profile
- `GET /api/courses` → list enrolled courses with progress
- `GET /api/courses/{id}` → course detail with chapters and topics
- `POST /api/courses/{id}/enroll` → enroll in a course
- `POST /api/ai/explain` → AI explanation response
- `GET /api/quiz/{topicId}` → quiz questions for a topic
- `GET /api/live-sessions` → list upcoming live sessions
- `POST /api/live-sessions/{id}/join` → join live session
- `POST /api/notebook/query` → Notebook AI from notes
- `GET /api/membership/plans` → list plans
- `POST /api/membership/subscribe` → subscribe to plan
- `GET /api/notifications` → list notifications
- `POST /api/notifications/read` → mark as read
- `GET /api/admin/overview` → admin dashboard data
- `GET /api/teacher/overview` → teacher dashboard data

## 5. Responsive Layout Approach
- **Mobile-first** layouts using Tailwind CSS.
- Large touch targets and readable typography.
- Bottom navigation for easy thumb reach.
- Minimal card UI with clear progress.

## 6. UI/UX Best Practices for Indian Students
- Use Hindi-first copy with simple English options.
- Avoid jargon and reduce cognitive load with clear sections.
- Provide offline-friendly, low-data UI patterns (skeleton loaders).
- Friendly tone, real-life examples, and short summaries.

## Backend Notes
- .NET 7 Web API in `backend/LearningPlatform.Api` with JWT auth.
- MSSQL connection in `appsettings.json` (update with your SQL Server credentials).
- Controllers: Auth, Courses, AI, Quiz, Admin, Teacher, LiveSessions, Membership, Notebook, Notifications.
- SignalR hub at `/hubs/notifications` for real-time notifications.
- Seed data includes admin/teacher/student demo accounts, subjects, lectures, live sessions, and membership plans.
  - Admin: `9000000001` / `Admin@123`
  - Teacher: `9000000002` / `Teacher@123`
  - Student: `9000000003` / `Student@123`

---

**Tip:** Run frontend with Vite and backend with `dotnet run` after configuring MSSQL.
