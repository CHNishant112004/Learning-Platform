import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import LanguageSelect from "./pages/LanguageSelect.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import ChapterDetail from "./pages/ChapterDetail.jsx";
import AIExplainer from "./pages/AIExplainer.jsx";
import NotebookAssistant from "./pages/NotebookAssistant.jsx";
import LiveSessions from "./pages/LiveSessions.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import Membership from "./pages/Membership.jsx";
import Notifications from "./pages/Notifications.jsx";
import Quiz from "./pages/Quiz.jsx";
import Profile from "./pages/Profile.jsx";
import { useApp } from "./context/AppContext.jsx";
import { AuthService, NotificationService } from "./services/api.js";

const RequireAuth = ({ children }) => {
  const { state } = useApp();
  if (!state.token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RequireRole = ({ children, role }) => {
  const { state } = useApp();
  if (!state.user) {
    return <Navigate to="/login" replace />;
  }
  if (state.user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    if (state.token && !state.user) {
      AuthService.me()
        .then((response) => dispatch({ type: "LOGIN", payload: { user: response.data, token: state.token } }))
        .catch(() => dispatch({ type: "LOGOUT" }));
    }
  }, [dispatch, state.token, state.user]);

  useEffect(() => {
    if (!state.token) {
      return;
    }
    NotificationService.list()
      .then((response) => dispatch({ type: "SET_NOTIFICATIONS", payload: response.data }))
      .catch(() => {});
  }, [dispatch, state.token]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header />
      <main className="pb-20">
        <Routes>
          <Route path="/" element={<Navigate to={state.user ? "/dashboard" : "/login"} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/language-select" element={<LanguageSelect />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/courses"
            element={
              <RequireAuth>
                <Courses />
              </RequireAuth>
            }
          />
          <Route
            path="/courses/:courseId"
            element={
              <RequireAuth>
                <CourseDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/courses/:courseId/chapters/:chapterId"
            element={
              <RequireAuth>
                <ChapterDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/ai-explainer"
            element={
              <RequireAuth>
                <AIExplainer />
              </RequireAuth>
            }
          />
          <Route
            path="/notebook"
            element={
              <RequireAuth>
                <NotebookAssistant />
              </RequireAuth>
            }
          />
          <Route
            path="/live"
            element={
              <RequireAuth>
                <LiveSessions />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <RequireRole role="Admin">
                  <AdminDashboard />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/teacher"
            element={
              <RequireAuth>
                <RequireRole role="Teacher">
                  <TeacherDashboard />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/membership"
            element={
              <RequireAuth>
                <Membership />
              </RequireAuth>
            }
          />
          <Route
            path="/notifications"
            element={
              <RequireAuth>
                <Notifications />
              </RequireAuth>
            }
          />
          <Route
            path="/quiz/:topicId"
            element={
              <RequireAuth>
                <Quiz />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
};

export default App;
