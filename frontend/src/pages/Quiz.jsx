import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuizCard from "../components/QuizCard.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { QuizService } from "../services/api.js";

const Quiz = () => {
  const { topicId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    QuizService.byTopic(topicId)
      .then((response) => setQuestions(response.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [topicId]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">क्विज़</h2>
        <p className="text-sm text-slate-500">विषय: {topicId}</p>
      </div>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && questions.length === 0 && (
        <div className="card text-sm text-slate-500">इस विषय के लिए अभी क्विज़ उपलब्ध नहीं है।</div>
      )}
      {!loading &&
        !error &&
        questions.map((question) => <QuizCard key={question.id} question={question} />)}
    </div>
  );
};

export default Quiz;
