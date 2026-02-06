import { useState } from "react";

const QuizCard = ({ question }) => {
  const [selected, setSelected] = useState(null);
  const isCorrect = selected === question.answer;

  return (
    <div className="card space-y-4">
      <p className="text-base font-semibold">{question.text}</p>
      <div className="space-y-2">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelected(option)}
            className={`w-full rounded-lg border px-4 py-3 text-left text-sm ${
              selected === option
                ? isCorrect
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-rose-400 bg-rose-50"
                : "border-slate-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {selected && (
        <div className={`rounded-lg p-3 text-sm ${isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
          {isCorrect ? "सही जवाब!" : `सही उत्तर: ${question.answer}`}
          <p className="mt-1 text-slate-600">{question.explanation}</p>
        </div>
      )}
      <button type="button" className="secondary-button" onClick={() => setSelected(null)}>
        फिर से प्रयास करें
      </button>
    </div>
  );
};

export default QuizCard;
