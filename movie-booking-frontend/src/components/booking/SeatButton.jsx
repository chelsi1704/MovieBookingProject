// Individual animated seat button
import { motion } from 'framer-motion';
import { useState } from 'react';

const SeatButton = ({
  seat,
  isSelected,
  onSelect,
  index = 0
}) => {
  const [shake, setShake] = useState(false);

  const handleClick = () => {
    if (seat.status === 'BOOKED') {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    if (seat.status === 'LOCKED' && !seat.isLockedByMe) {
      return;
    }
    onSelect(seat);
  };

  const getStyle = () => {
    if (isSelected) return 'seat-selected';
    if (seat.status === 'BOOKED') return 'seat-booked';
    if (seat.status === 'LOCKED') {
      return seat.isLockedByMe
        ? 'seat-selected'
        : 'seat-locked';
    }
    return 'seat-available';
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`seat ${getStyle()}`}
      title={`${seat.rowLabel}${seat.seatNumber} - ₹${seat.price}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: shake ? [-4, 4, -4, 4, 0] : 0,
      }}
      transition={{
        delay: index * 0.008,
        duration: 0.3,
        x: { duration: 0.4 }
      }}
      whileHover={
        seat.status === 'AVAILABLE'
          ? { scale: 1.15, y: -2 }
          : {}
      }
      whileTap={
        seat.status === 'AVAILABLE'
          ? { scale: 0.9 }
          : {}
      }
    >
      {seat.seatNumber}
    </motion.button>
  );
};

export default SeatButton;