import { useEffect, useMemo, useState } from "react";
import { AdminService } from "../services/api.js";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { useApp } from "../context/AppContext.jsx";

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const { t } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjectForm, setSubjectForm] = useState({ name: "", description: "", language: "hi" });
  const [courseForm, setCourseForm] = useState({ title: "", description: "", subjectId: "" });
  const [lectureForm, setLectureForm] = useState({ courseId: "", title: "", scheduledAt: "", durationMinutes: 45 });
  const [assignmentForm, setAssignmentForm] = useState({ staffId: "", subjectId: "", role: "Teacher" });
  const [planForm, setPlanForm] = useState({ name: "", price: 0, billingCycle: "Monthly", features: "" });

  const refresh = () => {
    setLoading(true);
    AdminService.overview()
      .then((response) => setOverview(response.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSubjectSubmit = (event) => {
    event.preventDefault();
    AdminService.createSubject({
      name: subjectForm.name,
      description: subjectForm.description,
      language: subjectForm.language
    })
      .then(() => {
        setSubjectForm({ name: "", description: "", language: "hi" });
        refresh();
      })
      .catch((err) => setError(err.message));
  };

  const handleCourseSubmit = (event) => {
    event.preventDefault();
    AdminService.createCourse(courseForm)
      .then(() => {
        setCourseForm({ title: "", description: "", subjectId: "" });
        refresh();
      })
      .catch((err) => setError(err.message));
  };

  const handleLectureSubmit = (event) => {
    event.preventDefault();
    AdminService.createLecture({
      ...lectureForm,
      durationMinutes: Number(lectureForm.durationMinutes)
    })
      .then(() => {
        setLectureForm({ courseId: "", title: "", scheduledAt: "", durationMinutes: 45 });
        refresh();
      })
      .catch((err) => setError(err.message));
  };

  const handleAssignSubmit = (event) => {
    event.preventDefault();
    AdminService.assignStaff(assignmentForm)
      .then(() => {
        setAssignmentForm({ staffId: "", subjectId: "", role: "Teacher" });
        refresh();
      })
      .catch((err) => setError(err.message));
  };

  const handlePlanSubmit = (event) => {
    event.preventDefault();
    AdminService.createMembershipPlan({
      name: planForm.name,
      price: Number(planForm.price),
      billingCycle: planForm.billingCycle,
      features: planForm.features.split(",").map((item) => item.trim()).filter(Boolean)
    })
      .then(() => {
        setPlanForm({ name: "", price: 0, billingCycle: "Monthly", features: "" });
        refresh();
      })
      .catch((err) => setError(err.message));
  };

  const subjectOptions = useMemo(() => overview?.subjects ?? [], [overview]);
  const staffOptions = useMemo(() => overview?.staff ?? [], [overview]);
  const courseOptions = useMemo(() => overview?.courses ?? [], [overview]);

  if (loading && !overview) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <div className="card space-y-1">
        <h2 className="text-lg font-semibold">{t("adminDashboard")}</h2>
        <p className="text-sm text-slate-500">Subjects, staff, courses और plans को मैनेज करें।</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="card space-y-3" onSubmit={handleSubjectSubmit}>
          <h3 className="text-base font-semibold">नया Subject जोड़ें</h3>
          <input
            className="input"
            placeholder="Subject नाम"
            value={subjectForm.name}
            onChange={(event) => setSubjectForm({ ...subjectForm, name: event.target.value })}
          />
          <input
            className="input"
            placeholder="विवरण"
            value={subjectForm.description}
            onChange={(event) => setSubjectForm({ ...subjectForm, description: event.target.value })}
          />
          <input
            className="input"
            placeholder="Language code (hi, en)"
            value={subjectForm.language}
            onChange={(event) => setSubjectForm({ ...subjectForm, language: event.target.value })}
          />
          <button type="submit" className="primary-button">
            सेव करें
          </button>
        </form>

        <form className="card space-y-3" onSubmit={handleAssignSubmit}>
          <h3 className="text-base font-semibold">Staff Assignment</h3>
          <select
            className="input"
            value={assignmentForm.staffId}
            onChange={(event) => setAssignmentForm({ ...assignmentForm, staffId: event.target.value })}
          >
            <option value="">Staff चुनें</option>
            {staffOptions.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name} ({staff.role})
              </option>
            ))}
          </select>
          <select
            className="input"
            value={assignmentForm.subjectId}
            onChange={(event) => setAssignmentForm({ ...assignmentForm, subjectId: event.target.value })}
          >
            <option value="">Subject चुनें</option>
            {subjectOptions.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Role"
            value={assignmentForm.role}
            onChange={(event) => setAssignmentForm({ ...assignmentForm, role: event.target.value })}
          />
          <button type="submit" className="primary-button">
            Assign करें
          </button>
        </form>

        <form className="card space-y-3" onSubmit={handleCourseSubmit}>
          <h3 className="text-base font-semibold">नया Course जोड़ें</h3>
          <input
            className="input"
            placeholder="Course title"
            value={courseForm.title}
            onChange={(event) => setCourseForm({ ...courseForm, title: event.target.value })}
          />
          <input
            className="input"
            placeholder="Course विवरण"
            value={courseForm.description}
            onChange={(event) => setCourseForm({ ...courseForm, description: event.target.value })}
          />
          <select
            className="input"
            value={courseForm.subjectId}
            onChange={(event) => setCourseForm({ ...courseForm, subjectId: event.target.value })}
          >
            <option value="">Subject चुनें</option>
            {subjectOptions.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          <button type="submit" className="primary-button">
            Course बनाएँ
          </button>
        </form>

        <form className="card space-y-3" onSubmit={handleLectureSubmit}>
          <h3 className="text-base font-semibold">Lecture Schedule</h3>
          <select
            className="input"
            value={lectureForm.courseId}
            onChange={(event) => setLectureForm({ ...lectureForm, courseId: event.target.value })}
          >
            <option value="">Course चुनें</option>
            {courseOptions.map((course) => (
              <option key={`${course.id}-${course.title}`} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Lecture title"
            value={lectureForm.title}
            onChange={(event) => setLectureForm({ ...lectureForm, title: event.target.value })}
          />
          <input
            className="input"
            type="datetime-local"
            value={lectureForm.scheduledAt}
            onChange={(event) => setLectureForm({ ...lectureForm, scheduledAt: event.target.value })}
          />
          <input
            className="input"
            type="number"
            value={lectureForm.durationMinutes}
            onChange={(event) => setLectureForm({ ...lectureForm, durationMinutes: event.target.value })}
          />
          <button type="submit" className="primary-button">
            Lecture जोड़ें
          </button>
        </form>

        <form className="card space-y-3" onSubmit={handlePlanSubmit}>
          <h3 className="text-base font-semibold">Membership Plan</h3>
          <input
            className="input"
            placeholder="Plan नाम"
            value={planForm.name}
            onChange={(event) => setPlanForm({ ...planForm, name: event.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="कीमत"
            value={planForm.price}
            onChange={(event) => setPlanForm({ ...planForm, price: event.target.value })}
          />
          <input
            className="input"
            placeholder="Billing cycle"
            value={planForm.billingCycle}
            onChange={(event) => setPlanForm({ ...planForm, billingCycle: event.target.value })}
          />
          <textarea
            className="input"
            rows="3"
            placeholder="Features (comma separated)"
            value={planForm.features}
            onChange={(event) => setPlanForm({ ...planForm, features: event.target.value })}
          />
          <button type="submit" className="primary-button">
            Plan सेव करें
          </button>
        </form>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-base font-semibold">Assignments</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {(overview?.assignments ?? []).map((assignment) => (
              <li key={assignment.id} className="flex items-center justify-between">
                <span>{assignment.staffName} → {assignment.subjectName}</span>
                <span className="text-xs font-semibold text-brand-600">{assignment.role}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3 className="text-base font-semibold">Upcoming Lectures</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {(overview?.lectures ?? []).map((lecture) => (
              <li key={lecture.id} className="flex items-center justify-between">
                <span>{lecture.title}</span>
                <span className="text-xs text-slate-500">{lecture.courseTitle}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
