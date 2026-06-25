import React from 'react';
import { motion, type Variants } from 'framer-motion';

const shimmer: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear' as const,
    },
  },
};

const ShimmerBlock: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    className={`rounded-xl bg-gradient-to-r from-white/5 via-white/15 to-white/5 bg-[length:200%_100%] ${className}`}
    variants={shimmer}
    animate="animate"
  />
);

export const LoadingCurrentWeather: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="w-full max-w-2xl mx-auto"
  >
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
      <div className="flex items-center gap-4 mb-6">
        <ShimmerBlock className="w-20 h-20 rounded-full" />
        <div className="flex-1 space-y-3">
          <ShimmerBlock className="h-8 w-48" />
          <ShimmerBlock className="h-4 w-32" />
        </div>
        <ShimmerBlock className="h-16 w-24" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <ShimmerBlock key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  </motion.div>
);

export const LoadingTimeline: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.1 }}
    className="w-full"
  >
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
      <ShimmerBlock className="h-5 w-40 mb-5" />
      <div className="flex gap-3 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <ShimmerBlock className="w-24 h-32 flex-shrink-0 rounded-2xl" />
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

export const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center gap-4">
    <motion.div
      className="w-12 h-12 rounded-full border-4 border-white/20 border-t-blue-400"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
    <motion.p
      className="text-white/60 text-sm"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      天気データを取得中...
    </motion.p>
  </div>
);
