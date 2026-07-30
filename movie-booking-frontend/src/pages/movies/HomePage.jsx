// Home page — hero banner + movie rows
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronRight, Flame, Calendar, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import MovieBanner from '../../components/movies/MovieBanner';
import MovieCard from '../../components/movies/MovieCard';
import Spinner from '../../components/common/Spinner';
import movieApi from '../../api/movieApi';

// Horizontal scrollable movie row section
const MovieRow = ({ title, icon: Icon, movies, loading, color }) => (
  <section className="mb-12">
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        {/* Colored left bar accent */}
        <div className={`w-1 h-6 ${color} rounded-full`} />
        <Icon size={18} className="text-white/70" />
        <h2 className="text-lg font-bold text-white font-display">
          {title}
        </h2>
      </div>
      <Link
        to={`/search?status=${
          title.includes('Playing') ? 'NOW_PLAYING'
          : title.includes('Upcoming') ? 'UPCOMING'
          : 'NOW_PLAYING'
        }`}
        className="flex items-center gap-1 text-white/40
                   hover:text-primary text-sm transition-colors"
      >
        See all <ChevronRight size={14} />
      </Link>
    </div>

    {loading ? (
      <Spinner className="py-12" size="lg" />
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3
                      md:grid-cols-4 lg:grid-cols-5
                      xl:grid-cols-6 gap-4">
        {movies?.slice(0, 6).map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} index={i} />
        ))}
      </div>
    )}
  </section>
);

const HomePage = () => {
  // Fetch all three movie lists simultaneously
  const { data: nowPlaying, isLoading: l1 } = useQuery({
    queryKey: ['nowPlaying'],
    queryFn: () => movieApi.getNowPlaying().then(r => r.data.data),
  });

  const { data: upcoming, isLoading: l2 } = useQuery({
    queryKey: ['upcoming'],
    queryFn: () => movieApi.getUpcoming().then(r => r.data.data),
  });

  const { data: topRated, isLoading: l3 } = useQuery({
    queryKey: ['topRated'],
    queryFn: () => movieApi.getTopRated().then(r => r.data.data),
  });

  return (
    <div className="min-h-screen bg-dark dark:bg-dark">
      <Navbar />

      {/* Hero banner */}
      <MovieBanner movies={nowPlaying?.slice(0, 6) || []} />

      {/* Movie rows */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                      pt-12">
        <MovieRow
          title="Now Playing"
          icon={Flame}
          movies={nowPlaying}
          loading={l1}
          color="bg-primary"
        />
        <MovieRow
          title="Upcoming Movies"
          icon={Calendar}
          movies={upcoming}
          loading={l2}
          color="bg-blue-500"
        />
        <MovieRow
          title="Top Rated"
          icon={Trophy}
          movies={topRated}
          loading={l3}
          color="bg-yellow-500"
        />
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;