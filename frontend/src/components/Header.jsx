import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { languageOptions } from "../data/languages.js";

const Header = () => {
  const { state, dispatch, t } = useApp();
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/language-select"].includes(location.pathname);
  const languageLabel = useMemo(
    () => languageOptions.find((language) => language.code === state.language)?.label ?? state.language,
    [state.language]
  );

  const unreadCount = state.notifications.filter((notification) => !notification.isRead).length;

  return (
    <header className="sticky top-0 z-20 bg-white/80 shadow-sm backdrop-blur-xl dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">SL</span>
          <div>
            <p className="text-lg font-semibold">{t("brandTitle")}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t("brandSubtitle")}</p>
          </div>
        </Link>
        {!isAuthPage && (
          <div className="flex items-center gap-3 text-right text-xs text-slate-500 dark:text-slate-300">
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-100">{state.user?.name ?? "Guest"}</p>
              <p>{languageLabel}</p>
              {state.user?.role && <p className="text-[11px] uppercase">{state.user.role}</p>}
            </div>
            <Link to="/notifications" className="relative rounded-full border border-slate-200 px-3 py-2 text-xs dark:border-slate-700">
              🔔
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => dispatch({ type: "SET_THEME", payload: state.theme === "dark" ? "light" : "dark" })}
              className="rounded-full border border-slate-200 px-3 py-2 text-xs dark:border-slate-700"
            >
              {state.theme === "dark" ? "🌙" : "☀️"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
