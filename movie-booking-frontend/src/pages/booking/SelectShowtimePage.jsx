// Select showtime — city + date + available shows
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, Ticket } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Spinner from "../../components/common/Spinner";
import showtimeApi from "../../api/showtimeApi";
import movieApi from "../../api/movieApi";

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Rajkot",
];

const SelectShowtimePage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const { data: movie } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => movieApi.getById(movieId).then((r) => r.data.data),
  });

  const { data: availableDates } = useQuery({
    queryKey: ["dates", movieId, city],
    queryFn: async () => {
      const r = await showtimeApi.getAvailableDates(movieId, city);
      console.log("FULL API RESPONSE:", r.data);
      return r.data.data;
    },
    enabled: !!movieId && !!city,
  });
  console.log("city =", city);
  console.log("availableDates =", availableDates);
  console.log("selectedDate =", selectedDate);
  console.log("availableDates =", availableDates);
  const { data: showtimes, isLoading } = useQuery({
    queryKey: ["showtimes", movieId, city, selectedDate],
    queryFn: () =>
      showtimeApi
        .search({
          movieId: parseInt(movieId),
          city,
          showDate: selectedDate,
        })
        .then((r) => r.data.data),
    enabled: !!(city && selectedDate),
  });

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        {/* Movie header */}
        {movie && (
          <div className="flex gap-4 mb-8 items-center">
            <img
              src={movie.posterUrl}
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/300x450?text=No+Poster")
              }
            />
            <div>
              <h1
                className="text-xl font-bold text-white
                             font-display"
              >
                {movie.title}
              </h1>
              <p className="text-white/40 text-sm">
                Select city and date to see showtimes
              </p>
            </div>
          </div>
        )}

        {/* City selection */}
        <div className="glass-card p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} className="text-primary" />
            <span className="text-white font-semibold text-sm">
              Select City
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCity(c);
                  setSelectedDate("");
                }}
                className={`
                  px-3 py-1.5 rounded-full text-xs
                  transition-all duration-200
                  ${
                    city === c
                      ? "bg-primary text-white"
                      : "glass-card text-white/60 hover:text-white"
                  }
                `}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Date selection */}
        {city && availableDates?.length > 0 && (
          <div className="glass-card p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} className="text-primary" />
              <span className="text-white font-semibold text-sm">
                Select Date
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {availableDates.map((date) => {
                const d = new Date(date);
                const isToday = d.toDateString() === new Date().toDateString();
                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      flex flex-col items-center px-4 py-2.5
                      rounded-xl text-xs transition-all
                      ${
                        selectedDate === date
                          ? "bg-primary text-white"
                          : "glass-card text-white/60 hover:text-white"
                      }
                    `}
                  >
                    <span className="font-bold text-sm">{d.getDate()}</span>
                    <span className="uppercase mt-0.5">
                      {d.toLocaleString("en", { month: "short" })}
                    </span>
                    {isToday && (
                      <span
                        className="text-[9px] mt-0.5
                                       text-primary-light"
                      >
                        Today
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Showtimes */}
        {city &&
          selectedDate &&
          (isLoading ? (
            <Spinner className="py-12" size="lg" />
          ) : !showtimes?.length ? (
            <div className="glass-card p-8 text-center">
              <p className="text-white/40">
                No showtimes available for this date
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <h3 className="text-white/60 text-sm mb-1">
                {showtimes.length} showtime(s) available
              </h3>
              {showtimes.map((show, i) => (
                <motion.div
                  key={show.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-5 hover:border-primary/30
                             transition-all cursor-pointer"
                  onClick={() => navigate(`/seats/${show.id}`)}
                >
                  <div
                    className="flex items-center
                                  justify-between"
                  >
                    <div>
                      <p className="text-white font-semibold">
                        {show.theaterName}
                      </p>
                      <p className="text-white/40 text-xs mt-0.5">
                        {show.screenName} • {show.screenType} • {show.language}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className="flex items-center gap-1.5
                                      text-white font-bold"
                      >
                        <Clock size={13} className="text-primary" />
                        {show.startTime?.substring(0, 5)}
                      </div>
                      <p className="text-white/40 text-xs mt-0.5">
                        ₹{show.minPrice}
                        {show.maxPrice !== show.minPrice
                          ? ` – ₹${show.maxPrice}`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-1.5
                                  mt-2 text-xs"
                  >
                    <Ticket
                      size={11}
                      className={
                        show.availableSeats > 10
                          ? "text-green-400"
                          : show.availableSeats > 0
                            ? "text-yellow-400"
                            : "text-red-400"
                      }
                    />
                    <span
                      className={
                        show.availableSeats > 10
                          ? "text-green-400"
                          : show.availableSeats > 0
                            ? "text-yellow-400"
                            : "text-red-400"
                      }
                    >
                      {show.availableSeats > 0
                        ? `${show.availableSeats} seats available`
                        : "Housefull"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default SelectShowtimePage;
