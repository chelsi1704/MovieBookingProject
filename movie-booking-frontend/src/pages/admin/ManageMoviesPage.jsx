import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import movieApi from "../../api/movieApi";
import Spinner from "../../components/common/Spinner";
import noPoster from "../../assets/no-poster.jpg";
//import { useState } from "react";
import AddMovieModal from "../../components/admin/AddMovieModal";
import EditMovieModal from "../../components/admin/EditMovieModal";

const FALLBACK = noPoster;

export default function ManageMoviesPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-movies"],
    queryFn: () =>
      movieApi.getAll({ page: 0, size: 100 }).then((r) => r.data.data),
  });

  const queryClient = useQueryClient();

  const deleteMovieMutation = useMutation({
    mutationFn: (id) => movieApi.delete(id),

    onSuccess: () => {
      toast.success("Movie Deleted");

      queryClient.invalidateQueries({
        queryKey: ["admin-movies"],
      });
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete movie");
    },
  });
  const handleDelete = (movie) => {
    const confirmDelete = window.confirm(`Delete "${movie.title}" ?`);

    if (!confirmDelete) return;

    deleteMovieMutation.mutate(movie.id);
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const movies = data?.content || [];

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Movies</h1>

            <p className="text-white/50 mt-1">Total Movies : {movies.length}</p>
          </div>

          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Movie
          </button>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white/5 border border-white/10
                         rounded-2xl overflow-hidden"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={movie.posterUrl || FALLBACK}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = FALLBACK;
                  }}
                />
              </div>

              <div className="p-4">
                <h2 className="text-white text-lg font-semibold">
                  {movie.title}
                </h2>

                <p className="text-white/50 text-sm mt-2">{movie.status}</p>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => {
                      setSelectedMovie(movie);
                      setShowEditModal(true);
                    }}
                    className="px-4 py-2 rounded-lg
             bg-yellow-500/20
             text-yellow-400"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(movie)}
                    className="px-4 py-2 rounded-lg
             bg-red-500/20
             text-red-400"
                  >
                    Delete
                  </button>

                  <Link
                    to={`/movies/${movie.id}`}
                    className="px-4 py-2 rounded-lg
                               bg-primary/20
                               text-primary"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddMovieModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <EditMovieModal
        open={showEditModal}
        movie={selectedMovie}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMovie(null);
        }}
      />
    </div>
  );
}
