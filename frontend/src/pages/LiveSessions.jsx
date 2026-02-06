import { useEffect, useState } from "react";
import { LiveSessionService } from "../services/api.js";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { useApp } from "../context/AppContext.jsx";

const LiveSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useApp();

  useEffect(() => {
    setLoading(true);
    LiveSessionService.list()
      .then((response) => setSessions(response.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = (sessionId) => {
    LiveSessionService.join(sessionId)
      .then((response) => window.open(response.data.streamUrl, "_blank"))
      .catch((err) => setError(err.message));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <div className="card space-y-1">
        <h2 className="text-lg font-semibold">{t("live")}</h2>
        <p className="text-sm text-slate-500">अपने टीचर के साथ लाइव पढ़ाई करें।</p>
      </div>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      <div className="space-y-4">
        {sessions.length === 0 && !loading ? (
          <div className="card text-sm text-slate-500">फिलहाल कोई लाइव क्लास उपलब्ध नहीं है।</div>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-semibold">{session.lectureTitle}</p>
                <p className="text-xs text-slate-500">Teacher: {session.teacherName}</p>
                <p className="text-xs text-slate-500">Room: {session.roomCode}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  {session.status}
                </span>
                <button
                  type="button"
                  className="rounded-full border border-brand-200 px-4 py-2 text-xs font-semibold text-brand-600"
                  onClick={() => handleJoin(session.id)}
                >
                  Join Live
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveSessions;
