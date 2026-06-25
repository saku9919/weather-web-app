import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onRefresh: () => void;
  onCurrentLocation: () => void;
  loading: boolean;
  currentLocation: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onRefresh,
  onCurrentLocation,
  loading,
  currentLocation,
}) => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="flex gap-3">
        {/* 入力フィールド */}
        <motion.div
          className="flex-1 relative"
          animate={{
            scale: focused ? 1.01 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {/* グロー効果 */}
          <AnimatePresence>
            {focused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl pointer-events-none"
              />
            )}
          </AnimatePresence>

          <div className={`relative flex items-center rounded-2xl border transition-all duration-300 overflow-hidden
            ${focused
              ? 'border-blue-400/60 bg-white/15 shadow-lg shadow-blue-500/10'
              : 'border-white/20 bg-white/8 hover:border-white/30 hover:bg-white/12'
            } backdrop-blur-xl`}
          >
            {/* 検索アイコン */}
            <div className="pl-4 pr-2 text-white/40">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="都市名・住所・緯度経度を入力..."
              className="flex-1 py-4 pr-4 bg-transparent text-white placeholder-white/35 text-sm font-medium outline-none"
            />

            {/* クリアボタン */}
            <AnimatePresence>
              {value && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => { setValue(''); inputRef.current?.focus(); }}
                  className="pr-3 text-white/40 hover:text-white/70 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 検索ボタン */}
        <motion.button
          type="submit"
          disabled={loading || !value.trim()}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="px-5 py-4 rounded-2xl bg-blue-500/80 hover:bg-blue-500 disabled:opacity-40
            disabled:cursor-not-allowed text-white font-semibold text-sm backdrop-blur-xl
            border border-blue-400/30 shadow-lg shadow-blue-500/20 transition-all duration-200"
        >
          検索
        </motion.button>

        {/* 現在地ボタン */}
        <motion.button
          type="button"
          onClick={onCurrentLocation}
          disabled={loading}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          title="現在地を使用"
          className="px-4 py-4 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-40
            disabled:cursor-not-allowed text-white backdrop-blur-xl
            border border-white/20 hover:border-white/30 transition-all duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z" opacity="0.3" />
          </svg>
        </motion.button>

        {/* リフレッシュボタン */}
        <motion.button
          type="button"
          onClick={onRefresh}
          disabled={loading || !currentLocation}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          title="更新"
          className="px-4 py-4 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-40
            disabled:cursor-not-allowed text-white backdrop-blur-xl
            border border-white/20 hover:border-white/30 transition-all duration-200"
        >
          <motion.div
            animate={loading ? { rotate: 360 } : { rotate: 0 }}
            transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-6.36 2.64L3 9" />
              <path d="M3 3v6h6" />
              <path d="M3 12a9 9 0 0 0 9 9 9 9 0 0 0 6.36-2.64L21 15" />
              <path d="M15 15h6v6" />
            </svg>
          </motion.div>
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SearchBar;
