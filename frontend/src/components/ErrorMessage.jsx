const ErrorMessage = ({ message }) => {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/30 dark:text-rose-200">
      {message}
    </div>
  );
};

export default ErrorMessage;
