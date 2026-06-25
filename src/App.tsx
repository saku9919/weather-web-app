import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyTimeline from './components/HourlyTimeline';
import { LoadingCurrentWeather, LoadingTimeline } from './components/LoadingSpinner';
import { useWeather } from './hooks/useWeather';
import { useGeolocation } from './hooks/useGeolocation';
import { getBackgroundColors } from './utils/weatherUtils';

// デフォルトカラー（データなし・夜間）
const DEFAULT_COLORS = {
  base: ['hsl(230,50%,5%)', 'hsl(240,55%,7%)', 'hsl(220,48%,6%)', 'hsl(230,50%,5%)'],
  orb1: ['hsla(240,70%,35%,0.2)', 'hsla(260,75%,30%,0.25)', 'hsla(230,68%,33%,0.2)', 'hsla(240,70%,35%,0.2)'],
  orb2: ['hsla(220,60%,25%,0.18)', 'hsla(250,65%,22%,0.22)', 'hsla(230,58%,23%,0.18)', 'hsla(220,60%,25%,0.18)'],
  orb3: ['hsla(270,50%,20%,0.15)', 'hsla(250,55%,18%,0.18)', 'hsla(280,46%,18%,0.15)', 'hsla(270,50%,20%,0.15)'],
};

function App() {
  const { data, loading, error, location, fetchWeather, refetch } = useWeather();
  const { getCurrentLocation } = useGeolocation();

  const now = new Date();
  const currentHour = now.getHours();

  // 天気に応じたアニメーション背景カラー
  const bgColors = data
    ? getBackgroundColors(data.currentConditions.icon, currentHour)
    : DEFAULT_COLORS;

  // 共通のゆらぎトランジション設定
  const floatTransition = (duration: number, delay = 0) => ({
    duration,
    delay,
    repeat: Infinity,
    repeatType: 'mirror' as const,
    ease: 'easeInOut' as const,
  });

  // 初回読み込み: 現在地を取得して天気を取得
  useEffect(() => {
    (async () => {
      const cityOrCoords = await getCurrentLocation();
      await fetchWeather(cityOrCoords);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCurrentLocation = useCallback(async () => {
    const cityOrCoords = await getCurrentLocation();
    await fetchWeather(cityOrCoords);
  }, [getCurrentLocation, fetchWeather]);

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* ── アニメーション背景レイヤー ── */}
      <div className="fixed inset-0 pointer-events-none">

        {/* ベース背景色（ゆっくりふわふわ変化） */}
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundColor: bgColors.base }}
          transition={floatTransition(12)}
        />

        {/* オーブ 1: 右上 → ゆっくり左へ */}
        <motion.div
          className="absolute rounded-full blur-[120px]"
          style={{ width: '60vw', height: '60vw', top: '-20vw', right: '-10vw' }}
          animate={{
            backgroundColor: bgColors.orb1,
            x: [0, -60, 30, -40, 0],
            y: [0, 40, -20, 50, 0],
            scale: [1, 1.15, 0.9, 1.1, 1],
          }}
          transition={floatTransition(18)}
        />

        {/* オーブ 2: 左下 → ゆっくり右へ */}
        <motion.div
          className="absolute rounded-full blur-[100px]"
          style={{ width: '55vw', height: '55vw', bottom: '-15vw', left: '-10vw' }}
          animate={{
            backgroundColor: bgColors.orb2,
            x: [0, 70, -30, 50, 0],
            y: [0, -50, 20, -40, 0],
            scale: [1, 0.9, 1.2, 0.95, 1],
          }}
          transition={floatTransition(22, 2)}
        />

        {/* オーブ 3: 中央 → 小さくゆらゆら */}
        <motion.div
          className="absolute rounded-full blur-[140px]"
          style={{
            width: '50vw', height: '50vw',
            top: '25%', left: '25%',
          }}
          animate={{
            backgroundColor: bgColors.orb3,
            x: [0, 40, -50, 30, 0],
            y: [0, -30, 60, -20, 0],
            scale: [1, 1.1, 0.85, 1.05, 1],
          }}
          transition={floatTransition(26, 4)}
        />

        {/* ノイズオーバーレイ（奥行き感） */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px',
          }}
        />
      </div>

      {/* ── コンテンツ ── */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* ヘッダー */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="pt-8 pb-4 px-4"
        >
          <div className="max-w-2xl mx-auto">
            {/* タイトル */}
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-3xl"
              >
                🌤️
              </motion.div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">WeatherNow</h1>
                <p className="text-xs text-white/40">過去・現在・未来の天気予報</p>
              </div>
            </div>

            {/* 検索バー */}
            <SearchBar
              onSearch={fetchWeather}
              onRefresh={refetch}
              onCurrentLocation={handleCurrentLocation}
              loading={loading}
              currentLocation={location}
            />
          </div>
        </motion.header>

        {/* メインコンテンツ */}
        <main className="flex-1 px-4 pb-12">
          <div className="max-w-2xl mx-auto space-y-5">

            {/* エラー表示 */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/15 backdrop-blur-xl px-5 py-4"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-sm text-red-200">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ローディング */}
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  <LoadingCurrentWeather />
                  <LoadingTimeline />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 天気データ表示 */}
            <AnimatePresence mode="wait">
              {!loading && data && (
                <motion.div
                  key={`weather-${location}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  {/* 現在の天気 (location を Nominatim の表示名で上書き) */}
                  <CurrentWeather data={{ ...data, location: { ...data.location, address: location || data.location.address } }} />

                  {/* タイムライン */}
                  <HourlyTimeline
                    past24={data.past24Hours}
                    next24={data.next24Hours}
                    now={now}
                  />

                  {/* 最終更新時刻 */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center text-xs text-white/25"
                  >
                    最終更新: {now.toLocaleString('ja-JP')} · Visual Crossing Weather API
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 初期状態（データなし・エラーなし・ローディングなし） */}
            <AnimatePresence>
              {!loading && !data && !error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-20"
                >
                  <motion.div
                    className="text-6xl"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🌍
                  </motion.div>
                  <p className="text-white/50 text-sm text-center">
                    場所を入力するか、現在地ボタンを押してください
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
