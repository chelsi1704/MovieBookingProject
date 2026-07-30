import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  onClick,
  removable = false,
  onRemove,
  ...props 
}) => {
  // Variant styles
  const variantStyles = {
    default: 'bg-gray-200 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
    trending: 'bg-gradient-to-r from-orange-400 to-red-500 text-white',
    new: 'bg-gradient-to-r from-green-400 to-blue-500 text-white',
    premium: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
    soldOut: 'bg-gray-400 text-white',
    rated: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
  };

  // Size styles
  const sizeStyles = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const baseStyles = 'inline-flex items-center gap-1 rounded-full font-semibold transition-all duration-200';
  const variantClass = variantStyles[variant] || variantStyles.default;
  const sizeClass = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      className={`${baseStyles} ${variantClass} ${sizeClass} ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 hover:text-red-600 transition-colors duration-200 font-bold text-lg leading-none"
          aria-label="Remove badge"
        >
          ×
        </button>
      )}
    </span>
  );
};

// Predefined Badge Components for Common Use Cases
export const TrendingBadge = (props) => (
  <Badge variant="trending" size="sm" {...props}>
    🔥 Trending
  </Badge>
);

export const NewBadge = (props) => (
  <Badge variant="new" size="sm" {...props}>
    ⭐ New
  </Badge>
);

export const PremiumBadge = (props) => (
  <Badge variant="premium" size="sm" {...props}>
    👑 Premium
  </Badge>
);

export const SoldOutBadge = (props) => (
  <Badge variant="soldOut" size="sm" {...props}>
    Sold Out
  </Badge>
);

export const RatedBadge = ({ rating = 5, ...props }) => (
  <Badge variant="rated" size="sm" {...props}>
    ⭐ {rating.toFixed(1)}
  </Badge>
);

export const StatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'danger', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
    confirmed: { variant: 'success', label: 'Confirmed' },
    processing: { variant: 'info', label: 'Processing' },
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant} size="sm" {...props}>
      {config.label}
    </Badge>
  );
};

export const GenreBadge = ({ genre, ...props }) => (
  <Badge variant="info" size="sm" {...props}>
    {genre}
  </Badge>
);

export const LanguageBadge = ({ language, ...props }) => (
  <Badge variant="purple" size="sm" {...props}>
    {language}
  </Badge>
);

export const CertificationBadge = ({ certification, ...props }) => {
  const colors = {
    'U': 'bg-green-100 text-green-800',
    'UA': 'bg-blue-100 text-blue-800',
    'A': 'bg-red-100 text-red-800',
    'S': 'bg-purple-100 text-purple-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded font-bold text-xs ${colors[certification] || colors['U']}`}
      {...props}
    >
      {certification}
    </span>
  );
};

export const OfferBadge = ({ discount, type = 'percentage', ...props }) => {
  const label = type === 'percentage' ? `${discount}% OFF` : `₹${discount} OFF`;
  return (
    <Badge variant="danger" size="sm" {...props}>
      {label}
    </Badge>
  );
};

export default Badge;
