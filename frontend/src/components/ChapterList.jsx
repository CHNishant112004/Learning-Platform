const ChapterList = ({ chapters }) => {
  return (
    <div className="space-y-3">
      {chapters.map((chapter) => (
        <div key={chapter.id} className="card">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-base font-semibold">{chapter.title}</h4>
              <p className="text-xs text-slate-500">{chapter.topics.length} विषय</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                chapter.completed ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
              }`}
            >
              {chapter.completed ? "पूरा" : "चल रहा"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChapterList;
