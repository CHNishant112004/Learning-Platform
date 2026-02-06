import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import TopicContent from "../components/TopicContent.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { CourseService } from "../services/api.js";

const ChapterDetail = () => {
  const { courseId, chapterId } = useParams();
  const { dispatch } = useApp();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    CourseService.details(courseId)
      .then((response) => {
        setCourse(response.data);
        const selectedChapter = response.data.chapters.find((item) => item.id === chapterId);
        dispatch({
          type: "SET_PROGRESS",
          payload: {
            currentCourseId: response.data.id,
            currentTopicId: selectedChapter?.topics[0]?.id ?? null
          }
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId, dispatch]);

  const chapter = course?.chapters.find((item) => item.id === chapterId);
  const topic = chapter?.topics[0];

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

  if (!course || !chapter || !topic) {
    return <div className="mx-auto max-w-4xl px-4 py-6">विषय उपलब्ध नहीं है</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{chapter.title}</h2>
        <Link to={`/courses/${course.id}`} className="text-sm font-semibold text-brand-600">
          सभी अध्याय
        </Link>
      </div>
      <TopicContent topic={topic} />
      <div className="card space-y-3">
        <h3 className="text-base font-semibold">छोटा अभ्यास</h3>
        <p className="text-sm text-slate-500">तैयारी जाँचें और तुरंत फीडबैक लें</p>
        <Link to={`/quiz/${topic.id}`} className="primary-button">
          क्विज़ शुरू करें
        </Link>
      </div>
    </div>
  );
};

export default ChapterDetail;
