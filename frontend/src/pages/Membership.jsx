import { useEffect, useState } from "react";
import { MembershipService } from "../services/api.js";
import { useApp } from "../context/AppContext.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const Membership = () => {
  const { dispatch, t } = useApp();
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = () => {
    setLoading(true);
    Promise.all([MembershipService.plans(), MembershipService.myPlan()])
      .then(([plansResponse, myPlanResponse]) => {
        setPlans(plansResponse.data);
        setCurrentPlan(myPlanResponse.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSubscribe = (planId) => {
    MembershipService.subscribe({ planId })
      .then((response) => {
        setCurrentPlan(response.data);
        dispatch({ type: "SET_MEMBERSHIP", payload: { name: response.data.planName, status: response.data.status } });
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <div className="card space-y-1">
        <h2 className="text-lg font-semibold">{t("membershipTitle")}</h2>
        <p className="text-sm text-slate-500">अपनी पढ़ाई के लिए सही प्लान चुनें।</p>
      </div>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      <div className="space-y-4">
        {plans.map((plan) => (
          <div key={plan.id} className="card space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">{plan.name}</h3>
                <p className="text-xs text-slate-500">{plan.billingCycle}</p>
              </div>
              <span className="text-lg font-semibold">₹{plan.price}</span>
            </div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <button
              type="button"
              className="primary-button"
              onClick={() => handleSubscribe(plan.id)}
              disabled={currentPlan?.planId === plan.id}
            >
              {currentPlan?.planId === plan.id ? "Active Plan" : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Membership;
