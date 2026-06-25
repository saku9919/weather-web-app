import React from 'react';
import { motion } from 'framer-motion';
import WeatherIcon from './WeatherIcon';
import { translateCondition, windDirToText } from '../utils/weatherUtils';
import type { WeatherData } from '../types/weather';

interface CurrentWeatherProps {
  data: WeatherData;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, sub, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.12)' }}
    className="flex flex-col gap-1 rounded-2xl bg-white/8 border border-white/10 p-4 cursor-default transition-colors duration-200"
  >
    <div className="text-white/50 mb-1">{icon}</div>
    <div className="text-xs text-white/50 font-medium">{label}</div>
    <div className="text-lg font-bold text-white leading-tight">{value}</div>
    {sub && <div className="text-xs text-white/40">{sub}</div>}
  </motion.div>
);

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  const { currentConditions, location } = data;

  const sunrise = currentConditions.sunrise?.split(':').slice(0, 2).join(':') ?? '--:--';
  const sunset = currentConditions.sunset?.split(':').slice(0, 2).join(':') ?? '--:--';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="rounded-3xl border border-white/15 bg-white/8 backdrop-blur-xl shadow-2xl p-8">

        {/* ロケーション */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-sm font-medium text-white/70 truncate">{location.address}</span>
          <span className="text-xs text-white/30 ml-auto shrink-0">{location.timezone}</span>
        </motion.div>

        {/* メイン気温・天気 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <motion.div
              initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <WeatherIcon icon={currentConditions.icon} size={72} animated />
            </motion.div>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-7xl font-black text-white leading-none tracking-tighter"
              >
                {currentConditions.temp}°
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/60 text-sm mt-1"
              >
                体感 {currentConditions.feelslike}°C
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="text-right"
          >
            <div className="text-xl font-bold text-white/90">
              {translateCondition(currentConditions.conditions)}
            </div>
            <div className="text-sm text-white/50 mt-1">
              湿度 {currentConditions.humidity}%
            </div>
            <div className="text-xs text-white/40 mt-0.5">
              雲量 {currentConditions.cloudcover}%
            </div>
          </motion.div>
        </div>

        {/* スタット カード */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            delay={0.35}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
              </svg>
            }
            label="風速"
            value={`${currentConditions.windspeed} km/h`}
            sub={windDirToText(currentConditions.winddir)}
          />
          <StatCard
            delay={0.4}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            }
            label="降雨確率"
            value={`${currentConditions.precipprob}%`}
            sub={`${currentConditions.precip} mm`}
          />
          <StatCard
            delay={0.45}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            }
            label="UV指数"
            value={String(currentConditions.uvindex)}
            sub={currentConditions.uvindex <= 2 ? '低い' : currentConditions.uvindex <= 5 ? '中程度' : currentConditions.uvindex <= 7 ? '高い' : '非常に高い'}
          />
          <StatCard
            delay={0.5}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
            label="日の出/没"
            value={sunrise}
            sub={`日没 ${sunset}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentWeather;
