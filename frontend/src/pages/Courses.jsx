import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import CourseCard from "../components/CourseCard.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { CourseService } from "../services/api.js";

const Courses = () => {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (state.courses.length > 0) {
      return;
    }
    setLoading(true);
    CourseService.list()
      .then((response) => dispatch({ type: "SET_COURSES", payload: response.data }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [dispatch, state.courses.length]);
  const subjects = ["All", ...new Set(state.courses.map((course) => course.subject))];
  const [filter, setFilter] = useState("All");

  const filteredCourses =
    filter === "All" ? state.courses : state.courses.filter((course) => course.subject === filter);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">कोर्स चुनें</h2>
        <p className="text-sm text-slate-500">अपनी रुचि के अनुसार विषय चुनें</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <button
            key={subject}
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              filter === subject ? "bg-brand-500 text-white" : "bg-white text-slate-600"
            }`}
            onClick={() => setFilter(subject)}
          >
            {subject}
          </button>
        ))}
      </div>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
