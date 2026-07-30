// 10 minute countdown timer for seat lock
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CountdownTimer = ({ expiresAt }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(null);
  console.log("Countdown expiresAt =", expiresAt);
  console.log("Countdown timeLeft =", timeLeft);

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(expiresAt) - new Date();
      setTimeLeft(Math.max(0, Math.floor(diff / 1000)));
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  // Redirect when expired
  useEffect(() => {
  if (timeLeft === null) return;

  if (timeLeft <= 0) {
    toast.error("Booking session expired.");
    navigate("/");
  }
}, [timeLeft, navigate]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 120; // red when < 2 mins

  return (
    <div
      className={`
      flex items-center gap-2 px-4 py-2 rounded-lg
      glass-card font-mono text-sm font-bold
      ${
        isUrgent
          ? "border-red-500/50 text-red-400 animate-pulse"
          : "border-yellow-500/30 text-yellow-400"
      }
    `}
    >
      <Clock size={14} />
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
};

export default CountdownTimer;
