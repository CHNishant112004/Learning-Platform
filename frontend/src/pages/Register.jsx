import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { AuthService } from "../services/api.js";
import ErrorMessage from "../components/ErrorMessage.jsx";

const Register = () => {
  const navigate = useNavigate();
  const { state, dispatch, t } = useApp();
  const [form, setForm] = useState({ name: "", phone: "", city: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    AuthService.register({
      name: form.name,
      phone: form.phone,
      city: form.city,
      preferredLanguage: state.language,
      password: form.password
    })
      .then((response) => {
        dispatch({ type: "LOGIN", payload: response.data });
        navigate("/language-select");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="mx-auto max-w-md space-y-6 px-4 py-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">{t("registerTitle", "अपना खाता बनाएं")}</h1>
        <p className="text-sm text-slate-500">{t("registerSubtitle", "कम डेटा में सरल सीखना शुरू करें")}</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="label">नाम</label>
          <input
            className="input"
            name="name"
            placeholder="आपका नाम"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1">
          <label className="label">मोबाइल नंबर</label>
          <input
            className="input"
            name="phone"
            type="tel"
            placeholder="98765 43210"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1">
          <label className="label">पासवर्ड</label>
          <input
            className="input"
            name="password"
            type="password"
            placeholder="पासवर्ड बनाएँ"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1">
          <label className="label">शहर</label>
          <input
            className="input"
            name="city"
            placeholder="आपका शहर"
            value={form.city}
            onChange={handleChange}
          />
        </div>
        {error && <ErrorMessage message={error} />}
        <button type="submit" className="primary-button">
          {loading ? "..." : t("registerTitle", "आगे बढ़ें")}
        </button>
      </form>
      <div className="text-center text-sm text-slate-500">
        पहले से खाता है? <Link to="/login" className="font-semibold text-brand-600">लॉगिन करें</Link>
      </div>
    </div>
  );
};

export default Register;
