import { useState, useCallback } from 'react';
import axios from 'axios';
import type { WeatherData, WeatherDay } from '../types/weather';
import { extractHourlyPoints } from '../utils/weatherUtils';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5分間キャッシュ

// シンプルなインメモリキャッシュ
interface CacheEntry {
  data: WeatherData;
  displayName: string;
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();

function getCached(key: string): CacheEntry | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry;
}

interface UseWeatherReturn {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  location: string;
  fetchWeather: (query: string) => Promise<void>;
  refetch: () => void;
}

interface GeocodeResult {
  coords: string;       // Visual Crossing API に渡す座標文字列
  displayName: string;  // UI に表示する地名
}

/**
 * Nominatim フォワードジオコーディングで地名（日本語含む）→ 緯度経度 + 表示名に変換する。
 * 変換できない場合は元のクエリをそのまま返す。
 */
async function geocodeQuery(query: string): Promise<GeocodeResult> {
  // すでに座標形式 (lat,lon) なら変換不要
  if (/^-?\d+\.?\d*,\s*-?\d+\.?\d*$/.test(query.trim())) {
    return { coords: query.trim(), displayName: query.trim() };
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&accept-language=ja`,
      { headers: { 'User-Agent': 'WeatherNow/1.0' } }
    );

    if (!res.ok) return { coords: query, displayName: query };

    const results = await res.json();
    if (Array.isArray(results) && results.length > 0) {
      const { lat, lon, display_name } = results[0];
      // display_name の先頭部分（国名以前）を簡潔な表示名として使用
      const shortName = display_name.split(',').slice(0, 3).join(',').trim();
      return { coords: `${lat},${lon}`, displayName: shortName };
    }
  } catch {
    // ジオコーディング失敗 → 元のクエリにフォールバック
  }

  return { coords: query, displayName: query };
}

export function useWeather(): UseWeatherReturn {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [lastQuery, setLastQuery] = useState('');

  const fetchWeather = useCallback(async (query: string) => {
    if (!query.trim()) return;

    if (!API_KEY || API_KEY === 'your_api_key_here') {
      setError('APIキーが設定されていません。.envファイルにVITE_WEATHER_API_KEYを設定してください。');
      return;
    }

    setLoading(true);
    setError(null);
    setLastQuery(query);

    try {
      // 日本語・任意の地名 → Nominatim で緯度経度・表示名に正規化
      const { coords: resolvedQuery, displayName } = await geocodeQuery(query);

      // キャッシュチェック（同じ場所を5分以内に再取得しない）
      const cached = getCached(resolvedQuery);
      if (cached) {
        setData(cached.data);
        setLocation(cached.displayName);
        setLoading(false);
        return;
      }
      // 過去1日 + 今後1日分 取得するため、昨日〜明日の期間を指定
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const fmt = (d: Date) => d.toISOString().split('T')[0];
      const startDate = fmt(yesterday);
      const endDate = fmt(tomorrow);

      const url = `${BASE_URL}/${encodeURIComponent(resolvedQuery)}/${startDate}/${endDate}`;

      const response = await axios.get(url, {
        params: {
          unitGroup: 'metric',
          include: 'hours,current,conditions',
          key: API_KEY,
          contentType: 'json',
          lang: 'en', // 英語で取得してこちらで翻訳
        },
      });

      const raw = response.data;
      const tzoffset: number = raw.tzoffset ?? 0;
      const nowDate = new Date();

      const { past24, next24 } = extractHourlyPoints(
        raw.days as WeatherDay[],
        tzoffset,
        nowDate
      );

      const weatherData: WeatherData = {
        location: {
          address: raw.resolvedAddress ?? query,
          latitude: raw.latitude,
          longitude: raw.longitude,
          timezone: raw.timezone,
          tzoffset,
        },
        currentConditions: {
          datetime: raw.currentConditions?.datetime ?? '',
          temp: Math.round(raw.currentConditions?.temp ?? 0),
          feelslike: Math.round(raw.currentConditions?.feelslike ?? 0),
          humidity: Math.round(raw.currentConditions?.humidity ?? 0),
          windspeed: Math.round(raw.currentConditions?.windspeed ?? 0),
          winddir: raw.currentConditions?.winddir ?? 0,
          precipprob: Math.round(raw.currentConditions?.precipprob ?? 0),
          precip: raw.currentConditions?.precip ?? 0,
          conditions: raw.currentConditions?.conditions ?? '',
          icon: raw.currentConditions?.icon ?? 'clear-day',
          cloudcover: Math.round(raw.currentConditions?.cloudcover ?? 0),
          uvindex: raw.currentConditions?.uvindex ?? 0,
          visibility: raw.currentConditions?.visibility ?? 0,
          sunrise: raw.currentConditions?.sunrise ?? '',
          sunset: raw.currentConditions?.sunset ?? '',
          moonphase: raw.currentConditions?.moonphase ?? 0,
        },
        days: raw.days,
        past24Hours: past24,
        next24Hours: next24,
      };

      setData(weatherData);
      // Nominatim の表示名を優先し、なければ Visual Crossing の resolvedAddress を使用
      const finalDisplayName = displayName || raw.resolvedAddress || query;
      setLocation(finalDisplayName);
      // キャッシュに保存
      cache.set(resolvedQuery, { data: weatherData, displayName: finalDisplayName, timestamp: Date.now() });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          setError('場所が見つかりませんでした。別の場所名を試してください。');
        } else if (err.response?.status === 401) {
          setError('APIキーが無効です。正しいAPIキーを設定してください。');
        } else if (err.response?.status === 429) {
          setError('APIのリクエスト制限に達しました。しばらく待ってから再試行してください（無料プランは1日1000レコードまで）。');
        } else {
          setError(`天気データの取得に失敗しました: ${err.message}`);
        }
      } else {
        setError('予期しないエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    if (lastQuery) {
      fetchWeather(lastQuery);
    }
  }, [lastQuery, fetchWeather]);

  return { data, loading, error, location, fetchWeather, refetch };
}
