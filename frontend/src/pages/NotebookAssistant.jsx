import { useMemo, useState } from "react";
import { NotebookService } from "../services/api.js";
import { languageOptions } from "../data/languages.js";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { useApp } from "../context/AppContext.jsx";

const NotebookAssistant = () => {
  const { t } = useApp();
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("hi");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteSummary, setNoteSummary] = useState("");
  const [notes, setNotes] = useState([
    { id: "note-1", title: "ऑक्सीकरण नोट्स", summary: "ऑक्सीकरण की परिभाषा और उदाहरण" },
    { id: "note-2", title: "रासायनिक अभिक्रिया", summary: "मुख्य रिएक्शन और नियम" }
  ]);

  const sources = useMemo(() => response?.sources ?? [], [response]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query.trim()) {
      setError("कृपया कोई सवाल लिखें");
      return;
    }
    setError(null);
    setLoading(true);
    NotebookService.query({ query, language, noteIds: [] })
      .then((res) => setResponse(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleAddNote = (event) => {
    event.preventDefault();
    if (!noteTitle.trim()) {
      setError("कृपया नोट्स का नाम लिखें");
      return;
    }
    setError(null);
    setNotes((prev) => [
      ...prev,
      { id: `note-${prev.length + 1}`, title: noteTitle, summary: noteSummary }
    ]);
    setNoteTitle("");
    setNoteSummary("");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <div className="glass-panel space-y-2">
        <h2 className="text-lg font-semibold">{t("notebookTitle")}</h2>
        <p className="text-sm text-slate-500">{t("notebookSubtitle")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <form className="card space-y-3" onSubmit={handleSubmit}>
            <textarea
              className="input"
              rows="4"
              placeholder="उदाहरण: ऑक्सीकरण क्या है?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <select className="input" value={language} onChange={(event) => setLanguage(event.target.value)}>
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button type="submit" className="primary-button sm:w-auto">
                खोजें
              </button>
            </div>
          </form>

          {loading && <Loader />}
          {error && <ErrorMessage message={error} />}

          {response && (
            <div className="space-y-4">
              <div className="card">
                <h3 className="section-title">सरल उत्तर</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{response.simpleAnswer}</p>
              </div>
              <div className="card">
                <h3 className="section-title">मुख्य बिंदु</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                  {response.bulletPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              <div className="card">
                <h3 className="section-title">Real-life उदाहरण</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{response.realLifeExample}</p>
              </div>
              <div className="card">
                <h3 className="section-title">Practice प्रश्न</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                  {response.practiceQuestions.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <form className="card space-y-3" onSubmit={handleAddNote}>
            <h3 className="section-title">{t("addNotes")}</h3>
            <input
              className="input"
              placeholder="नोट्स का नाम"
              value={noteTitle}
              onChange={(event) => setNoteTitle(event.target.value)}
            />
            <textarea
              className="input"
              rows="3"
              placeholder="संक्षेप"
              value={noteSummary}
              onChange={(event) => setNoteSummary(event.target.value)}
            />
            <button type="submit" className="secondary-button sm:w-auto">
              नोट्स सेव करें
            </button>
          </form>

          <div className="card space-y-3">
            <h3 className="section-title">{t("notesUploaded")}</h3>
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="rounded-xl border border-slate-100 p-3 text-sm dark:border-slate-800">
                  <p className="font-semibold">{note.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{note.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card space-y-2">
            <h3 className="section-title">{t("sources")}</h3>
            {sources.length === 0 ? (
              <p className="text-sm text-slate-500">अभी कोई source नहीं है।</p>
            ) : (
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                {sources.map((source) => (
                  <li key={source}>{source}</li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NotebookAssistant;
