import { motion } from 'framer-motion';

const GlassCard = ({
  children,
  className = '',
  hover = false,
  onClick,
  animate = true
}) => {
  const base = `glass-card ${className}`;

  if (animate) {
    return (
      <motion.div
        className={base}
        onClick={onClick}
        whileHover={hover ? { scale: 1.02, y: -4 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={base} onClick={onClick}>
      {children}
    </div>
  );
};

export default GlassCard;