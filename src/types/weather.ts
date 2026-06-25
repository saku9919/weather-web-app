export interface WeatherHour {
  datetime: string;       // "HH:MM:SS"
  temp: number;           // 気温 (℃)
  feelslike: number;      // 体感温度 (℃)
  humidity: number;       // 湿度 (%)
  windspeed: number;      // 風速 (km/h)
  winddir: number;        // 風向 (degrees)
  precipprob: number;     // 降雨確率 (%)
  precip: number;         // 降水量 (mm)
  conditions: string;     // 天気状況テキスト
  icon: string;           // アイコン識別子
  cloudcover: number;     // 雲量 (%)
  uvindex: number;        // UV指数
  visibility: number;     // 視界 (km)
}

export interface WeatherDay {
  datetime: string;       // "YYYY-MM-DD"
  temp: number;
  tempmax: number;
  tempmin: number;
  feelslike: number;
  humidity: number;
  windspeed: number;
  winddir: number;
  precipprob: number;
  precip: number;
  conditions: string;
  icon: string;
  description: string;
  hours: WeatherHour[];
}

export interface WeatherLocation {
  address: string;
  latitude: number;
  longitude: number;
  timezone: string;
  tzoffset: number;
}

export interface WeatherData {
  location: WeatherLocation;
  currentConditions: {
    datetime: string;
    temp: number;
    feelslike: number;
    humidity: number;
    windspeed: number;
    winddir: number;
    precipprob: number;
    precip: number;
    conditions: string;
    icon: string;
    cloudcover: number;
    uvindex: number;
    visibility: number;
    sunrise: string;
    sunset: string;
    moonphase: number;
  };
  days: WeatherDay[];
  // 加工済みデータ
  past24Hours: HourlyPoint[];
  next24Hours: HourlyPoint[];
}

export interface HourlyPoint {
  date: Date;
  datetime: string;      // "YYYY-MM-DD"
  time: string;          // "HH:00"
  temp: number;
  feelslike: number;
  humidity: number;
  windspeed: number;
  winddir: number;
  precipprob: number;
  precip: number;
  conditions: string;
  icon: string;
  cloudcover: number;
  uvindex: number;
  isPast: boolean;
  isCurrent: boolean;
}

export type WeatherIconType =
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'cloudy'
  | 'overcast'
  | 'rain'
  | 'showers-day'
  | 'showers-night'
  | 'thunder-rain'
  | 'thunder-showers-day'
  | 'thunder-showers-night'
  | 'snow'
  | 'snow-showers-day'
  | 'snow-showers-night'
  | 'sleet'
  | 'fog'
  | 'wind'
  | 'hail';
