import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import AIResponseCard from "../components/AIResponseCard.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { AIService } from "../services/api.js";
import { languageOptions } from "../data/languages.js";

const sampleResponse = {
  simple: "जब पानी गर्म होता है तो वह भाप बन जाता है। यह बदलता हुआ रूप उबलना कहलाता है।",
  summary: [
    "गर्मी मिलने पर पानी के कण तेज़ हिलते हैं",
    "उबलने पर पानी गैस में बदलता है",
    "दबाव बदलने पर उबलने का तापमान बदलता है"
  ],
  example: "रसोई में चाय बनाते समय पानी का उबलना रोज़मर्रा का उदाहरण है।",
  practice: ["उबलना और वाष्पन में क्या अंतर है?", "ऊंचाई बढ़ने पर पानी जल्दी क्यों उबलता है?"]
};

const AIExplainer = () => {
  const { state, dispatch, t } = useApp();
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState(state.language);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chat, setChat] = useState([
    {
      role: "assistant",
      text: "नमस्ते! कोई भी कॉन्सेप्ट लिखें, मैं सरल भाषा में समझाऊंगा।"
    }
  ]);
  const latestResponse = state.aiResponses[0] ?? sampleResponse;

  const handleExplain = () => {
    setLoading(true);
    setError(null);
    const question = input || "उबलना क्या है?";
    AIService.explain({ question, language })
      .then((response) => {
        dispatch({ type: "ADD_AI_RESPONSE", payload: response.data });
        setChat((prev) => [
          ...prev,
          { role: "user", text: question },
          { role: "assistant", text: response.data.simple }
        ]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <div className="glass-panel space-y-3">
        <h2 className="text-lg font-semibold">{t("aiExplainerTitle")}</h2>
        <p className="text-sm text-slate-500">{t("aiExplainerSubtitle")}</p>
        <textarea
          className="input min-h-[120px]"
          placeholder="उदाहरण: भौतिक विज्ञान में उबलना क्या है?"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <div className="flex flex-col gap-3 md:flex-row">
          <select
            className="input"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            {languageOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
          <input className="input" type="file" accept=".pdf,.txt" />
        </div>
        <button type="button" onClick={handleExplain} className="primary-button">
          {t("explainSimply")}
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold">AI जवाब</h3>
        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && <AIResponseCard response={latestResponse} />}
      </div>

      <div className="card space-y-4">
        <h3 className="text-base font-semibold">फॉलो-अप चैट</h3>
        <div className="space-y-3">
          {chat.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`rounded-xl px-4 py-3 text-sm ${
                message.role === "assistant"
                  ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  : "bg-brand-50 text-brand-700"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="input" placeholder="फॉलो-अप पूछें" />
          <button className="secondary-button" type="button">
            भेजें
          </button>
        </div>
        <p className="text-xs text-slate-400">उत्तर आपके नोट्स और सरल भाषा पर आधारित होंगे।</p>
      </div>
    </div>
  );
};

export default AIExplainer;
