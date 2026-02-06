import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const navItems = [
  { to: "/dashboard", label: "होम", icon: "🏠" },
  { to: "/courses", label: "कोर्स", icon: "📚" },
  { to: "/live", label: "लाइव", icon: "📺" },
  { to: "/notebook", label: "AI नोट्स", icon: "🧠" },
  { to: "/profile", label: "प्रोफ़ाइल", icon: "👤" }
];

const BottomNav = () => {
  const { state } = useApp();
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/language-select"].includes(location.pathname);

  if (!state.token || isAuthPage) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-4xl items-center justify-around px-4 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs ${
                isActive ? "text-brand-600" : "text-slate-500 dark:text-slate-400"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
