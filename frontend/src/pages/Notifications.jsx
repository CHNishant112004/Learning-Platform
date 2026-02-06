import { useEffect, useState } from "react";
import { NotificationService } from "../services/api.js";
import { createNotificationHub } from "../services/notificationsHub.js";
import { useApp } from "../context/AppContext.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const Notifications = () => {
  const { state, dispatch, t } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    NotificationService.list()
      .then((response) => dispatch({ type: "SET_NOTIFICATIONS", payload: response.data }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (!state.user?.id) {
      return undefined;
    }
    const connection = createNotificationHub();
    connection.on("notification", (notification) => {
      dispatch({ type: "ADD_NOTIFICATION", payload: notification });
    });
    connection
      .start()
      .then(() => connection.invoke("JoinUserRoom", state.user.id))
      .catch(() => {});

    return () => {
      connection.stop();
    };
  }, [dispatch, state.user?.id]);

  const handleMarkRead = (notificationId) => {
    NotificationService.markRead({ notificationId })
      .then(() => dispatch({ type: "MARK_NOTIFICATION_READ", payload: notificationId }))
      .catch((err) => setError(err.message));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <div className="card space-y-1">
        <h2 className="text-lg font-semibold">{t("notificationsTitle")}</h2>
        <p className="text-sm text-slate-500">नई अपडेट्स यहाँ दिखेंगी।</p>
      </div>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      <div className="space-y-4">
        {state.notifications.length === 0 && !loading ? (
          <div className="card text-sm text-slate-500">कोई नोटिफिकेशन नहीं है।</div>
        ) : (
          state.notifications.map((notification) => (
            <div key={notification.id} className="card flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{notification.title}</p>
                <p className="text-xs text-slate-500">{notification.message}</p>
              </div>
              {!notification.isRead && (
                <button
                  type="button"
                  className="rounded-full border border-brand-200 px-3 py-1 text-xs font-semibold text-brand-600"
                  onClick={() => handleMarkRead(notification.id)}
                >
                  पढ़ा हुआ
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
