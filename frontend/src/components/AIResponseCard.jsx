const Section = ({ title, children }) => (
  <div className="space-y-1">
    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</p>
    <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-200">
      {children}
    </div>
  </div>
);

const AIResponseCard = ({ response }) => {
  return (
    <div className="card space-y-4">
      <Section title="सरल समझ">
        <p>{response.simple}</p>
      </Section>
      <Section title="मुख्य बिंदु">
        <ul className="list-disc space-y-1 pl-5">
          {response.summary.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>
      <Section title="भारतीय उदाहरण">
        <p>{response.example}</p>
      </Section>
      <Section title="अभ्यास प्रश्न">
        <ol className="list-decimal space-y-1 pl-5">
          {response.practice.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </Section>
    </div>
  );
};

export default AIResponseCard;
