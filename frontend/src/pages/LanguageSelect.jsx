import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { languageOptions } from "../data/languages.js";

const LanguageSelect = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [query, setQuery] = useState("");

  const filteredLanguages = useMemo(() => {
    if (!query) {
      return languageOptions;
    }
    const lower = query.toLowerCase();
    return languageOptions.filter((language) => language.label.toLowerCase().includes(lower));
  }, [query]);

  const setLanguage = (language) => {
    dispatch({ type: "SET_LANGUAGE", payload: language });
    navigate("/dashboard");
  };

  return (
    <div className="mx-auto max-w-md space-y-6 px-4 py-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">भाषा चुनें</h1>
        <p className="text-sm text-slate-500">आप बाद में बदल सकते हैं</p>
      </div>
      <div className="space-y-3">
        <input
          className="input"
          type="text"
          placeholder="भाषा खोजें"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="max-h-[340px] space-y-3 overflow-auto pr-2">
          {filteredLanguages.map((language) => (
            <button
              key={language.code}
              type="button"
              onClick={() => setLanguage(language.code)}
              className={`w-full rounded-xl border px-4 py-4 text-left text-base font-semibold ${
                state.language === language.code ? "border-brand-500 bg-brand-50" : "border-slate-200 dark:border-slate-700"
              }`}
            >
              {language.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelect;
