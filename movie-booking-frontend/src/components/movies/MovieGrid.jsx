import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import Spinner from '../common/Spinner';

const MovieGrid = ({ 
  movies = [], 
  loading = false, 
  error = null,
  onMovieClick,
  columns = 'auto',
  gap = 'gap-6',
  className = '',
  emptyMessage = 'No movies found',
  showFilters = false,
  onFilterChange,
  ...props 
}) => {
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [sortBy, setSortBy] = useState('trending');

  // Extract unique genres and languages from movies
  const uniqueGenres = [...new Set(movies.flatMap(m => m.genres || []))];
  const uniqueLanguages = [...new Set(movies.map(m => m.language).filter(Boolean))];

  // Filter and sort movies
  useEffect(() => {
    let filtered = [...movies];

    // Genre filter
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(movie =>
        movie.genres?.some(genre => selectedGenres.includes(genre))
      );
    }

    // Language filter
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter(movie =>
        selectedLanguages.includes(movie.language)
      );
    }

    // Sort
    switch (sortBy) {
      case 'trending':
        filtered.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'upcoming':
        filtered.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        break;
      default:
        break;
    }

    setFilteredMovies(filtered);
    onFilterChange?.(filtered);
  }, [movies, selectedGenres, selectedLanguages, sortBy, onFilterChange]);

  // Determine grid columns based on screen size
  const getGridColumns = () => {
    if (columns === 'auto') {
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
    }
    return `grid-cols-${columns}`;
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleLanguageToggle = (language) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const handleClearFilters = () => {
    setSelectedGenres([]);
    setSelectedLanguages([]);
    setSortBy('trending');
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      {/* Filters Section */}
      {showFilters && (
        <div className="mb-8 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg border border-gray-700">
          {/* Sort Options */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Sort By
            </label>
            <div className="flex flex-wrap gap-2">
              {['trending', 'rating', 'upcoming', 'recent'].map(option => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    sortBy === option
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Genre Filter */}
          {uniqueGenres.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Genres
              </label>
              <div className="flex flex-wrap gap-2">
                {uniqueGenres.map(genre => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedGenres.includes(genre)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Language Filter */}
          {uniqueLanguages.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Languages
              </label>
              <div className="flex flex-wrap gap-2">
                {uniqueLanguages.map(language => (
                  <button
                    key={language}
                    onClick={() => handleLanguageToggle(language)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedLanguages.includes(language)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {(selectedGenres.length > 0 || selectedLanguages.length > 0 || sortBy !== 'trending') && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      {!loading && (
        <div className="mb-4 text-gray-400 text-sm">
          Showing {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12 bg-red-900/10 border border-red-600/30 rounded-lg">
          <div className="text-center">
            <p className="text-red-500 font-semibold mb-2">Error Loading Movies</p>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredMovies.length === 0 && (
        <div className="flex items-center justify-center py-20 bg-gray-900/30 rounded-lg border border-gray-700">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-gray-600 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 4v16m10-16v16M3 8h18M3 16h18"
              />
            </svg>
            <p className="text-gray-400 font-medium">{emptyMessage}</p>
          </div>
        </div>
      )}

      {/* Movies Grid */}
      {!loading && !error && filteredMovies.length > 0 && (
        <div className={`grid ${getGridColumns()} ${gap}`}>
          {filteredMovies.map(movie => (
            <div key={movie.id} onClick={() => onMovieClick?.(movie)}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieGrid;
