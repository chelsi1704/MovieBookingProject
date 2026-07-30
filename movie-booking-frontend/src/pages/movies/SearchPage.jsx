// Movie search and filter page
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import MovieCard from '../../components/movies/MovieCard';
import Spinner from '../../components/common/Spinner';
import movieApi from '../../api/movieApi';

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const [genreId, setGenreId] = useState(null);
  const [languageId, setLanguageId] = useState(null);
  const [status, setStatus] = useState(
    params.get('status') || ''
  );

  // Genres and languages for filters
  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: () =>
      movieApi.getAllGenres().then(r => r.data.data),
  });

  const { data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: () =>
      movieApi.getAllLanguages().then(r => r.data.data),
  });

  // Search results
  const { data: movies, isLoading } = useQuery({
    queryKey: ['search', search, genreId, languageId, status],
    queryFn: () =>
      movieApi.search({
        title: search || undefined,
        genreId: genreId || undefined,
        languageId: languageId || undefined,
        status: status || undefined,
        page: 0,
        size: 24,
      }).then(r => r.data.data?.content || []),
    enabled: true,
  });

  const clearFilters = () => {
    setSearch('');
    setGenreId(null);
    setLanguageId(null);
    setStatus('');
  };

  const hasFilters = search || genreId || languageId || status;

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6
                      lg:px-8 pt-24 pb-12">
        <h1 className="text-2xl font-bold text-white
                       font-display mb-6">
          Search Movies
        </h1>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search size={18}
                  className="absolute left-4 top-1/2
                             -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search movies..."
            className="glass-input pl-12 pr-4 py-4 text-base
                       w-full"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2
                         -translate-y-1/2 text-white/30
                         hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {/* Status filter */}
          {['', 'NOW_PLAYING', 'UPCOMING'].map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`
                px-4 py-2 rounded-full text-sm
                transition-all duration-200
                ${status === s
                  ? 'bg-primary text-white'
                  : 'glass-card text-white/60 hover:text-white'}
              `}
            >
              {s === '' ? 'All'
               : s === 'NOW_PLAYING' ? 'Now Playing'
               : 'Upcoming'}
            </button>
          ))}

          {/* Genre filter */}
          <select
            value={genreId || ''}
            onChange={e => setGenreId(e.target.value || null)}
            className="glass-input py-2 px-3 text-sm w-auto
                       cursor-pointer"
          >
            <option value="">All Genres</option>
            {genres?.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          {/* Language filter */}
          <select
            value={languageId || ''}
            onChange={e =>
              setLanguageId(e.target.value || null)}
            className="glass-input py-2 px-3 text-sm w-auto
                       cursor-pointer"
          >
            <option value="">All Languages</option>
            {languages?.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-4 py-2
                         rounded-full text-sm text-red-400
                         border border-red-400/30
                         hover:bg-red-400/10 transition-all"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <Spinner className="py-20" size="lg" />
        ) : !movies?.length ? (
          <div className="text-center py-20">
            <p className="text-white/30 text-lg">
              No movies found
            </p>
            <p className="text-white/20 text-sm mt-2">
              Try different search terms or filters
            </p>
          </div>
        ) : (
          <>
            <p className="text-white/40 text-sm mb-5">
              {movies.length} movie(s) found
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3
                            md:grid-cols-4 lg:grid-cols-5
                            xl:grid-cols-6 gap-4">
              {movies.map((movie, i) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  index={i}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;