import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import movieApi from "../../api/movieApi";
import languageApi from "../../api/languageApi";
import screenApi from "../../api/screenApi";
import showtimeApi from "../../api/showtimeApi";

export default function AddShowtimeModal({
  open,
  onClose,
  editMode = false,
  showtime = null,
}) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    movieId: "",
    screenId: "",
    languageId: "",
    showDate: "",
    startTime: "",
  });

  useEffect(() => {
    if (editMode && showtime) {
      setForm({
        movieId: showtime.movieId || "",
        screenId: showtime.screenId || "",
        languageId: showtime.languageId || "",
        showDate: showtime.showDate || "",
        startTime: showtime.startTime
          ? showtime.startTime.slice(0, 5)
          : "",
      });
    } else {
      setForm({
        movieId: "",
        screenId: "",
        languageId: "",
        showDate: "",
        startTime: "",
      });
    }
  }, [editMode, showtime]);

  const { data: movies } = useQuery({
    queryKey: ["movies-dropdown"],
    queryFn: () =>
      movieApi
        .getAll({
          page: 0,
          size: 100,
        })
        .then((r) => r.data.data.content),
    enabled: open,
  });

  const { data: languages } = useQuery({
    queryKey: ["languages-dropdown"],
    queryFn: () =>
      languageApi.getAll().then((r) => r.data.data),
    enabled: open,
  });

  const { data: screens } = useQuery({
    queryKey: ["screens-dropdown"],
    queryFn: () =>
      screenApi.getAll().then((r) => r.data.data),
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: (data) => showtimeApi.create(data),

    onSuccess: () => {
      toast.success("Showtime Created");

      queryClient.invalidateQueries({
        queryKey: ["admin-showtimes"],
      });

      onClose();
    },

    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
          "Failed to create showtime"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      showtimeApi.update(id, data),

    onSuccess: () => {
      toast.success("Showtime Updated");

      queryClient.invalidateQueries({
        queryKey: ["admin-showtimes"],
      });

      onClose();
    },

    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
          "Failed to update showtime"
      );
    },
  });

  if (!open) return null;

  const inputClass = `
    w-full
    bg-black/40
    border border-white/10
    rounded-xl
    px-4 py-3
    text-white
    focus:outline-none
    focus:border-primary
  `;

  const handleSubmit = () => {
    const payload = {
      movieId: Number(form.movieId),
      screenId: Number(form.screenId),
      languageId: Number(form.languageId),
      showDate: form.showDate,
      startTime: form.startTime,
    };

    if (editMode) {
      updateMutation.mutate({
        id: showtime.id,
        data: payload,
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-[#111] rounded-2xl border border-white/10 p-6 w-full max-w-2xl">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {editMode
              ? "Edit Showtime"
              : "Add Showtime"}
          </h2>

          <button
            onClick={onClose}
            className="text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            className={inputClass}
            value={form.movieId}
            onChange={(e) =>
              setForm({
                ...form,
                movieId: e.target.value,
              })
            }
          >
            <option value="">
              Select Movie
            </option>

            {movies?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>

          <select
            className={inputClass}
            value={form.screenId}
            onChange={(e) =>
              setForm({
                ...form,
                screenId: e.target.value,
              })
            }
          >
            <option value="">
              Select Screen
            </option>

            {screens?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.screenName}
              </option>
            ))}
          </select>

          <select
            className={inputClass}
            value={form.languageId}
            onChange={(e) =>
              setForm({
                ...form,
                languageId: e.target.value,
              })
            }
          >
            <option value="">
              Select Language
            </option>

            {languages?.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className={inputClass}
            value={form.showDate}
            onChange={(e) =>
              setForm({
                ...form,
                showDate: e.target.value,
              })
            }
          />

          <input
            type="time"
            className={inputClass}
            value={form.startTime}
            onChange={(e) =>
              setForm({
                ...form,
                startTime: e.target.value,
              })
            }
          />
        </div>

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
            {editMode
              ? updateMutation.isPending
                ? "Updating..."
                : "Update Showtime"
              : createMutation.isPending
              ? "Creating..."
              : "Create Showtime"}
          </button>
        </div>
      </div>
    </div>
  );
}