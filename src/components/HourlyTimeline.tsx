import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WeatherCard from './WeatherCard';
import type { HourlyPoint } from '../types/weather';

interface HourlyTimelineProps {
  past24: HourlyPoint[];
  next24: HourlyPoint[];
  now: Date;
}

interface SectionProps {
  title: string;
  subtitle?: string;
  points: HourlyPoint[];
  now: Date;
  indexOffset?: number;
  accentColor?: string;
}

const TimelineSection: React.FC<SectionProps> = ({
  title, subtitle, points, now, indexOffset = 0, accentColor = 'text-white/70'
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-3xl border border-white/12 bg-white/6 backdrop-blur-xl p-6"
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <motion.div
            className={`w-2 h-2 rounded-full ${accentColor === 'text-blue-400' ? 'bg-blue-400' : 'bg-purple-400'}`}
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <h2 className={`text-base font-bold ${accentColor}`}>{title}</h2>
        </div>
        {subtitle && (
          <span className="text-xs text-white/35">{subtitle}</span>
        )}
      </div>

      {/* スクロール可能なタイムライン */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}
      >
        <AnimatePresence>
          {points.length > 0 ? (
            points.map((point, i) => (
              <WeatherCard
                key={`${point.datetime}-${point.time}`}
                point={point}
                now={now}
                index={indexOffset + i}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex items-center justify-center py-8 text-white/30 text-sm"
            >
              データがありません
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const HourlyTimeline: React.FC<HourlyTimelineProps> = ({ past24, next24, now }) => {
  const nowLabel = now.toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* 現在時刻バッジ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="flex items-center justify-center"
      >
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-blue-400"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-xs text-white/60 font-medium">現在: {nowLabel}</span>
        </div>
      </motion.div>

      {/* 今後24時間 */}
      <TimelineSection
        title="今後 24時間"
        subtitle={`${next24.length} 件`}
        points={next24}
        now={now}
        indexOffset={0}
        accentColor="text-blue-400"
      />

      {/* 過去24時間 */}
      <TimelineSection
        title="過去 24時間"
        subtitle={`${past24.length} 件`}
        points={past24}
        now={now}
        indexOffset={next24.length}
        accentColor="text-purple-400"
      />
    </div>
  );
};

export default HourlyTimeline;
