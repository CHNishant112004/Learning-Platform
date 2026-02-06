import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { deleteCookie, getCookie, setCookie } from "../utils/cookies.js";
import { translations } from "../i18n/translations.js";

const AppContext = createContext();

const initialState = {
  user: null,
  token: getCookie("token"),
  language: getCookie("language") || "hi",
  theme: getCookie("theme") || "light",
  courses: [],
  progress: {
    currentCourseId: null,
    currentTopicId: null
  },
  aiResponses: [],
  membership: null,
  notifications: [],
  loading: false,
  error: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LANGUAGE":
      return {
        ...state,
        language: action.payload,
        user: state.user ? { ...state.user, preferredLanguage: action.payload } : state.user
      };
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        language: action.payload.user?.preferredLanguage || state.language,
        membership: action.payload.user?.activePlan
          ? { name: action.payload.user.activePlan, status: action.payload.user.subscriptionStatus }
          : state.membership
      };
    case "LOGOUT":
      return { ...state, user: null, token: null, membership: null, notifications: [] };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_COURSES":
      return { ...state, courses: action.payload };
    case "SET_PROGRESS":
      return { ...state, progress: action.payload };
    case "ADD_AI_RESPONSE":
      return { ...state, aiResponses: [action.payload, ...state.aiResponses] };
    case "SET_MEMBERSHIP":
      return { ...state, membership: action.payload };
    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload };
    case "ADD_NOTIFICATION":
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, isRead: true } : notification
        )
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.token) {
      setCookie("token", state.token);
    } else {
      deleteCookie("token");
    }
  }, [state.token]);

  useEffect(() => {
    if (state.language) {
      setCookie("language", state.language);
    }
  }, [state.language]);

  useEffect(() => {
    setCookie("theme", state.theme);
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state.theme]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  const t = (key, fallback) => translations[state.language]?.[key] || translations.en[key] || fallback || key;

  return <AppContext.Provider value={{ ...value, t }}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
