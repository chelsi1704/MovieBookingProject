import React from 'react';

const StatCard = ({
  title,
  value,
  unit = '',
  change = null,
  changeType = 'positive', // 'positive', 'negative', 'neutral'
  icon = null,
  trend = null, // 'up', 'down', 'flat'
  color = 'blue', // 'blue', 'green', 'red', 'purple', 'yellow', 'pink'
  onClick,
  loading = false,
  className = '',
  ...props
}) => {
  const colorConfig = {
    blue: {
      bg: 'bg-blue-900/20',
      border: 'border-blue-600/30',
      text: 'text-blue-400',
      icon: 'bg-blue-900/40',
    },
    green: {
      bg: 'bg-green-900/20',
      border: 'border-green-600/30',
      text: 'text-green-400',
      icon: 'bg-green-900/40',
    },
    red: {
      bg: 'bg-red-900/20',
      border: 'border-red-600/30',
      text: 'text-red-400',
      icon: 'bg-red-900/40',
    },
    purple: {
      bg: 'bg-purple-900/20',
      border: 'border-purple-600/30',
      text: 'text-purple-400',
      icon: 'bg-purple-900/40',
    },
    yellow: {
      bg: 'bg-yellow-900/20',
      border: 'border-yellow-600/30',
      text: 'text-yellow-400',
      icon: 'bg-yellow-900/40',
    },
    pink: {
      bg: 'bg-pink-900/20',
      border: 'border-pink-600/30',
      text: 'text-pink-400',
      icon: 'bg-pink-900/40',
    },
  };

  const config = colorConfig[color] || colorConfig.blue;

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return (
          <svg
            className="w-4 h-4 text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 11a1 1 0 011-1h2.414l5.293-5.293a1 1 0 111.414 1.414L7.414 10l5.293 5.293a1 1 0 11-1.414 1.414L5.414 11H3a1 1 0 01-1-1z" />
          </svg>
        );
      case 'down':
        return (
          <svg
            className="w-4 h-4 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M18 9a1 1 0 00-1 1v2.414l-5.293-5.293a1 1 0 10-1.414 1.414L14.586 13H12a1 1 0 100 2h6a1 1 0 001-1v-6a1 1 0 00-1-1z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        ${config.bg} border ${config.border} rounded-lg p-6
        transition-all duration-300 hover:shadow-lg
        ${onClick ? 'cursor-pointer hover:border-opacity-50' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {/* Header with Icon and Title */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        </div>

        {/* Icon */}
        {icon && (
          <div className={`${config.icon} p-3 rounded-lg ml-4`}>
            {typeof icon === 'string' ? (
              <span className={`text-xl ${config.text}`}>{icon}</span>
            ) : (
              <div className={config.text}>{icon}</div>
            )}
          </div>
        )}
      </div>

      {/* Value Section */}
      {loading ? (
        <div className="h-8 bg-gray-700/30 rounded animate-pulse mb-3"></div>
      ) : (
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{value}</span>
            {unit && <span className="text-gray-400 text-sm">{unit}</span>}
          </div>
        </div>
      )}

      {/* Change Indicator */}
      {change !== null && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-700/30">
          {getTrendIcon()}
          <span className={`text-sm font-semibold ${getChangeColor()}`}>
            {changeType === 'positive' ? '+' : changeType === 'negative' ? '-' : ''}
            {Math.abs(change)}%
          </span>
          <span className="text-gray-400 text-xs">vs last month</span>
        </div>
      )}
    </div>
  );
};

// Predefined Stat Cards for Common Metrics
export const RevenueStatCard = (props) => (
  <StatCard
    title="Total Revenue"
    icon="💰"
    color="green"
    {...props}
  />
);

export const BookingsStatCard = (props) => (
  <StatCard
    title="Total Bookings"
    icon="🎟️"
    color="blue"
    {...props}
  />
);

export const UsersStatCard = (props) => (
  <StatCard
    title="Active Users"
    icon="👥"
    color="purple"
    {...props}
  />
);

export const MoviesStatCard = (props) => (
  <StatCard
    title="Movies Available"
    icon="🎬"
    color="pink"
    {...props}
  />
);

export const OccupancyStatCard = (props) => (
  <StatCard
    title="Occupancy Rate"
    icon="📊"
    color="yellow"
    unit="%"
    {...props}
  />
);

export const ComplaintsStatCard = (props) => (
  <StatCard
    title="Support Tickets"
    icon="⚠️"
    color="red"
    {...props}
  />
);

export default StatCard;
