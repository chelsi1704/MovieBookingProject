import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Clock, Heart } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import wishlistApi from "../../api/wishlistApi";
import toast from "react-hot-toast";

// Fallback gradient when no poster available
const FALLBACK =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop";

const MovieCard = ({ movie, index = 0 }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please login to add to wishlist");
      return;
    }
    try {
      if (wishlisted) {
        await wishlistApi.remove(movie.id);
        setWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await wishlistApi.add(movie.id);
        setWishlisted(true);
        toast.success("Added to wishlist ❤️");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <motion.div
      className="movie-card group"
      onClick={() => navigate(`/movies/${movie.id}`)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      {/* Poster image */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl">
        <img
          src={imgError ? FALLBACK : movie.posterUrl || FALLBACK}
          alt={movie.title}
          className="w-full h-full object-cover
             transition-transform duration-500
             group-hover:scale-110"
          onError={() => {
            console.log("IMAGE FAILED:", movie.title);
            console.log("URL:", movie.posterUrl);
            setImgError(true);
          }}
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t
                        from-black via-black/20 to-transparent
                        opacity-80 group-hover:opacity-90
                        transition-opacity"
        />

        {/* Wishlist button */}
        <motion.button
          onClick={handleWishlist}
          whileTap={{ scale: 0.8 }}
          className="absolute top-3 right-3 p-2 rounded-full
                     glass-card opacity-0 group-hover:opacity-100
                     transition-all duration-300"
        >
          <Heart
            size={14}
            className={
              wishlisted ? "text-red-500 fill-red-500" : "text-white/70"
            }
          />
        </motion.button>

        {/* Certificate badge */}
        {movie.certificate && (
          <span
            className="absolute top-3 left-3 px-2 py-0.5
                           text-[10px] font-bold glass-card
                           text-white/80 rounded"
          >
            {movie.certificate}
          </span>
        )}

        {/* Status badge */}
        <div
          className="absolute top-0 left-0 right-0
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-300
                        bg-primary/80 text-white text-xs
                        text-center py-1 font-semibold"
        >
          {movie.status === "NOW_PLAYING"
            ? "🎬 Now Playing"
            : movie.status === "UPCOMING"
              ? "🗓️ Coming Soon"
              : "✅ Ended"}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3
            className="text-white font-semibold text-sm
                         line-clamp-2 mb-1.5 font-display"
          >
            {movie.title}
          </h3>

          <div className="flex items-center justify-between">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star size={11} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white/80 text-xs">
                {movie.avgRating?.toFixed(1) || "N/A"}
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1">
              <Clock size={11} className="text-white/50" />
              <span className="text-white/60 text-xs">
                {movie.durationMins
                  ? `${Math.floor(movie.durationMins / 60)}h ${movie.durationMins % 60}m`
                  : ""}
              </span>
            </div>
          </div>

          {/* Genres */}
          {movie.genres?.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {movie.genres.slice(0, 2).map((g) => (
                <span
                  key={g}
                  className="text-[9px] px-1.5 py-0.5
                             glass-card text-white/50
                             rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
