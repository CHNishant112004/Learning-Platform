import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import CourseCard from "../components/CourseCard.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { CourseService, LiveSessionService, MembershipService } from "../services/api.js";

const Dashboard = () => {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liveSessions, setLiveSessions] = useState([]);
  const [membership, setMembership] = useState(null);

  useEffect(() => {
    setLoading(true);
    CourseService.list()
      .then((response) => {
        dispatch({ type: "SET_COURSES", payload: response.data });
        if (response.data.length > 0) {
          dispatch({
            type: "SET_PROGRESS",
            payload: {
              currentCourseId: response.data[0].id,
              currentTopicId: null
            }
          });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    LiveSessionService.list()
      .then((response) => setLiveSessions(response.data))
      .catch(() => {});
    MembershipService.myPlan()
      .then((response) => {
        if (response.data) {
          setMembership(response.data);
          dispatch({ type: "SET_MEMBERSHIP", payload: { name: response.data.planName, status: response.data.status } });
        }
      })
      .catch(() => {});
  }, [dispatch]);

  const currentCourse = state.courses.find((course) => course.id === state.progress.currentCourseId);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <section className="card space-y-2">
        <h2 className="text-lg font-semibold">
          {state.language === "hi" ? `नमस्ते, ${state.user?.name}!` : `Welcome, ${state.user?.name}!`}
        </h2>
        <p className="text-sm text-slate-500">
          {state.language === "hi"
            ? "आज थोड़ा-सा पढ़ें, धीरे-धीरे आगे बढ़ें।"
            : "Study a little today, grow steadily."}
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-brand-50 px-3 py-1 font-semibold text-brand-600">
            {membership?.planName || state.membership?.name || "Starter"}
          </span>
          <span className="pill">
            {state.user?.role || "Student"}
          </span>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="section-title">क्विक एक्शन</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link to="/ai-explainer" className="card card-hover flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">AI कॉन्सेप्ट मदद</p>
              <p className="text-xs text-slate-500">किसी भी टॉपिक को आसान बनाएं</p>
            </div>
            <span className="text-2xl">🤖</span>
          </Link>
          <Link to="/notebook" className="card card-hover flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Notebook AI</p>
              <p className="text-xs text-slate-500">अपने नोट्स से उत्तर पाएँ</p>
            </div>
            <span className="text-2xl">🧠</span>
          </Link>
          <Link to="/live" className="card card-hover flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">लाइव क्लास</p>
              <p className="text-xs text-slate-500">टीचर के साथ लाइव सीखें</p>
            </div>
            <span className="text-2xl">📺</span>
          </Link>
          <Link to="/membership" className="card card-hover flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">मेंबरशिप</p>
              <p className="text-xs text-slate-500">प्लान अपग्रेड करें</p>
            </div>
            <span className="text-2xl">💳</span>
          </Link>
          {state.user?.role === "Admin" && (
            <Link to="/admin" className="card card-hover flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Admin डैशबोर्ड</p>
                <p className="text-xs text-slate-500">Subjects और Staff मैनेज करें</p>
              </div>
              <span className="text-2xl">🛠️</span>
            </Link>
          )}
          {state.user?.role === "Teacher" && (
            <Link to="/teacher" className="card card-hover flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Teacher डैशबोर्ड</p>
                <p className="text-xs text-slate-500">Live क्लास और नोट्स</p>
              </div>
              <span className="text-2xl">🎓</span>
            </Link>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="section-title">जारी रखें</h3>
          <Link to="/courses" className="text-sm font-semibold text-brand-600">
            सभी कोर्स
          </Link>
        </div>
        {currentCourse ? (
          <div className="card space-y-3">
            <div>
              <p className="text-sm text-slate-500">आप अभी पढ़ रहे हैं</p>
              <p className="text-lg font-semibold">{currentCourse.title}</p>
            </div>
            <Link
              to={`/courses/${currentCourse.id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600"
            >
              फिर से शुरू करें →
            </Link>
          </div>
        ) : (
          <div className="card text-sm text-slate-500">कोई कोर्स नहीं मिला।</div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="section-title">मेरे कोर्स</h3>
        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && (
          <div className="space-y-4">
            {state.courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="section-title">आने वाली लाइव कक्षाएँ</h3>
        {liveSessions.length === 0 ? (
          <div className="card text-sm text-slate-500">फिलहाल कोई लाइव क्लास नहीं है।</div>
        ) : (
          <div className="space-y-3">
            {liveSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="card flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{session.lectureTitle}</p>
                  <p className="text-xs text-slate-500">Teacher: {session.teacherName}</p>
                </div>
                <span className="text-xs font-semibold text-brand-600">{session.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
