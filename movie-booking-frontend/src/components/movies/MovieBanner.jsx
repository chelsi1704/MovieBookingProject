import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_BG = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=600&fit=crop';

const MovieBanner = ({ movies = [] }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (movies.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [movies.length, paused]);

  if (!movies.length) return null;

  const movie = movies[current];

  const prev = () =>
    setCurrent(p => (p - 1 + movies.length) % movies.length);
  const next = () =>
    setCurrent(p => (p + 1) % movies.length);

  return (
    <div
      className="relative h-[85vh] min-h-[500px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={movie.posterUrl || HERO_BG}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          {/* Multiple gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r
                          from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t
                          from-dark via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                        w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl"
            >
              {/* Status */}
              <span className="inline-flex items-center gap-2
                               px-3 py-1 rounded-full text-xs
                               font-semibold mb-4
                               bg-primary/20 text-primary
                               border border-primary/30">
                <span className="w-1.5 h-1.5 rounded-full
                                 bg-primary animate-pulse" />
                {movie.status === 'NOW_PLAYING'
                  ? 'Now Playing'
                  : 'Coming Soon'}
              </span>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl
                             font-bold font-display text-white
                             leading-tight mb-4">
                {movie.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star size={14}
                        className="text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-semibold text-sm">
                    {movie.avgRating?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                {movie.durationMins && (
                  <div className="flex items-center gap-1
                                  text-white/60 text-sm">
                    <Clock size={14} />
                    {Math.floor(movie.durationMins/60)}h{' '}
                    {movie.durationMins%60}m
                  </div>
                )}
                {movie.certificate && (
                  <span className="px-2 py-0.5 border
                                   border-white/30 text-white/70
                                   text-xs rounded">
                    {movie.certificate}
                  </span>
                )}
              </div>

              {/* Genres */}
              <div className="flex gap-2 mb-5 flex-wrap">
                {movie.genres?.slice(0, 3).map(g => (
                  <span
                    key={g}
                    className="px-3 py-1 glass-card text-white/70
                               text-xs rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-white/60 text-sm leading-relaxed
                            mb-6 line-clamp-3 max-w-md">
                {movie.description}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    navigate(`/movies/${movie.id}`)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Play size={16} className="fill-white" />
                  Book Now
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    navigate(`/movies/${movie.id}`)}
                  className="btn-ghost flex items-center gap-2"
                >
                  More Info
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows */}
      {movies.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2
                       z-10 p-3 glass-card hover:border-primary/40
                       transition-all text-white/60 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2
                       z-10 p-3 glass-card hover:border-primary/40
                       transition-all text-white/60 hover:text-white"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2
                      flex gap-2 z-10">
        {movies.slice(0, 6).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`
              h-1 rounded-full transition-all duration-300
              ${i === current
                ? 'w-8 bg-primary'
                : 'w-2 bg-white/30 hover:bg-white/50'}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieBanner;