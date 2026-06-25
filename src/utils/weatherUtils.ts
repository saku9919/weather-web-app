import type { WeatherDay, HourlyPoint } from '../types/weather';

/**
 * 天気状況テキストを日本語に変換
 */
export function translateCondition(condition: string): string {
  const map: Record<string, string> = {
    'Clear': '快晴',
    'Partially cloudy': '一部曇り',
    'Overcast': '曇り',
    'Rain': '雨',
    'Rain, Partially cloudy': '雨・一部曇り',
    'Rain, Overcast': '雨・曇り',
    'Heavy rain': '大雨',
    'Drizzle': '小雨',
    'Snow': '雪',
    'Snow, Partially cloudy': '雪・一部曇り',
    'Freezing Drizzle/Freezing Rain': '凍雨',
    'Thunderstorm': '雷雨',
    'Thunder': '雷',
    'Fog': '霧',
    'Hail': '雹',
    'Blowing Or Drifting Snow': '吹雪',
    'Mist': '霧雨',
    'Haze': 'もや',
  };
  return map[condition] ?? condition;
}

/**
 * 風向を文字列（方角）に変換
 */
export function windDirToText(degrees: number): string {
  const dirs = ['北', '北北東', '北東', '東北東', '東', '東南東', '南東', '南南東',
    '南', '南南西', '南西', '西南西', '西', '西北西', '北西', '北北西'];
  const idx = Math.round(degrees / 22.5) % 16;
  return dirs[idx];
}

/**
 * 時刻文字列 "HH:MM:SS" → "HH:00" フォーマット
 */
export function formatHour(timeStr: string): string {
  const hour = timeStr.split(':')[0];
  return `${hour}:00`;
}

/**
 * 日付文字列 "YYYY-MM-DD" と 時刻 "HH:MM:SS" から Date オブジェクトを生成
 */
export function toDate(dateStr: string, timeStr: string, tzoffset: number): Date {
  const isoStr = `${dateStr}T${timeStr}`;
  const utcMs = new Date(isoStr).getTime() - tzoffset * 3600 * 1000;
  return new Date(utcMs);
}

/**
 * WeatherDay[] と現在時刻から 過去24時間・今後24時間 の HourlyPoint[] を生成
 */
export function extractHourlyPoints(
  days: WeatherDay[],
  tzoffset: number,
  now: Date
): { past24: HourlyPoint[]; next24: HourlyPoint[] } {
  const past24StartMs = now.getTime() - 24 * 3600 * 1000;
  const next24EndMs = now.getTime() + 24 * 3600 * 1000;

  const allPoints: HourlyPoint[] = [];

  for (const day of days) {
    for (const hour of day.hours) {
      const date = toDate(day.datetime, hour.datetime, tzoffset);
      const ms = date.getTime();

      if (ms >= past24StartMs - 3600 * 1000 && ms <= next24EndMs + 3600 * 1000) {
        const isPast = ms < now.getTime();
        const isCurrent = Math.abs(ms - now.getTime()) < 1800 * 1000; // ±30分

        allPoints.push({
          date,
          datetime: day.datetime,
          time: formatHour(hour.datetime),
          temp: Math.round(hour.temp),
          feelslike: Math.round(hour.feelslike),
          humidity: Math.round(hour.humidity),
          windspeed: Math.round(hour.windspeed),
          winddir: hour.winddir,
          precipprob: Math.round(hour.precipprob),
          precip: hour.precip,
          conditions: hour.conditions,
          icon: hour.icon,
          cloudcover: Math.round(hour.cloudcover),
          uvindex: hour.uvindex,
          isPast,
          isCurrent,
        });
      }
    }
  }

  allPoints.sort((a, b) => a.date.getTime() - b.date.getTime());

  const nowMs = now.getTime();
  const past24 = allPoints.filter(p => p.date.getTime() < nowMs)
    .slice(-24);
  const next24 = allPoints.filter(p => p.date.getTime() >= nowMs)
    .slice(0, 24);

  return { past24, next24 };
}

/**
 * 天気・時刻から背景アニメーション用の HSL カラーセットを返す
 * 各カラーセットは [baseColor, midColor, accentColor1, accentColor2] の形式
 */
export interface BgColors {
  base: string[];    // ベース背景色のキーフレーム
  orb1: string[];    // オーブ1の色キーフレーム
  orb2: string[];    // オーブ2の色キーフレーム
  orb3: string[];    // オーブ3の色キーフレーム
}

export function getBackgroundColors(icon: string, hour: number): BgColors {
  const isNight = hour < 6 || hour >= 20;

  if (icon.includes('thunder')) {
    return {
      base: ['hsl(270,50%,4%)', 'hsl(285,55%,6%)', 'hsl(260,48%,5%)', 'hsl(270,50%,4%)'],
      orb1: ['hsla(280,70%,30%,0.25)', 'hsla(260,75%,25%,0.3)', 'hsla(290,65%,28%,0.2)', 'hsla(280,70%,30%,0.25)'],
      orb2: ['hsla(240,60%,20%,0.2)', 'hsla(270,65%,22%,0.25)', 'hsla(250,58%,18%,0.2)', 'hsla(240,60%,20%,0.2)'],
      orb3: ['hsla(300,50%,15%,0.15)', 'hsla(280,55%,18%,0.2)', 'hsla(310,45%,14%,0.15)', 'hsla(300,50%,15%,0.15)'],
    };
  }
  if (icon.includes('snow')) {
    return {
      base: ['hsl(210,40%,8%)', 'hsl(220,45%,10%)', 'hsl(200,38%,9%)', 'hsl(210,40%,8%)'],
      orb1: ['hsla(210,60%,60%,0.15)', 'hsla(200,65%,65%,0.2)', 'hsla(220,58%,58%,0.15)', 'hsla(210,60%,60%,0.15)'],
      orb2: ['hsla(190,50%,50%,0.12)', 'hsla(210,55%,55%,0.16)', 'hsla(200,48%,48%,0.12)', 'hsla(190,50%,50%,0.12)'],
      orb3: ['hsla(230,40%,40%,0.1)', 'hsla(220,45%,45%,0.14)', 'hsla(240,38%,38%,0.1)', 'hsla(230,40%,40%,0.1)'],
    };
  }
  if (icon.includes('rain') || icon.includes('shower')) {
    return {
      base: ['hsl(225,45%,6%)', 'hsl(235,50%,8%)', 'hsl(215,43%,7%)', 'hsl(225,45%,6%)'],
      orb1: ['hsla(230,60%,40%,0.2)', 'hsla(220,65%,35%,0.25)', 'hsla(240,58%,38%,0.2)', 'hsla(230,60%,40%,0.2)'],
      orb2: ['hsla(210,55%,30%,0.18)', 'hsla(225,60%,28%,0.22)', 'hsla(215,52%,28%,0.18)', 'hsla(210,55%,30%,0.18)'],
      orb3: ['hsla(250,45%,25%,0.15)', 'hsla(235,50%,22%,0.18)', 'hsla(260,42%,24%,0.15)', 'hsla(250,45%,25%,0.15)'],
    };
  }
  if (icon.includes('fog')) {
    return {
      base: ['hsl(220,20%,10%)', 'hsl(215,22%,12%)', 'hsl(225,18%,11%)', 'hsl(220,20%,10%)'],
      orb1: ['hsla(220,20%,40%,0.15)', 'hsla(210,22%,45%,0.18)', 'hsla(230,18%,38%,0.15)', 'hsla(220,20%,40%,0.15)'],
      orb2: ['hsla(200,18%,35%,0.12)', 'hsla(215,20%,38%,0.15)', 'hsla(210,16%,33%,0.12)', 'hsla(200,18%,35%,0.12)'],
      orb3: ['hsla(230,15%,30%,0.1)', 'hsla(220,18%,32%,0.12)', 'hsla(240,14%,28%,0.1)', 'hsla(230,15%,30%,0.1)'],
    };
  }
  if (icon === 'cloudy' || icon.includes('overcast')) {
    return {
      base: ['hsl(220,30%,8%)', 'hsl(210,32%,10%)', 'hsl(230,28%,9%)', 'hsl(220,30%,8%)'],
      orb1: ['hsla(220,35%,35%,0.18)', 'hsla(210,38%,40%,0.22)', 'hsla(230,32%,33%,0.18)', 'hsla(220,35%,35%,0.18)'],
      orb2: ['hsla(200,30%,28%,0.15)', 'hsla(215,33%,30%,0.18)', 'hsla(210,28%,26%,0.15)', 'hsla(200,30%,28%,0.15)'],
      orb3: ['hsla(240,25%,22%,0.12)', 'hsla(225,28%,24%,0.15)', 'hsla(250,22%,20%,0.12)', 'hsla(240,25%,22%,0.12)'],
    };
  }
  if (isNight || icon.includes('night')) {
    return {
      base: ['hsl(230,50%,5%)', 'hsl(240,55%,7%)', 'hsl(220,48%,6%)', 'hsl(230,50%,5%)'],
      orb1: ['hsla(240,70%,35%,0.2)', 'hsla(260,75%,30%,0.25)', 'hsla(230,68%,33%,0.2)', 'hsla(240,70%,35%,0.2)'],
      orb2: ['hsla(220,60%,25%,0.18)', 'hsla(250,65%,22%,0.22)', 'hsla(230,58%,23%,0.18)', 'hsla(220,60%,25%,0.18)'],
      orb3: ['hsla(270,50%,20%,0.15)', 'hsla(250,55%,18%,0.18)', 'hsla(280,46%,18%,0.15)', 'hsla(270,50%,20%,0.15)'],
    };
  }
  // 晴れ・日中
  return {
    base: ['hsl(205,70%,8%)', 'hsl(215,72%,10%)', 'hsl(195,68%,9%)', 'hsl(205,70%,8%)'],
    orb1: ['hsla(200,80%,50%,0.2)', 'hsla(220,85%,45%,0.25)', 'hsla(190,78%,48%,0.2)', 'hsla(200,80%,50%,0.2)'],
    orb2: ['hsla(260,70%,40%,0.18)', 'hsla(240,75%,38%,0.22)', 'hsla(270,68%,38%,0.18)', 'hsla(260,70%,40%,0.18)'],
    orb3: ['hsla(180,60%,35%,0.15)', 'hsla(200,65%,32%,0.18)', 'hsla(170,58%,33%,0.15)', 'hsla(180,60%,35%,0.15)'],
  };
}

/**
 * 時刻ラベル（今日 / 昨日 付き）
 */
export function formatTimeLabel(point: HourlyPoint, now: Date): string {
  const today = now.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
  const pointDay = point.date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });

  if (pointDay === today) {
    return point.time;
  }
  return `${pointDay} ${point.time}`;
}
