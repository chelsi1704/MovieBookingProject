import React, { useState, useEffect } from 'react';

const SeatMap = ({
  seats = [],
  onSeatSelect,
  selectedSeats = [],
  maxSelectable = 10,
  readOnly = false,
  showLegend = true,
  className = '',
  ...props
}) => {
  const [localSelectedSeats, setLocalSelectedSeats] = useState(selectedSeats);

  // Handle seat click
  const handleSeatClick = (seatId) => {
    if (readOnly) return;

    // Find the seat to check its status
    const seat = seats.find(s => s.id === seatId);
    if (seat?.status === 'booked') return;

    setLocalSelectedSeats(prev => {
      let updated;
      if (prev.includes(seatId)) {
        updated = prev.filter(id => id !== seatId);
      } else {
        if (prev.length < maxSelectable) {
          updated = [...prev, seatId];
        } else {
          return prev; // Don't add if max reached
        }
      }
      onSeatSelect?.(updated);
      return updated;
    });
  };

  // Group seats by row
  const seatsByRow = {};
  seats.forEach(seat => {
    const row = seat.row || 'A';
    if (!seatsByRow[row]) {
      seatsByRow[row] = [];
    }
    seatsByRow[row].push(seat);
  });

  // Sort rows
  const sortedRows = Object.keys(seatsByRow).sort();

  // Get seat status color
  const getSeatColor = (seat) => {
    if (localSelectedSeats.includes(seat.id)) {
      return 'bg-blue-600 border-blue-500';
    }
    switch (seat.status) {
      case 'booked':
        return 'bg-red-600 border-red-500 cursor-not-allowed';
      case 'reserved':
        return 'bg-yellow-600 border-yellow-500 cursor-not-allowed';
      case 'available':
        return 'bg-green-600 border-green-500 hover:bg-green-700 cursor-pointer';
      default:
        return 'bg-gray-600 border-gray-500';
    }
  };

  // Get seat price display
  const getSeatPrice = (seat) => {
    if (!seat.price) return null;
    return `₹${seat.price}`;
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      {/* Screen */}
      <div className="mb-8">
        <div className="mx-auto max-w-2xl relative">
          <div className="bg-gradient-to-b from-blue-900 to-blue-950 border-4 border-blue-400 rounded-full p-2 mb-6 text-center">
            <div className="text-white font-bold text-lg">SCREEN</div>
          </div>

          {/* Seat Grid */}
          <div className="space-y-4">
            {sortedRows.map(row => (
              <div key={row} className="flex items-center gap-4">
                {/* Row Label */}
                <div className="w-12 text-center font-bold text-gray-400 text-sm">
                  {row}
                </div>

                {/* Seats */}
                <div className="flex gap-2 justify-center flex-wrap">
                  {seatsByRow[row]
                    .sort((a, b) => {
                      const numA = parseInt(a.number || a.id);
                      const numB = parseInt(b.number || b.id);
                      return numA - numB;
                    })
                    .map(seat => (
                      <div key={seat.id} className="relative group">
                        <button
                          onClick={() => handleSeatClick(seat.id)}
                          disabled={seat.status === 'booked' || seat.status === 'reserved' || readOnly}
                          className={`
                            w-8 h-8 border-2 rounded-sm transition-all duration-200
                            flex items-center justify-center text-xs font-semibold
                            ${getSeatColor(seat)}
                            ${seat.status === 'booked' || seat.status === 'reserved' || readOnly ? 'cursor-not-allowed opacity-75' : ''}
                          `}
                          title={`${row}${seat.number || seat.id} - ${seat.status}`}
                        >
                          {localSelectedSeats.includes(seat.id) && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>

                        {/* Tooltip on Hover */}
                        {seat.price && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            {getSeatPrice(seat)}
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {/* Row Label (right side) */}
                <div className="w-12 text-center font-bold text-gray-400 text-sm">
                  {row}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm font-semibold text-gray-300 mb-3">Seat Legend</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-600 border-2 border-green-500 rounded-sm"></div>
              <span className="text-gray-400 text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 border-2 border-blue-500 rounded-sm"></div>
              <span className="text-gray-400 text-sm">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-600 border-2 border-red-500 rounded-sm"></div>
              <span className="text-gray-400 text-sm">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-600 border-2 border-yellow-500 rounded-sm"></div>
              <span className="text-gray-400 text-sm">Reserved</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Seats Summary */}
      {localSelectedSeats.length > 0 && (
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
          <div className="text-sm font-semibold text-blue-400 mb-2">
            Selected Seats ({localSelectedSeats.length}/{maxSelectable})
          </div>
          <div className="flex flex-wrap gap-2">
            {localSelectedSeats.map(seatId => {
              const seat = seats.find(s => s.id === seatId);
              return (
                <span
                  key={seatId}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full flex items-center gap-2"
                >
                  {seat?.row}{seat?.number || seatId}
                  {!readOnly && (
                    <button
                      onClick={() => handleSeatClick(seatId)}
                      className="hover:text-red-300 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Warning if max seats selected */}
      {localSelectedSeats.length >= maxSelectable && (
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg text-yellow-600 text-sm">
          Maximum {maxSelectable} seats can be selected. Please deselect a seat to select another.
        </div>
      )}
    </div>
  );
};

export default SeatMap;
