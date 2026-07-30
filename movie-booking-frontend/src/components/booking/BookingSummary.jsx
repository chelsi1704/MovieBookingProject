import React from "react";
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/formatDate";
import Badge, { StatusBadge } from "../common/Badge";

const BookingSummary = ({
  movie,
  showtime,
  selectedSeats = [],
  offers = [],
  onModifyClick,
  showModifyButtons = true,
  className = "",
  ...props
}) => {
  // Calculate prices
  const totalSeatPrice = selectedSeats.reduce(
    (sum, seat) => sum + (seat.price || 0),
    0,
  );
  const convenienceFee =
    totalSeatPrice > 0 ? Math.ceil(totalSeatPrice * 0.05) : 0; // 5% convenience fee
  const platformFee = 20; // Fixed platform fee

  // Calculate discount
  let discountAmount = 0;
  if (offers.length > 0) {
    const offer = offers[0];
    if (offer.type === "percentage") {
      discountAmount = Math.floor(totalSeatPrice * (offer.discount / 100));
    } else if (offer.type === "fixed") {
      discountAmount = offer.discount;
    }
  }

  const totalPrice =
    totalSeatPrice + convenienceFee + platformFee - discountAmount;

  return (
    <div
      className={`bg-gray-900/40 border border-gray-700 rounded-lg p-6 ${className}`}
      {...props}
    >
      <h2 className="text-xl font-bold text-white mb-6">Booking Summary</h2>

      {/* Movie Details */}
      {movie && (
        <div className="mb-6 pb-6 border-b border-gray-700">
          <div className="flex gap-4">
            {(movie.posterUrl || movie.poster) && (
              <img
                src={movie.posterUrl || movie.poster}
                alt={movie.title}
                className="w-16 h-20 object-cover rounded"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/300x450?text=No+Image")
                }
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">
                {movie.title}
              </h3>
              <div className="space-y-1 text-sm text-gray-400">
                {movie.genres && (
                  <p>
                    <span className="text-gray-500">Genre:</span>{" "}
                    {movie.genres.join(", ")}
                  </p>
                )}
                {movie.duration && (
                  <p>
                    <span className="text-gray-500">Duration:</span>{" "}
                    {movie.duration} mins
                  </p>
                )}
                {movie.language && (
                  <p>
                    <span className="text-gray-500">Language:</span>{" "}
                    {movie.language}
                  </p>
                )}
              </div>
              {showModifyButtons && (
                <button
                  onClick={onModifyClick?.movie}
                  className="mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Change Movie
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Showtime & Theater Details */}
      {showtime && (
        <div className="mb-6 pb-6 border-b border-gray-700">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">
            Show Details
          </h4>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex justify-between">
              <span className="text-gray-500">Theater:</span>
              <span className="font-medium">{showtime.theater?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Screen:</span>
              <span className="font-medium">{showtime.screen?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date & Time:</span>
              <span className="font-medium">
                {formatDate(showtime.startTime)} at{" "}
                {new Date(showtime.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          {showModifyButtons && (
            <button
              onClick={onModifyClick?.showtime}
              className="mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Change Showtime
            </button>
          )}
        </div>
      )}

      {/* Selected Seats */}
      {selectedSeats.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-700">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">
            Selected Seats
          </h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedSeats.map((seat, index) => (
              <Badge key={index} variant="primary" size="sm">
                {seat.rowLabel}{seat.seatNumber}
              </Badge>
            ))}
          </div>
          {showModifyButtons && (
            <button
              onClick={onModifyClick?.seats}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Change Seats
            </button>
          )}
        </div>
      )}

      {/* Offers & Discounts */}
      {offers.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-700">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">
            Applied Offers
          </h4>
          <div className="space-y-2">
            {offers.map((offer, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 bg-green-900/20 border border-green-600/30 rounded"
              >
                <span className="text-green-400 font-bold text-lg">✓</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-400">
                    {offer.code}
                  </p>
                  <p className="text-xs text-gray-400">{offer.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6 pb-6 border-b border-gray-700">
        <h4 className="text-sm font-semibold text-gray-400">Price Breakdown</h4>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-300">
            <span>Seat(s) × {selectedSeats.length}</span>
            <span className="font-medium">{formatPrice(totalSeatPrice)}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-300">
            <span>Convenience Fee</span>
            <span className="font-medium">{formatPrice(convenienceFee)}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-300">
            <span>Platform Fee</span>
            <span className="font-medium">{formatPrice(platformFee)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-400 pt-2 border-t border-gray-700">
              <span>Discount</span>
              <span className="font-medium">
                -{formatPrice(discountAmount)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Total Price */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-600/30 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-white">Total Amount</span>
          <span className="text-2xl font-bold text-blue-400">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      {/* Booking Details */}
      <div className="mt-6 text-xs text-gray-500 space-y-1">
        <p>• Inclusive of all applicable taxes</p>
        <p>• Convenience fee includes payment gateway charges</p>
        <p>• Tickets will be sent to your registered email</p>
        <p>• Cancellation is allowed up to 1 hour before showtime</p>
      </div>
    </div>
  );
};

export default BookingSummary;
