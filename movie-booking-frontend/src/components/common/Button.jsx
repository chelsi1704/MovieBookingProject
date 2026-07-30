import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon: Icon,
}) => {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  const variants = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    danger: 'bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg transition-all',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-lg transition-all',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      className={`
        ${variants[variant]} ${sizes[size]}
        ${className}
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        font-medium rounded-lg transition-all duration-200
      `}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/30
                        border-t-white rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;