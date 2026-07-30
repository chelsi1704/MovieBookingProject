// Animated seat map page
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Info } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import SeatButton from "../../components/booking/SeatButton";
import CountdownTimer from "../../components/booking/CountdownTimer";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import showtimeApi from "../../api/showtimeApi";
import bookingApi from "../../api/bookingApi";
import toast from "react-hot-toast";

const SeatSelectionPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [booking, setBooking] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);

  // Load seat map
  const {
    data: seatMap,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["seatMap", showtimeId],
    queryFn: () => showtimeApi.getSeatMap(showtimeId).then((r) => r.data.data),
    refetchInterval: 15000, // refresh every 15s
  });

  const toggleSeat = (seat) => {
    setSelected((prev) => {
      const exists = prev.find((s) => s.showtimeSeatId === seat.showtimeSeatId);
      if (exists) {
        return prev.filter((s) => s.showtimeSeatId !== seat.showtimeSeatId);
      }
      if (prev.length >= 10) {
        toast.error("Maximum 10 seats per booking");
        return prev;
      }
      return [...prev, seat];
    });
  };

  const totalPrice = useMemo(
    () => selected.reduce((sum, s) => sum + s.price, 0),
    [selected],
  );

  const handleProceed = async () => {
    if (selected.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    setBooking(true);
    try {
      const response = await bookingApi.create({
        showtimeId: parseInt(showtimeId),
        showtimeSeatIds: selected.map((s) => s.showtimeSeatId),
      });

      console.log("BOOKING RESPONSE =", response);

      const bookingData = response.data.data;

      console.log("BOOKING DATA =", bookingData);

      setExpiresAt(bookingData.expiresAt);

      toast.success("Seats locked! Complete payment within 10 minutes");

      console.log("Before navigate");
      console.log(bookingData);
      navigate("/review-booking", {
        state: {
          booking: bookingData,
        },
      });
    } catch (error) {
      console.log("BOOKING ERROR =", error);
      console.log("ERROR RESPONSE =", error.response);
      console.log("ERROR DATA =", error.response?.data);

      const msg =
        error.response?.data?.message ||
        "Could not lock seats. Please try again.";

      toast.error(msg);

      refetch();
      setSelected([]);
    } finally {
      setBooking(false);
    }
  };

  const rows = seatMap?.seatsByRow || {};
  const rowKeys = Object.keys(rows).sort();

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-24 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60
                       hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>

          <div className="text-center">
            <h1
              className="text-lg font-bold text-white
                           font-display"
            >
              {seatMap?.movieTitle}
            </h1>
            <p className="text-white/40 text-xs">
              {seatMap?.screenName} • {seatMap?.showDate} • {seatMap?.startTime}
            </p>
          </div>
        </div>

        {isLoading ? (
          <Spinner className="py-20" size="lg" />
        ) : (
          <>
            {/* Cinema screen */}
            <div className="mb-10">
              <div
                className="relative mx-auto w-3/4 h-3
                              bg-gradient-to-r from-transparent
                              via-primary/60 to-transparent
                              rounded-full mb-2"
              />
              <div
                className="relative mx-auto"
                style={{
                  width: "80%",
                  height: "30px",
                  background:
                    "linear-gradient(180deg, rgba(229,9,20,0.15) 0%, transparent 100%)",
                  borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
                }}
              ></div>
              <p
                className="text-center text-white/20 text-xs
                            mt-1 uppercase tracking-widest"
              >
                Screen
              </p>
            </div>

            {/* Seat legend */}
            <div className="flex justify-center gap-5 mb-8">
              {[
                { cls: "bg-green-500/80", label: "Available" },
                { cls: "bg-primary", label: "Selected" },
                { cls: "bg-yellow-500/80", label: "Locked" },
                { cls: "bg-gray-600/80", label: "Booked" },
              ].map(({ cls, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 rounded ${cls}`} />
                  <span className="text-white/50 text-xs">{label}</span>
                </div>
              ))}
            </div>

            {/* Seat grid */}
            <div className="flex flex-col gap-2 items-center">
              {rowKeys.map((row) => (
                <div key={row} className="flex items-center gap-2">
                  <span
                    className="text-white/30 text-xs
                                   w-4 text-right font-mono"
                  >
                    {row}
                  </span>
                  <div
                    className="flex gap-1.5 flex-wrap
                                  justify-center"
                  >
                    {rows[row].map((seat, i) => (
                      <SeatButton
                        key={seat.showtimeSeatId}
                        seat={seat}
                        isSelected={
                          !!selected.find(
                            (s) => s.showtimeSeatId === seat.showtimeSeatId,
                          )
                        }
                        onSelect={toggleSeat}
                        index={i}
                      />
                    ))}
                  </div>
                  <span className="w-4" />
                </div>
              ))}
            </div>

            {/* Availability summary */}
            <div
              className="flex justify-center gap-6 mt-8
                            text-xs text-white/40"
            >
              <span>{seatMap?.availableSeats} Available</span>
              <span>{seatMap?.bookedSeats} Booked</span>
            </div>
          </>
        )}
      </div>

      {/* Bottom bar */}
      {selected.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 glass-nav
                     border-t border-white/10 px-4 py-4 z-30"
        >
          <div
            className="max-w-5xl mx-auto flex items-center
                          justify-between gap-4"
          >
            <div>
              <p className="text-white/60 text-xs">
                {selected.length} seat(s) selected
              </p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {selected.map((s) => (
                  <span
                    key={s.showtimeSeatId}
                    className="text-xs glass-card px-2 py-0.5
                               text-primary"
                  >
                    {s.rowLabel}
                    {s.seatNumber}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white/40 text-xs">Total</p>
                <p className="text-white font-bold text-lg">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </p>
              </div>
              <Button
                onClick={handleProceed}
                loading={booking}
                className="whitespace-nowrap"
              >
                Proceed →
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SeatSelectionPage;
