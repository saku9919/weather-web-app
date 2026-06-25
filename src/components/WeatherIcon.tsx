import React from 'react';
import type { WeatherIconType } from '../types/weather';

interface WeatherIconProps {
  icon: string;
  size?: number;
  className?: string;
  animated?: boolean;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ icon, size = 48, className = '', animated = false }) => {
  const iconType = icon as WeatherIconType;

  const animClass = animated ? 'transition-transform duration-300' : '';

  const svgProps = {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    xmlns: 'http://www.w3.org/2000/svg',
    className: `${animClass} ${className}`,
  };

  switch (iconType) {
    case 'clear-day':
      return (
        <svg {...svgProps}>
          <circle cx="32" cy="32" r="12" fill="#FCD34D" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 32 + 16 * Math.cos(rad);
            const y1 = 32 + 16 * Math.sin(rad);
            const x2 = 32 + 24 * Math.cos(rad);
            const y2 = 32 + 24 * Math.sin(rad);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />
            );
          })}
        </svg>
      );

    case 'clear-night':
      return (
        <svg {...svgProps}>
          <path d="M40 32a16 16 0 1 1-16-16 12 12 0 0 0 16 16z"
            fill="#93C5FD" stroke="#60A5FA" strokeWidth="1" />
          <circle cx="48" cy="16" r="2" fill="#E0E7FF" opacity="0.8" />
          <circle cx="54" cy="28" r="1.5" fill="#E0E7FF" opacity="0.6" />
          <circle cx="44" cy="10" r="1" fill="#E0E7FF" opacity="0.9" />
        </svg>
      );

    case 'partly-cloudy-day':
      return (
        <svg {...svgProps}>
          <circle cx="26" cy="24" r="10" fill="#FCD34D" />
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 26 + 13 * Math.cos(rad);
            const y1 = 24 + 13 * Math.sin(rad);
            const x2 = 26 + 18 * Math.cos(rad);
            const y2 = 24 + 18 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />;
          })}
          <ellipse cx="36" cy="38" rx="18" ry="10" fill="white" opacity="0.95" />
          <ellipse cx="28" cy="36" rx="12" ry="9" fill="white" opacity="0.9" />
          <ellipse cx="44" cy="40" rx="10" ry="7" fill="#E2E8F0" opacity="0.85" />
        </svg>
      );

    case 'partly-cloudy-night':
      return (
        <svg {...svgProps}>
          <path d="M24 22a10 10 0 1 1-10-10 8 8 0 0 0 10 10z" fill="#93C5FD" />
          <ellipse cx="36" cy="38" rx="18" ry="10" fill="white" opacity="0.95" />
          <ellipse cx="28" cy="36" rx="12" ry="9" fill="white" opacity="0.9" />
          <ellipse cx="44" cy="40" rx="10" ry="7" fill="#E2E8F0" opacity="0.85" />
        </svg>
      );

    case 'cloudy':
    case 'overcast':
      return (
        <svg {...svgProps}>
          <ellipse cx="32" cy="36" rx="22" ry="12" fill="#94A3B8" />
          <ellipse cx="22" cy="32" rx="14" ry="11" fill="#CBD5E1" />
          <ellipse cx="40" cy="34" rx="16" ry="10" fill="#94A3B8" />
          <ellipse cx="32" cy="28" rx="12" ry="10" fill="#CBD5E1" />
        </svg>
      );

    case 'rain':
    case 'showers-day':
    case 'showers-night':
      return (
        <svg {...svgProps}>
          <ellipse cx="32" cy="28" rx="20" ry="12" fill="#64748B" />
          <ellipse cx="22" cy="24" rx="12" ry="9" fill="#94A3B8" />
          <ellipse cx="40" cy="26" rx="14" ry="8" fill="#64748B" />
          {[[24, 42, 20, 52], [32, 44, 28, 54], [40, 42, 36, 52], [28, 50, 24, 60], [36, 50, 32, 60]].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          ))}
        </svg>
      );

    case 'thunder-rain':
    case 'thunder-showers-day':
    case 'thunder-showers-night':
      return (
        <svg {...svgProps}>
          <ellipse cx="32" cy="24" rx="20" ry="12" fill="#475569" />
          <ellipse cx="22" cy="20" rx="12" ry="9" fill="#64748B" />
          <path d="M34 32 L26 44 L32 44 L28 56 L40 40 L34 40 Z"
            fill="#FDE047" stroke="#F59E0B" strokeWidth="1" />
          {[[22, 36, 18, 44], [42, 36, 38, 44]].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          ))}
        </svg>
      );

    case 'snow':
    case 'snow-showers-day':
    case 'snow-showers-night':
      return (
        <svg {...svgProps}>
          <ellipse cx="32" cy="28" rx="20" ry="12" fill="#94A3B8" />
          <ellipse cx="22" cy="24" rx="12" ry="9" fill="#CBD5E1" />
          {[[24, 44], [32, 46], [40, 44], [28, 52], [36, 52]].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="3" fill="white" opacity="0.9" />
              <circle cx={cx} cy={cy} r="1.5" fill="#BFDBFE" opacity="0.8" />
            </g>
          ))}
        </svg>
      );

    case 'sleet':
      return (
        <svg {...svgProps}>
          <ellipse cx="32" cy="26" rx="20" ry="12" fill="#64748B" />
          <line x1="24" y1="40" x2="20" y2="50" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="46" r="3" fill="white" opacity="0.9" />
          <line x1="40" y1="40" x2="36" y2="50" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="28" cy="54" r="2.5" fill="white" opacity="0.8" />
          <circle cx="36" cy="52" r="2.5" fill="white" opacity="0.8" />
        </svg>
      );

    case 'fog':
      return (
        <svg {...svgProps}>
          {[20, 28, 36, 44].map((y, i) => (
            <line key={i}
              x1={i % 2 === 0 ? 12 : 16} y1={y}
              x2={i % 2 === 0 ? 52 : 48} y2={y}
              stroke="#94A3B8" strokeWidth="3" strokeLinecap="round"
              opacity={0.4 + i * 0.15}
            />
          ))}
        </svg>
      );

    case 'wind':
      return (
        <svg {...svgProps}>
          <path d="M8 20 Q20 14 32 20 Q44 26 56 20" fill="none" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          <path d="M8 32 Q22 26 36 32 Q48 38 52 32" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <path d="M8 44 Q18 38 28 44 Q38 50 44 44" fill="none" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'hail':
      return (
        <svg {...svgProps}>
          <ellipse cx="32" cy="26" rx="20" ry="12" fill="#475569" />
          {[[24, 42], [32, 44], [40, 42], [28, 52], [36, 52]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="4" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
          ))}
        </svg>
      );

    default:
      return (
        <svg {...svgProps}>
          <circle cx="32" cy="32" r="12" fill="#FCD34D" />
        </svg>
      );
  }
};

export default WeatherIcon;
