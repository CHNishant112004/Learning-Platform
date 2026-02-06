import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import ChapterList from "../components/ChapterList.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { CourseService } from "../services/api.js";

const CourseDetail = () => {
  const { courseId } = useParams();
  const { dispatch } = useApp();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    CourseService.details(courseId)
      .then((response) => {
        setCourse(response.data);
        dispatch({ type: "SET_PROGRESS", payload: { currentCourseId: response.data.id, currentTopicId: null } });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId, dispatch]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!course) {
    return <div className="mx-auto max-w-4xl px-4 py-6">कोर्स नहीं मिला</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <div className="card space-y-2">
        <h2 className="text-xl font-semibold">{course.title}</h2>
        <p className="text-sm text-slate-500">{course.description}</p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>प्रगति</span>
          <span>{course.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200">
          <div className="h-2 rounded-full bg-brand-500" style={{ width: `${course.progress}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">अध्याय</h3>
          <Link to="/courses" className="text-sm font-semibold text-brand-600">
            वापस जाएं
          </Link>
        </div>
        <ChapterList chapters={course.chapters} />
        {course.chapters.map((chapter) => (
          <Link
            key={chapter.id}
            to={`/courses/${course.id}/chapters/${chapter.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600"
          >
            {chapter.title} पढ़ें →
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;
