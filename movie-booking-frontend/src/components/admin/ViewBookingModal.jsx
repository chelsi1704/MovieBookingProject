export default function ViewBookingModal({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-2xl w-[650px] p-6">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl text-white font-bold">
            Booking Details
          </h2>

          <button
            onClick={onClose}
            className="text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 text-white">

          <p><b>Booking Ref:</b> {booking.bookingRef}</p>

          <p><b>Movie:</b> {booking.movieTitle}</p>

          <p><b>User:</b> {booking.userName}</p>

          <p><b>Email:</b> {booking.userEmail}</p>

          <p><b>Theater:</b> {booking.theaterName}</p>

          <p><b>Screen:</b> {booking.screenName}</p>

          <p><b>Date:</b> {booking.showDate}</p>

          <p><b>Time:</b> {booking.showTime}</p>

          <p><b>Language:</b> {booking.language}</p>

          <p><b>Total Seats:</b> {booking.totalSeats}</p>

          <p><b>Total Amount:</b> ₹ {booking.totalAmount}</p>

          <p><b>Status:</b> {booking.status}</p>

          <div>
            <b>Seats:</b>

            <div className="flex gap-2 mt-2 flex-wrap">
              {booking.seats?.map((seat) => (
                <span
                  key={seat.bookingSeatId}
                  className="bg-red-600 px-3 py-1 rounded-full"
                >
                  {seat.rowLabel}
                  {seat.seatNumber}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}