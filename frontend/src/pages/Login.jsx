import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { AuthService } from "../services/api.js";
import ErrorMessage from "../components/ErrorMessage.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    AuthService.login({ phone, password })
      .then((response) => {
        dispatch({ type: "LOGIN", payload: response.data });
        navigate("/dashboard");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="mx-auto max-w-md space-y-6 px-4 py-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">स्वागत है!</h1>
        <p className="text-sm text-slate-500">फोन नंबर से लॉगिन करें</p>
      </div>
      <form className="space-y-4" onSubmit={handleLogin}>
        <div className="space-y-1">
          <label className="label">मोबाइल नंबर</label>
          <input
            className="input"
            type="tel"
            placeholder="उदाहरण: 98765 43210"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="label">पासवर्ड</label>
          <input
            className="input"
            type="password"
            placeholder="पासवर्ड दर्ज करें"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error && <ErrorMessage message={error} />}
        <button type="submit" className="primary-button">
          {loading ? "लॉगिन हो रहा है..." : "लॉगिन करें"}
        </button>
      </form>
      <div className="text-center text-sm text-slate-500">
        नया अकाउंट? <Link to="/register" className="font-semibold text-brand-600">रजिस्टर करें</Link>
      </div>
    </div>
  );
};

export default Login;
