// Fake card payment page with flip animation + processing animation
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { CreditCard, Lock, CheckCircle } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import paymentApi from "../../api/paymentApi";
import toast from "react-hot-toast";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { order, booking } = state || {};

  const [flipped, setFlipped] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [paymentData, setPaymentData] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const cardNumber = watch("cardNumber", "");
  const cardName = watch("cardHolderName", "");
  const expiry = watch("expiry", "");

  if (!order || !booking) {
    navigate("/");
    return null;
  }

  const formatCardDisplay = (num) => {
    const clean = num.replace(/\D/g, "").slice(0, 16);
    const groups = clean.match(/.{1,4}/g) || [];
    const display = groups.join(" ");
    return display.padEnd(19, "•").replace(/•/g, " ••••").slice(0, 19);
  };
  const onSubmit = async (data) => {
    setPaymentData(data);

    try {
      await paymentApi.sendOtp(booking.id);
      toast.success("OTP sent");
      setOtpSent(true);
    } catch (error) {
      toast.error("OTP Failed");
    }
  };
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Enter OTP");
      return;
    }

    try {
      await paymentApi.verifyOtp(booking.id, otp);

      toast.success("OTP verified");

      await handlePayment(paymentData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);

      const response = await paymentApi.confirm({
        bookingRef: booking.bookingRef,
        cardNumber: paymentData.cardNumber.replace(/\s/g, ""),
        expiry: paymentData.expiry,
        cvv: paymentData.cvv,
        cardHolderName: paymentData.cardHolderName,
        paymentMethod: "CARD",
      });

      navigate("/booking-confirmed", {
        state: {
          booking: response.data.data,
        },
      });
    } catch (error) {
      console.log("FULL ERROR =", error);
      console.log("RESPONSE =", error.response);
      console.log("DATA =", error.response?.data);
      console.log("ERRORS =", error.response?.data?.errors);

      toast.error(error.response?.data?.message || "Payment failed");
      setProcessing(false);
    }
  };
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-md mx-auto px-4 pt-24 pb-12">
        <h1
          className="text-xl font-bold text-white
                       font-display mb-2 text-center"
        >
          Secure Payment
        </h1>
        <p className="text-white/40 text-sm text-center mb-8">
          Amount:{" "}
          <span className="text-primary font-bold">
            ₹{order.amount?.toLocaleString("en-IN")}
          </span>
        </p>

        {/* Credit card visualization */}
        <div
          className="relative h-48 mb-8 cursor-pointer
                     perspective-1000"
          style={{ perspective: "1000px" }}
          onClick={() => setFlipped((p) => !p)}
        >
          <motion.div
            className="relative w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          >
            {/* Card Front */}
            <div
              className="absolute inset-0 rounded-2xl p-6
                         overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                background:
                  "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
                border: "1px solid rgba(229,9,20,0.3)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Chip */}
              <div
                className="w-10 h-8 rounded bg-yellow-400/80
                              mb-4 grid grid-cols-3 grid-rows-3
                              gap-0.5 p-0.5"
              >
                {Array(9)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="bg-yellow-600/60 rounded-sm" />
                  ))}
              </div>

              <p
                className="text-white font-mono text-lg
                            tracking-widest mb-3"
              >
                {cardNumber
                  ? cardNumber
                      .replace(/\D/g, "")
                      .slice(0, 16)
                      .replace(/(.{4})/g, "$1 ")
                      .trim()
                  : "•••• •••• •••• ••••"}
              </p>

              <div className="flex justify-between items-end">
                <div>
                  <p
                    className="text-white/30 text-[9px]
                                uppercase mb-0.5"
                  >
                    Card Holder
                  </p>
                  <p
                    className="text-white text-sm
                                uppercase tracking-wide"
                  >
                    {cardName || "YOUR NAME"}
                  </p>
                </div>
                <div>
                  <p
                    className="text-white/30 text-[9px]
                                uppercase mb-0.5"
                  >
                    Expires
                  </p>
                  <p className="text-white text-sm">{expiry || "MM/YY"}</p>
                </div>
                <div className="text-right">
                  <div className="flex gap-1">
                    <div
                      className="w-7 h-7 rounded-full
                                    bg-red-500/80"
                    />
                    <div
                      className="w-7 h-7 rounded-full
                                    bg-yellow-500/80 -ml-3"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card Back */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background: "linear-gradient(135deg, #1a1a2e, #0f3460)",
                border: "1px solid rgba(229,9,20,0.3)",
              }}
            >
              <div className="w-full h-10 bg-gray-800 mt-6" />
              <div
                className="mx-6 mt-4 bg-gray-200 h-10
                              rounded flex items-center
                              justify-end pr-3"
              >
                <p
                  className="text-gray-800 font-mono text-sm
                              tracking-widest"
                >
                  •••
                </p>
              </div>
              <p
                className="text-white/20 text-xs text-center
                            mt-3"
              >
                Click card to flip
              </p>
            </div>
          </motion.div>
        </div>

        <p
          className="text-white/30 text-[10px] text-center
                      mb-5"
        >
          Click the card to see the back (CVV)
        </p>

        {/* Payment form */}
        <AnimatePresence mode="wait">
          {processing ? (
            // PROCESSING SCREEN
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-8 text-center"
            >
              {step === "Payment successful! ✓" ? (
                <>
                  <CheckCircle
                    size={48}
                    className="text-green-400 mx-auto mb-3"
                  />
                  <p className="text-green-400">{step}</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                  <p>{step}</p>
                </>
              )}
            </motion.div>
          ) : !otpSent ? (
            // PAYMENT FORM
            <motion.form
              key="payment-form"
              onSubmit={handleSubmit(onSubmit)}
              className="glass-card p-6 flex flex-col gap-4"
            >
              {/* Card Number */}
              <div>
                <label className="text-white/70 text-xs font-medium mb-1.5 block">
                  Card Number
                </label>

                <div className="relative">
                  <CreditCard
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`glass-input pl-10 ${
                      errors.cardNumber ? "border-red-500/60" : ""
                    }`}
                    {...register("cardNumber", {
                      required: "Card number required",
                      onChange: (e) => {
                        const value =
                          e.target.value
                            .replace(/\D/g, "")
                            .match(/.{1,4}/g)
                            ?.join(" ") || "";

                        e.target.value = value;
                      },
                    })}
                  />
                </div>
              </div>

              {/* Card Holder */}
              <div>
                <label className="text-white/70 text-xs font-medium mb-1.5 block">
                  Card Holder Name
                </label>

                <input
                  type="text"
                  placeholder="John Doe"
                  className="glass-input uppercase"
                  {...register("cardHolderName", {
                    required: "Name required",
                  })}
                />
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/70 text-xs font-medium mb-1.5 block">
                    Expiry
                  </label>

                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="glass-input"
                    {...register("expiry", {
                      required: "Required",
                      onChange: (e) => {
                        let value = e.target.value.replace(/\D/g, "");

                        if (value.length >= 2) {
                          value = value.slice(0, 2) + "/" + value.slice(2, 4);
                        }

                        e.target.value = value;
                      },
                    })}
                  />
                </div>

                <div>
                  <label className="text-white/70 text-xs font-medium mb-1.5 block">
                    CVV
                  </label>

                  <input
                    type="text"
                    placeholder="•••"
                    maxLength={3}
                    onFocus={() => setFlipped(true)}
                    onBlur={() => setFlipped(false)}
                    className="glass-input"
                    {...register("cvv", {
                      required: "Required",
                    })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              >
                <Lock size={14} />
                Pay ₹{order.amount?.toLocaleString("en-IN")}
              </button>

              <p className="text-center text-white/20 text-xs">
                🔒 This is a demo — no real charges
              </p>

              <button type="submit" className="btn-primary w-full">
                Pay ₹{order.amount}
              </button>
            </motion.form>
          ) : (
            // OTP SCREEN
            <motion.div
              key="otp"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-6"
            >
              <h2 className="text-white text-lg mb-4">Verify OTP</h2>

              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="glass-input w-full mb-4"
              />

              <button onClick={handleVerifyOtp} className="btn-primary w-full">
                Verify OTP
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PaymentPage;
