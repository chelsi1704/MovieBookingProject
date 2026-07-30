import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import genreApi from "../../api/genreApi";
import languageApi from "../../api/languageApi";
import movieApi from "../../api/movieApi";
import toast from "react-hot-toast";
import { useState } from "react";
//import movieBookLogo from "../../assets/moviebook-logo.png";
export default function AddMovieModal({ open, onClose }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    posterUrl: "",
    trailerUrl: "",
    durationMins: "",
    certificate: "",
    releaseDate: "",
    status: "UPCOMING",
    director: "",
    cast: "",
    genres: [],
    languages: [],
  });
  const queryClient = useQueryClient();
  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: () => genreApi.getAll().then((r) => r.data.data),
  });

  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: () => languageApi.getAll().then((r) => r.data.data),
  });
  const createMovieMutation = useMutation({
    mutationFn: (data) => movieApi.create(data),

    onSuccess: () => {
      toast.success("Movie Added Successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-movies"],
      });

      onClose();
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add movie");
    },
  });

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast.error("Movie title is required");
      return;
    }

    if (!form.durationMins) {
      toast.error("Duration is required");
      return;
    }

    if (!form.releaseDate) {
      toast.error("Release date is required");
      return;
    }

    if (!form.certificate) {
      toast.error("Certificate is required");
      return;
    }

    if (form.genres.length === 0) {
      toast.error("Select at least one genre");
      return;
    }

    if (form.languages.length === 0) {
      toast.error("Select at least one language");
      return;
    }
    const payload = {
      title: form.title,
      description: form.description,
      posterUrl: form.posterUrl,
      trailerUrl: form.trailerUrl,
      durationMins: Number(form.durationMins),
      releaseDate: form.releaseDate,
      status: form.status,
      certificate: form.certificate,
      genreIds: form.genres,
      languageIds: form.languages,
      cast: [],
      imageUrls: [],
    };
    console.log("PAYLOAD =", payload);
    createMovieMutation.mutate(payload);
  };
  const inputClass = `
    w-full
    bg-black/40
    border border-white/10
    rounded-xl
    px-4 py-3
    text-white
    placeholder:text-white/30
    focus:outline-none
    focus:border-primary
  `;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center  p-4
    overflow-y-auto"
    >
      <div
        className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl
    max-h-[90vh]
    overflow-y-auto
    p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add Movie</h2>

          <button onClick={onClose} className="text-white text-2xl">
            ✕
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Movie Title"
            className={inputClass}
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />

          <input
            placeholder="Poster URL"
            className={inputClass}
            value={form.posterUrl}
            onChange={(e) =>
              setForm({
                ...form,
                posterUrl: e.target.value,
              })
            }
          />

          {/* Poster Preview */}
          {form.posterUrl && (
            <div className="mt-4">
              <p className="text-sm text-white/60 mb-2">Poster Preview</p>

              <img
                src={form.posterUrl}
                alt="Poster Preview"
                className="w-40 h-60 object-cover rounded-lg border border-white/20"
                onError={(e) => {
                  e.target.src = "/no-poster.jpg"; // athva tamaro fallback image
                }}
              />
            </div>
          )}

          <input
            placeholder="Duration (mins)"
            className={inputClass}
            value={form.durationMins}
            onChange={(e) =>
              setForm({
                ...form,
                durationMins: e.target.value,
              })
            }
          />

          <input
            type="date"
            className={inputClass}
            value={form.releaseDate}
            onChange={(e) =>
              setForm({
                ...form,
                releaseDate: e.target.value,
              })
            }
          />

          <input
            placeholder="Trailer URL"
            className={inputClass}
            value={form.trailerUrl}
            onChange={(e) =>
              setForm({
                ...form,
                trailerUrl: e.target.value,
              })
            }
          />

          <select
            className={inputClass}
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
          >
            <option value="UPCOMING">Upcoming</option>
            <option value="NOW_PLAYING">Now Playing</option>
            <option value="ENDED">Ended</option>
          </select>
        </div>
        <select
          className={inputClass}
          value={form.certificate}
          onChange={(e) =>
            setForm({
              ...form,
              certificate: e.target.value,
            })
          }
        >
          <option value="">Certificate</option>
          <option value="U">U</option>
          <option value="UA">UA</option>
          <option value="A">A</option>
          <option value="S">S</option>
        </select>
        {/* Description */}
        <div className="grid grid-cols-[1fr_140px] gap-4 mt-4">
          {/* Description */}
          <textarea
            rows={4}
            placeholder="Description"
            className="
      w-full
      bg-black/40
      border border-white/10
      rounded-xl
      p-4
      text-white
      placeholder:text-white/30
      focus:outline-none
      focus:border-primary
    "
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          {/* Poster Preview */}
          <div className="flex flex-col items-center">
            <p className="text-white font-medium mb-2">Poster Preview</p>

            <div
              className="
        w-32 h-44
        rounded-xl
        border border-white/10
        bg-black/40
        flex items-center justify-center
        overflow-hidden
      "
            >
              {form.posterUrl ? (
                <img
                  src={form.posterUrl}
                  alt="Poster Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-2">🎬</div>

                  <h3 className="text-red-500 font-bold text-lg">MOVIEBOOK</h3>

                  <p className="text-white/40 text-xs mt-2">
                    Enter poster URL
                    <br />
                    to see preview
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Genres */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-3 max-h-40 overflow-y-auto">
            <p className="text-white/60 text-sm mb-3">Genres</p>

            <div className="flex flex-wrap gap-2">
              {genres?.map((genre) => {
                const selected = form.genres.includes(genre.id);

                return (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        genres: selected
                          ? form.genres.filter((id) => id !== genre.id)
                          : [...form.genres, genre.id],
                      })
                    }
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      selected
                        ? "bg-red-600 text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {genre.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-3 max-h-40 overflow-y-auto">
            <p className="text-white/60 text-sm mb-3">Languages</p>

            <div className="flex flex-wrap gap-2">
              {languages?.map((language) => {
                const selected = form.languages.includes(language.id);

                return (
                  <button
                    key={language.id}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        languages: selected
                          ? form.languages.filter((id) => id !== language.id)
                          : [...form.languages, language.id],
                      })
                    }
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      selected
                        ? "bg-red-600 text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {language.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="
              px-5 py-2
              rounded-lg
              bg-white/10
              text-white
            "
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="
    px-5 py-2
    rounded-lg
    bg-red-600
    text-white
  "
          >
            {createMovieMutation.isPending ? "Saving..." : "Save Movie"}
          </button>
        </div>
      </div>
    </div>
  );
}
