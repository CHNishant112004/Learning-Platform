import { useEffect, useMemo, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { AuthService } from "../services/api.js";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { languageOptions } from "../data/languages.js";

const Profile = () => {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const languageLabel = useMemo(
    () => languageOptions.find((language) => language.code === state.language)?.label ?? state.language,
    [state.language]
  );

  useEffect(() => {
    setLoading(true);
    AuthService.me()
      .then((response) => {
        dispatch({ type: "LOGIN", payload: { user: response.data, token: state.token } });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [dispatch, state.token]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      <div className="card flex items-center gap-4">
        <img
          src={state.user?.avatar || "https://placehold.co/96x96"}
          alt="avatar"
          className="h-16 w-16 rounded-full border border-slate-200 object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold">{state.user?.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{state.user?.city}</p>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-base font-semibold">सेटिंग्स</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-300">भाषा</span>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
            {languageLabel}
          </span>
        </div>
        <div className="space-y-2">
          <label className="label">भाषा बदलें</label>
          <select
            className="input"
            value={state.language}
            onChange={(event) => dispatch({ type: "SET_LANGUAGE", payload: event.target.value })}
          >
            {languageOptions.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-300">सीखने की प्रगति</span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{state.courses[0]?.progress ?? 0}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-300">रोल</span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{state.user?.role ?? "Student"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-300">मेंबरशिप</span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            {state.membership?.name ?? "Starter"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-300">थीम</span>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            onClick={() => dispatch({ type: "SET_THEME", payload: state.theme === "dark" ? "light" : "dark" })}
          >
            {state.theme === "dark" ? "डार्क" : "लाइट"}
          </button>
        </div>
      </div>

      <button
        className="secondary-button"
        type="button"
        onClick={() => dispatch({ type: "LOGOUT" })}
      >
        लॉगआउट
      </button>
    </div>
  );
};

export default Profile;
