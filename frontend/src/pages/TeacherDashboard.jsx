import { useEffect, useState } from "react";
import { TeacherService } from "../services/api.js";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const TeacherDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liveForm, setLiveForm] = useState({ lectureId: "" });
  const [noteForm, setNoteForm] = useState({ lectureId: "", title: "", fileUrl: "", summary: "" });

  const refresh = () => {
    setLoading(true);
    TeacherService.overview()
      .then((response) => setOverview(response.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleStartLive = (event) => {
    event.preventDefault();
    TeacherService.startLiveSession(liveForm)
      .then(() => {
        setLiveForm({ lectureId: "" });
        refresh();
      })
      .catch((err) => setError(err.message));
  };

  const handleUploadNotes = (event) => {
    event.preventDefault();
    TeacherService.uploadNotes(noteForm)
      .then(() => {
        setNoteForm({ lectureId: "", title: "", fileUrl: "", summary: "" });
        refresh();
      })
      .catch((err) => setError(err.message));
  };

  if (loading && !overview) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <div className="card space-y-1">
        <h2 className="text-lg font-semibold">Teacher Dashboard</h2>
        <p className="text-sm text-slate-500">Live sessions शुरू करें और नोट्स साझा करें।</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="card space-y-3" onSubmit={handleStartLive}>
          <h3 className="text-base font-semibold">लाइव क्लास शुरू करें</h3>
          <select
            className="input"
            value={liveForm.lectureId}
            onChange={(event) => setLiveForm({ lectureId: event.target.value })}
          >
            <option value="">Lecture चुनें</option>
            {(overview?.lectures ?? []).map((lecture) => (
              <option key={lecture.id} value={lecture.id}>
                {lecture.title} ({lecture.courseTitle})
              </option>
            ))}
          </select>
          <button type="submit" className="primary-button">
            Start Live
          </button>
        </form>

        <form className="card space-y-3" onSubmit={handleUploadNotes}>
          <h3 className="text-base font-semibold">Lecture नोट्स अपलोड</h3>
          <select
            className="input"
            value={noteForm.lectureId}
            onChange={(event) => setNoteForm({ ...noteForm, lectureId: event.target.value })}
          >
            <option value="">Lecture चुनें</option>
            {(overview?.lectures ?? []).map((lecture) => (
              <option key={lecture.id} value={lecture.id}>
                {lecture.title}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="नोट्स का टाइटल"
            value={noteForm.title}
            onChange={(event) => setNoteForm({ ...noteForm, title: event.target.value })}
          />
          <input
            className="input"
            placeholder="File URL"
            value={noteForm.fileUrl}
            onChange={(event) => setNoteForm({ ...noteForm, fileUrl: event.target.value })}
          />
          <textarea
            className="input"
            rows="3"
            placeholder="Summary"
            value={noteForm.summary}
            onChange={(event) => setNoteForm({ ...noteForm, summary: event.target.value })}
          />
          <button type="submit" className="primary-button">
            नोट्स सेव करें
          </button>
        </form>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-base font-semibold">Assigned Subjects</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {(overview?.subjects ?? []).map((subject) => (
              <li key={subject.id}>{subject.name}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3 className="text-base font-semibold">Live Sessions</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {(overview?.liveSessions ?? []).map((session) => (
              <li key={session.id} className="flex items-center justify-between">
                <span>{session.lectureTitle}</span>
                <span className="text-xs font-semibold text-emerald-600">{session.status}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card lg:col-span-2">
          <h3 className="text-base font-semibold">Shared Notes</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {(overview?.notes ?? []).map((note) => (
              <li key={note.id} className="flex items-center justify-between">
                <span>{note.title}</span>
                <span className="text-xs text-slate-500">{note.lectureTitle}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
