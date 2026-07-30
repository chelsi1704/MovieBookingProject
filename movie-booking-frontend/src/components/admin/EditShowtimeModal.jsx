import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import showtimeApi from "../../api/showtimeApi";
import movieApi from "../../api/movieApi";
import languageApi from "../../api/languageApi";

export default function EditShowtimeModal({
  open,
  onClose,
  showtime,
}) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    movieId: "",
    screenId: "",
    languageId: "",
    showDate: "",
    startTime: "",
    endTime: "",
  });

  const { data: languages = [] } = useQuery({
    queryKey: ["languages"],
    queryFn: () =>
      movieApi
        .getAllLanguages()
        .then((r) => r.data.data),
    enabled: open,
  });

  useEffect(() => {
    if (!showtime) return;

    setForm({
      movieId: showtime.movieId,
      screenId: showtime.screenId,
      languageId: showtime.languageId,
      showDate: showtime.showDate,
      startTime: showtime.startTime?.substring(0, 5),
      endTime: showtime.endTime?.substring(0, 5),
    });
  }, [showtime]);

  const updateMutation = useMutation({
    mutationFn: (data) =>
      showtimeApi.update(showtime.id, data),

    onSuccess: () => {
      toast.success("Showtime updated");

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

  if (!open || !showtime) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "languageId"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateMutation.mutate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-[#111] rounded-2xl p-6 w-[550px]">

        <h2 className="text-2xl font-bold text-white mb-6">
          Edit Showtime
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>
            <label className="text-white/60">
              Movie
            </label>

            <input
              disabled
              value={showtime.movieTitle}
              className="w-full mt-1 p-3 rounded bg-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-white/60">
              Screen
            </label>

            <input
              disabled
              value={showtime.screenName}
              className="w-full mt-1 p-3 rounded bg-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-white/60">
              Language
            </label>

            <select
              name="languageId"
              value={form.languageId}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded bg-white/10 text-white"
            >
              {languages.map((lang) => (
                <option
                  key={lang.id}
                  value={lang.id}
                >
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-white/60">
              Date
            </label>

            <input
              type="date"
              name="showDate"
              value={form.showDate}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded bg-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-white/60">
                Start Time
              </label>

              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded bg-white/10 text-white"
              />
            </div>

            <div>
              <label className="text-white/60">
                End Time
              </label>

              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded bg-white/10 text-white"
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-700 text-white"
            >
              Close
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn-primary"
            >
              {updateMutation.isPending
                ? "Updating..."
                : "Update Showtime"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}