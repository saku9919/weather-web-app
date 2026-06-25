import { useState, useCallback } from 'react';

interface GeolocationState {
  loading: boolean;
  error: string | null;
  cityName: string | null;
}

const DEFAULT_CITY = 'Tokyo';

/**
 * Nominatim リバースジオコーディングAPIで緯度経度→地名を取得
 */
async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
      {
        headers: {
          // Nominatim 利用規約: User-Agent を設定すること
          'User-Agent': 'WeatherNow/1.0',
        },
      }
    );

    if (!res.ok) throw new Error('Nominatim API エラー');

    const data = await res.json();
    const addr = data.address ?? {};

    // 優先順位: city > town > village > county > state > country
    const cityName =
      addr.city ??
      addr.town ??
      addr.village ??
      addr.municipality ??
      addr.county ??
      addr.state ??
      addr.country ??
      null;

    return cityName ?? `${latitude},${longitude}`;
  } catch {
    // 失敗したら座標文字列にフォールバック
    return `${latitude},${longitude}`;
  }
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    cityName: null,
  });

  const getCurrentLocation = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(DEFAULT_CITY);
        return;
      }

      setState(s => ({ ...s, loading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // 緯度経度 → 地名に変換
          const cityName = await reverseGeocode(latitude, longitude);

          setState(s => ({ ...s, loading: false, cityName }));
          resolve(cityName);
        },
        (_err) => {
          setState(s => ({
            ...s,
            loading: false,
            error: '位置情報を取得できませんでした。デフォルト地点を使用します。',
            cityName: DEFAULT_CITY,
          }));
          resolve(DEFAULT_CITY);
        },
        { timeout: 8000, maximumAge: 300000 }
      );
    });
  }, []);

  return { ...state, getCurrentLocation, DEFAULT_CITY };
}
