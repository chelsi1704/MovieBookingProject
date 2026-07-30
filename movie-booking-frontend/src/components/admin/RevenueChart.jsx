import React, { useState, useMemo } from 'react';
import Spinner from '../common/Spinner';

const RevenueChart = ({
  data = [],
  period = 'monthly', // 'daily', 'weekly', 'monthly', 'yearly'
  onPeriodChange,
  loading = false,
  error = null,
  height = 300,
  showLegend = true,
  className = '',
  ...props
}) => {
  const [selectedBars, setSelectedBars] = useState([]);

  // Simple bar chart implementation without external library
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value), 1);
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

    return {
      maxValue,
      bars: data.map((item, index) => ({
        ...item,
        height: (item.value / maxValue) * 100,
        color: colors[index % colors.length],
      })),
    };
  }, [data]);

  const handleBarClick = (index) => {
    setSelectedBars(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div
      className={`bg-gray-900/40 border border-gray-700 rounded-lg p-6 ${className}`}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Revenue Analytics</h2>

        {/* Period Selector */}
        <div className="flex gap-2">
          {['daily', 'weekly', 'monthly', 'yearly'].map(p => (
            <button
              key={p}
              onClick={() => onPeriodChange?.(p)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12 bg-red-900/10 border border-red-600/30 rounded-lg">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && (!chartData || chartData.bars.length === 0) && (
        <div className="flex items-center justify-center py-20 bg-gray-900/30 rounded-lg border border-gray-700">
          <p className="text-gray-400">No data available</p>
        </div>
      )}

      {/* Chart */}
      {!loading && !error && chartData && (
        <>
          {/* Chart Container */}
          <div style={{ height: `${height}px` }} className="relative mb-6">
            {/* Y-axis Labels */}
            <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500 pr-3 text-right">
              {[100, 75, 50, 25, 0].map((label, i) => (
                <span key={i}>
                  ₹{Math.round((chartData.maxValue * label) / 100) / 1000}k
                </span>
              ))}
            </div>

            {/* Grid Lines */}
            <div className="absolute left-16 right-0 top-0 bottom-0 border-l border-gray-700">
              {[0, 25, 50, 75, 100].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full border-b border-gray-700/30"
                  style={{ top: `${(100 - i * 25)}%` }}
                ></div>
              ))}
            </div>

            {/* Bars */}
            <div className="absolute left-16 right-0 top-0 bottom-0 flex items-end justify-around px-4">
              {chartData.bars.map((bar, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 max-w-sm mx-1 group cursor-pointer"
                  onClick={() => handleBarClick(index)}
                >
                  {/* Tooltip */}
                  <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    ₹{bar.value.toLocaleString()}
                  </div>

                  {/* Bar */}
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      selectedBars.includes(index)
                        ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-blue-400'
                        : 'hover:opacity-80'
                    }`}
                    style={{
                      height: `${bar.height}%`,
                      backgroundColor: bar.color,
                      minHeight: '20px',
                    }}
                  ></div>

                  {/* Label */}
                  <div className="mt-2 text-xs text-gray-400 text-center max-w-full overflow-hidden text-ellipsis">
                    {bar.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-800/40 rounded p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Total Revenue</p>
              <p className="text-lg font-bold text-blue-400">
                ₹{chartData.bars
                  .reduce((sum, bar) => sum + bar.value, 0)
                  .toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-800/40 rounded p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Average</p>
              <p className="text-lg font-bold text-green-400">
                ₹
                {Math.round(
                  chartData.bars.reduce((sum, bar) => sum + bar.value, 0) /
                    chartData.bars.length
                ).toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-800/40 rounded p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Highest</p>
              <p className="text-lg font-bold text-purple-400">
                ₹{Math.max(...chartData.bars.map(b => b.value)).toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-800/40 rounded p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Lowest</p>
              <p className="text-lg font-bold text-yellow-400">
                ₹{Math.min(...chartData.bars.map(b => b.value)).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Legend */}
          {showLegend && chartData.bars.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-xs mb-3">Legend</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {chartData.bars.map((bar, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => handleBarClick(index)}
                  >
                    <div
                      className={`w-3 h-3 rounded transition-all duration-200 ${
                        selectedBars.includes(index) ? 'ring-2 ring-white' : ''
                      }`}
                      style={{ backgroundColor: bar.color }}
                    ></div>
                    <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RevenueChart;
