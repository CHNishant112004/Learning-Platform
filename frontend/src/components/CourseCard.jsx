import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <Link to={`/courses/${course.id}`} className="card block space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
          <p className="text-sm text-slate-500">{course.description}</p>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
          {course.subject}
        </span>
      </div>
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>प्रगति</span>
          <span>{course.progress}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-brand-500"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
