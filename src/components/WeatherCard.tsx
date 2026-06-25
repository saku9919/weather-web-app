import React from 'react';
import { motion } from 'framer-motion';
import WeatherIcon from './WeatherIcon';
import { translateCondition, formatTimeLabel } from '../utils/weatherUtils';
import type { HourlyPoint } from '../types/weather';

interface WeatherCardProps {
  point: HourlyPoint;
  now: Date;
  index: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ point, now, index }) => {
  const label = formatTimeLabel(point, now);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.04,
        duration: 0.35,
        ease: 'easeOut',
      }}
      whileHover={{
        scale: 1.06,
        y: -4,
        transition: { duration: 0.2 },
      }}
      className={`
        flex-shrink-0 w-24 rounded-2xl p-3 cursor-default select-none
        border backdrop-blur-xl transition-colors duration-200
        ${point.isCurrent
          ? 'border-blue-400/60 bg-blue-500/25 shadow-lg shadow-blue-500/15'
          : point.isPast
            ? 'border-white/10 bg-white/5 opacity-70'
            : 'border-white/15 bg-white/10 hover:bg-white/15'
        }
      `}
    >
      {/* 時刻ラベル */}
      <div className={`text-xs font-semibold mb-2 truncate ${point.isCurrent ? 'text-blue-300' : 'text-white/50'}`}>
        {point.isCurrent ? '現在' : label}
      </div>

      {/* 天気アイコン */}
      <div className="flex justify-center mb-2">
        <WeatherIcon icon={point.icon} size={32} />
      </div>

      {/* 気温 */}
      <div className={`text-xl font-black text-center leading-tight mb-1 ${point.isCurrent ? 'text-white' : 'text-white/85'}`}>
        {point.temp}°
      </div>

      {/* 体感温度 */}
      <div className="text-xs text-white/40 text-center mb-2">
        体感 {point.feelslike}°
      </div>

      {/* 区切り線 */}
      <div className="h-px bg-white/10 mb-2" />

      {/* 風速 */}
      <div className="flex items-center gap-1 mb-1">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/40 shrink-0">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
        </svg>
        <span className="text-xs text-white/55 truncate">{point.windspeed}km/h</span>
      </div>

      {/* 降雨確率 */}
      <div className="flex items-center gap-1">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-400/70 shrink-0">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
        <span className={`text-xs font-medium ${point.precipprob >= 50 ? 'text-blue-300' : 'text-white/55'}`}>
          {point.precipprob}%
        </span>
      </div>

      {/* 天気説明 (ツールチップ的に小さく) */}
      <div className="mt-2 text-xs text-white/30 truncate text-center leading-tight">
        {translateCondition(point.conditions)}
      </div>
    </motion.div>
  );
};

export default WeatherCard;
