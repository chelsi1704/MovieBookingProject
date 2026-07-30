import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import showtimeApi from "../../api/showtimeApi";
import Spinner from "../../components/common/Spinner";
import AddShowtimeModal from "../../components/admin/AddShowtimeModal";
import EditShowtimeModal from "../../components/admin/EditShowtimeModal";

export default function ManageShowtimesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  const queryClient = useQueryClient();

  // Fetch showtimes
  const { data, isLoading } = useQuery({
    queryKey: ["admin-showtimes"],
    queryFn: () =>
      showtimeApi.getAll().then((res) => res.data.data),
  });

  const showtimes = data || [];

  // Cancel Showtime
  const cancelMutation = useMutation({
    mutationFn: (id) => showtimeApi.delete(id),

    onSuccess: () => {
      toast.success("Showtime cancelled");

      queryClient.invalidateQueries({
        queryKey: ["admin-showtimes"],
      });
    },

    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
          "Failed to cancel showtime"
      );
    },
  });

  const handleCancel = (showtime) => {
    const confirmDelete = window.confirm(
      `Cancel "${showtime.movieTitle}" showtime?`
    );

    if (!confirmDelete) return;

    cancelMutation.mutate(showtime.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Manage Showtimes
            </h1>

            <p className="text-white/50">
              Total Showtimes : {showtimes.length}
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add Showtime
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4 text-left text-white/60">Movie</th>
                <th className="p-4 text-left text-white/60">Theater</th>
                <th className="p-4 text-left text-white/60">Screen</th>
                <th className="p-4 text-left text-white/60">Date</th>
                <th className="p-4 text-left text-white/60">Time</th>
                <th className="p-4 text-left text-white/60">Seats</th>
                <th className="p-4 text-left text-white/60">Actions</th>
              </tr>
            </thead>

            <tbody>
              {showtimes.map((showtime) => (
                <tr
                  key={showtime.id}
                  className="border-t border-white/10"
                >
                  <td className="p-4 text-white">
                    {showtime.movieTitle}
                  </td>

                  <td className="p-4 text-white/70">
                    {showtime.theaterName}
                  </td>

                  <td className="p-4 text-white/70">
                    {showtime.screenName}
                  </td>

                  <td className="p-4 text-white/70">
                    {showtime.showDate}
                  </td>

                  <td className="p-4 text-white/70">
                    {showtime.startTime}
                  </td>

                  <td className="p-4 text-white/70">
                    {showtime.availableSeats}/{showtime.totalSeats}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">

                      <button
                        className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400"
                        onClick={() => {
                          setSelectedShowtime(showtime);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400"
                        onClick={() => handleCancel(showtime)}
                      >
                        Cancel
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

              {showtimes.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-white/40"
                  >
                    No showtimes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Showtime */}
        <AddShowtimeModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
        />

        {/* Edit Showtime */}
        <EditShowtimeModal
          open={showEditModal}
          showtime={selectedShowtime}
          onClose={() => {
            setShowEditModal(false);
            setSelectedShowtime(null);
          }}
        />

      </div>
    </div>
  );
}