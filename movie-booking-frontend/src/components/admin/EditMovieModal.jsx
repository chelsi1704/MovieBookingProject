import { useMutation, useQueryClient } from "@tanstack/react-query";
import movieApi from "../../api/movieApi";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function EditMovieModal({ open, onClose, movie }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    posterUrl: "",
    trailerUrl: "",
    durationMins: "",
    releaseDate: "",
    status: "",
    certificate: "",
  });

  useEffect(() => {
    if (movie) {
      setForm({
        title: movie.title || "",
        description: movie.description || "",
        posterUrl: movie.posterUrl || "",
        trailerUrl: movie.trailerUrl || "",
        durationMins: movie.durationMins || "",
        releaseDate: movie.releaseDate || "",
        status: movie.status || "",
        certificate: movie.certificate || "",
      });
    }
  }, [movie]);
  const queryClient = useQueryClient();

  const updateMovieMutation = useMutation({
    mutationFn: ({ id, data }) => movieApi.update(id, data),

    onSuccess: () => {
      toast.success("Movie Updated Successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-movies"],
      });

      onClose();
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update movie");
    },
  });

  if (!open || !movie) return null;

  const handleUpdate = () => {
    const payload = {
      title: form.title,
      description: form.description,
      posterUrl: form.posterUrl,
      trailerUrl: form.trailerUrl,
      durationMins: Number(form.durationMins),
      releaseDate: form.releaseDate,
      status: form.status,
      certificate: form.certificate,
    };

    console.log("UPDATE PAYLOAD =", payload);

    updateMovieMutation.mutate({
      id: movie.id,
      data: payload,
    });
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-2xl font-bold">Edit Movie</h2>

          <button onClick={onClose} className="text-white text-2xl">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            className={inputClass}
            value={form.title}
            placeholder="Movie Title"
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />

          <input
            className={inputClass}
            value={form.posterUrl}
            placeholder="Poster URL"
            onChange={(e) =>
              setForm({
                ...form,
                posterUrl: e.target.value,
              })
            }
          />

          <input
            className={inputClass}
            value={form.durationMins}
            placeholder="Duration"
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
        </div>

        <textarea
          rows={5}
          className="w-full mt-4 bg-black/40 border border-white/10 rounded-xl p-4 text-white"
          value={form.description}
          placeholder="Description"
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-white/10 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-5 py-2 rounded-lg bg-red-600 text-white"
          >
            {updateMovieMutation.isPending ? "Updating..." : "Update Movie"}
          </button>
        </div>
      </div>
    </div>
  );
}
