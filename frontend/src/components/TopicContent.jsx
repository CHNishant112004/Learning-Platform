const TopicContent = ({ topic }) => {
  return (
    <div className="space-y-4">
      <div className="card space-y-2">
        <h2 className="text-xl font-semibold">{topic.title}</h2>
        <p className="text-base leading-relaxed text-slate-700">{topic.content}</p>
        <button className="secondary-button">🔊 ऑडियो सुनें</button>
      </div>
    </div>
  );
};

export default TopicContent;
