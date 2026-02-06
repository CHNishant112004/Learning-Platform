import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || "कुछ गलत हो गया";
    return Promise.reject(new Error(message));
  }
);

export const AuthService = {
  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
  me: () => api.get("/auth/me")
};

export const CourseService = {
  list: () => api.get("/courses"),
  details: (id) => api.get(`/courses/${id}`)
};

export const AIService = {
  explain: (payload) => api.post("/ai/explain", payload)
};

export const NotebookService = {
  query: (payload) => api.post("/notebook/query", payload)
};

export const QuizService = {
  byTopic: (topicId) => api.get(`/quiz/${topicId}`)
};

export const LiveSessionService = {
  list: () => api.get("/live-sessions"),
  join: (sessionId) => api.post(`/live-sessions/${sessionId}/join`)
};

export const AdminService = {
  overview: () => api.get("/admin/overview"),
  createSubject: (payload) => api.post("/admin/subjects", payload),
  assignStaff: (payload) => api.post("/admin/staff/assign", payload),
  createCourse: (payload) => api.post("/admin/courses", payload),
  createLecture: (payload) => api.post("/admin/lectures", payload),
  createMembershipPlan: (payload) => api.post("/admin/membership-plans", payload)
};

export const TeacherService = {
  overview: () => api.get("/teacher/overview"),
  startLiveSession: (payload) => api.post("/teacher/live-sessions/start", payload),
  uploadNotes: (payload) => api.post("/teacher/notes", payload),
  notes: () => api.get("/teacher/notes")
};

export const MembershipService = {
  plans: () => api.get("/membership/plans"),
  subscribe: (payload) => api.post("/membership/subscribe", payload),
  myPlan: () => api.get("/membership/my")
};

export const NotificationService = {
  list: () => api.get("/notifications"),
  markRead: (payload) => api.post("/notifications/read", payload),
  send: (payload) => api.post("/notifications/send", payload)
};

export default api;
