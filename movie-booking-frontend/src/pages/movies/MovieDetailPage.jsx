// Full movie detail page with trailer popup, cast, reviews
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Play,
  Star,
  Clock,
  Calendar,
  Globe,
  Heart,
  Share2,
  Ticket,
  ChevronRight,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import TrailerModal from "../../components/movies/TrailerModal";
import Spinner from "../../components/common/Spinner";
import movieApi from "../../api/movieApi";
import { useAuth } from "../../context/AuthContext";

const FALLBACK =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=450&fit=crop";

// Star rating display component
const StarRating = ({ rating, max = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={
          i < Math.round(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-600"
        }
      />
    ))}
  </div>
);

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [trailerOpen, setTrailerOpen] = useState(false);

  const {
    data: movie,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => movieApi.getById(id).then((r) => r.data.data),
  });

  if (isLoading)
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <Spinner className="mt-32" size="lg" />
      </div>
    );

  if (error || !movie)
    return (
      <div
        className="min-h-screen bg-dark flex items-center
                    justify-center"
      >
        <p className="text-white/50">Movie not found</p>
      </div>
    );
  console.log(movie);
  console.log("Movie Trailer =", movie.trailerUrl);
  
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      {/* Hero backdrop */}
      <div
        className="relative h-[70vh] min-h-[450px]
                      overflow-hidden"
      >
        <img
          src={movie.posterUrl || FALLBACK}
          alt={movie.title}
          className="w-full h-full object-cover opacity-40
                     blur-sm scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r
                        from-dark via-dark/70 to-transparent"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t
                        from-dark to-transparent"
        />

        {/* Content over backdrop */}
        <div className="absolute inset-0 flex items-center">
          <div
            className="max-w-7xl mx-auto px-4 sm:px-6
                          lg:px-8 w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row gap-8
                         items-start md:items-end"
            >
              {/* Poster */}
              <div
                className="flex-shrink-0 w-48 md:w-56
                              rounded-xl overflow-hidden
                              shadow-2xl shadow-black/50
                              border border-white/10"
              >
                <img
                  src={movie.posterUrl || FALLBACK}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 pb-4">
                {/* Certificate */}
                {movie.certificate && (
                  <span
                    className="inline-block px-2 py-0.5
                                   border border-white/30
                                   text-white/60 text-xs
                                   rounded mb-3"
                  >
                    {movie.certificate}
                  </span>
                )}

                <h1
                  className="text-4xl md:text-5xl font-bold
                               text-white font-display mb-3
                               leading-tight"
                >
                  {movie.title}
                </h1>

                {/* Rating row */}
                <div
                  className="flex items-center gap-4 mb-3
                                flex-wrap"
                >
                  <div className="flex items-center gap-2">
                    <StarRating rating={movie.avgRating || 0} />
                    <span className="text-white font-semibold">
                      {movie.avgRating?.toFixed(1) || "N/A"}
                    </span>
                    <span className="text-white/40 text-sm">
                      ({movie.totalReviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Meta */}
                <div
                  className="flex flex-wrap gap-4 text-sm
                                text-white/60 mb-4"
                >
                  {movie.durationMins && (
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {Math.floor(movie.durationMins / 60)}h{" "}
                      {movie.durationMins % 60}m
                    </div>
                  )}
                  {movie.releaseDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(movie.releaseDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  )}
                  {movie.languages?.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Globe size={14} />
                      {movie.languages.join(", ")}
                    </div>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {movie.genres?.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 glass-card
                                     text-white/70 text-xs
                                     rounded-full"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  {movie.status === "NOW_PLAYING" && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/booking/${id}`)}
                      className="btn-primary flex items-center
                                 gap-2"
                    >
                      <Ticket size={16} />
                      Book Tickets
                    </motion.button>
                  )}

                  {movie.trailerUrl && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setTrailerOpen(true)}
                      className="btn-ghost flex items-center
                                 gap-2"
                    >
                      <Play size={16} className="fill-white" />
                      Watch Trailer
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Details section */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                      py-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Synopsis */}
            <div className="glass-card p-6">
              <h2
                className="text-lg font-bold text-white mb-3
                             font-display"
              >
                Synopsis
              </h2>
              <p className="text-white/60 leading-relaxed text-sm">
                {movie.description || "No description available."}
              </p>
            </div>

            {/* Cast */}
            {movie.cast?.length > 0 && (
              <div>
                <h2
                  className="text-lg font-bold text-white mb-4
                               font-display"
                >
                  Cast & Crew
                </h2>
                <div
                  className="flex gap-4 overflow-x-auto
                                pb-2 scrollbar-thin"
                >
                  {movie.cast.map((member) => (
                    <div
                      key={member.personId}
                      className="flex-shrink-0 text-center w-20"
                    >
                      <div
                        className="w-16 h-16 rounded-full
                                      overflow-hidden mx-auto mb-2
                                      border-2 border-white/10"
                      >
                        <img
                          src={
                            member.photoUrl ||
                            `https://ui-avatars.com/api/?name=${member.personName}&background=1a1a2e&color=fff`
                          }
                          alt={member.personName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p
                        className="text-white text-xs font-medium
                                    line-clamp-2 leading-tight"
                      >
                        {member.personName}
                      </p>
                      <p className="text-white/40 text-[10px] mt-0.5">
                        {member.characterName || member.roleType}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="glass-card p-5">
              <h3 className="text-white font-semibold mb-4 text-sm">
                Movie Info
              </h3>
              {[
                { label: "Status", value: movie.status },
                { label: "Certificate", value: movie.certificate },
                {
                  label: "Duration",
                  value: movie.durationMins
                    ? `${Math.floor(movie.durationMins / 60)}h ${movie.durationMins % 60}m`
                    : "-",
                },
                {
                  label: "Release Date",
                  value: movie.releaseDate
                    ? new Date(movie.releaseDate).toLocaleDateString("en-IN")
                    : "-",
                },
              ].map((info) => (
                <div
                  key={info.label}
                  className="flex justify-between py-2
                                border-b border-white/5
                                last:border-0"
                >
                  <span className="text-white/40 text-xs">{info.label}</span>
                  <span className="text-white text-xs font-medium">
                    {info.value || "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Trailer modal */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerUrl={movie.trailerUrl}
        title={movie.title}
      />
      <Footer />
    </div>
  );
};

export default MovieDetailPage;
