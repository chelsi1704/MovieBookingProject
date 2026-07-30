import Navbar from "../../components/layout/Navbar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import bookingApi from "../../api/bookingApi";
import Spinner from "../../components/common/Spinner";
import ViewBookingModal from "../../components/admin/ViewBookingModal";

export default function ManageBookingsPage() {
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const res = await bookingApi.getAll();
      return res.data.data;
    },
  });

  const bookings = data.filter((booking) => {
    const keyword = search.toLowerCase();

    return (
      booking.bookingRef.toLowerCase().includes(keyword) ||
      booking.movieTitle.toLowerCase().includes(keyword) ||
      booking.userName.toLowerCase().includes(keyword)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Bookings</h1>

          <input
            type="text"
            placeholder="Search Booking / Movie / User..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 bg-[#1b1b1b] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500"
          />
        </div>

        {/* Total Bookings */}
        <div className="mb-4">
          <span className="text-white/60">Total Bookings :</span>

          <span className="ml-2 text-red-500 font-bold">{bookings.length}</span>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full">
            <thead className="bg-[#0f0f0f] border-b border-white/10">
              <tr>
                <th className="p-4 text-left text-white font-semibold">
                  Booking Ref
                </th>

                <th className="p-4 text-left text-white font-semibold">
                  Movie
                </th>

                <th className="p-4 text-left text-white font-semibold">User</th>

                <th className="p-4 text-left text-white font-semibold">
                  Show Date
                </th>

                <th className="p-4 text-left text-white font-semibold">
                  Seats
                </th>

                <th className="p-4 text-left text-white font-semibold">
                  Amount
                </th>

                <th className="p-4 text-left text-white font-semibold">
                  Status
                </th>

                <th className="p-4 text-left text-white font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="p-4 text-white">{booking.bookingRef}</td>

                  <td className="p-4 text-white">{booking.movieTitle}</td>

                  <td className="p-4 text-white">{booking.userName}</td>

                  <td className="p-4 text-white/70">{booking.showDate}</td>

                  <td className="p-4 text-white/70">{booking.totalSeats}</td>

                  <td className="p-4 text-green-400 font-semibold">
                    ₹{booking.totalAmount}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-500/20 text-green-400"
                          : booking.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : booking.status === "EXPIRED"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowViewModal(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-white"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showViewModal && (
          <ViewBookingModal
            booking={selectedBooking}
            onClose={() => {
              setShowViewModal(false);
              setSelectedBooking(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
