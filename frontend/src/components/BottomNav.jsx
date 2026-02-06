import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const BottomNav = () => {
  const { state, t } = useApp();
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/language-select"].includes(location.pathname);
  const navItems = [
    { to: "/dashboard", label: t("home"), icon: "🏠" },
    { to: "/courses", label: t("courses"), icon: "📚" },
    { to: "/live", label: t("live"), icon: "📺" },
    { to: "/notebook", label: t("notebook"), icon: "🧠" },
    { to: "/profile", label: t("profile"), icon: "👤" }
  ];

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
