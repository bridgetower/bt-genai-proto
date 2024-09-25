import { useNavigate } from "react-router-dom";

const NetworkError = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    // Logic for retrying, e.g., re-fetching the API
    window.location.reload(); // Simple page reload for demo purposes.
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="text-center max-w-md mx-auto p-6 bg-white  pt-32 mt-auto">
      <img src="/images/no-internet.png" alt="Disconnected" className="w-36 mx-auto" />
      <h1 className="text-3xl font-bold text-red-600 mb-4">Oops! Network Error</h1>
    </div>
  );
};

export default NetworkError;
