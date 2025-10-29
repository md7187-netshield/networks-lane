import { useEffect, useState } from "react";

interface SpeedGaugeProps {
  speed: number;
  maxSpeed: number;
  label: string;
  unit?: string;
}

export const SpeedGauge = ({ speed, maxSpeed, label, unit = "Mbps" }: SpeedGaugeProps) => {
  const [animatedSpeed, setAnimatedSpeed] = useState(0);
  
  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = speed / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= speed) {
        setAnimatedSpeed(speed);
        clearInterval(timer);
      } else {
        setAnimatedSpeed(current);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [speed]);

  const percentage = Math.min((animatedSpeed / maxSpeed) * 100, 100);
  const angle = (percentage / 100) * 270 - 135;
  
  const getSpeedColor = () => {
    if (percentage < 33) return "hsl(var(--speed-slow))";
    if (percentage < 66) return "hsl(var(--speed-medium))";
    return "hsl(var(--speed-fast))";
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-48 h-48">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            strokeDasharray="440"
            strokeDashoffset="85"
            strokeLinecap="round"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={getSpeedColor()}
            strokeWidth="12"
            strokeDasharray="440"
            strokeDashoffset={85 + (440 - 85) * (1 - percentage / 100)}
            strokeLinecap="round"
            className="transition-all duration-500"
            style={{
              filter: `drop-shadow(0 0 8px ${getSpeedColor()})`,
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold glow-text" style={{ color: getSpeedColor() }}>
            {animatedSpeed.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">{unit}</div>
        </div>
        
        {/* Needle */}
        <div
          className="absolute top-1/2 left-1/2 w-1 h-20 bg-foreground origin-bottom transition-transform duration-500"
          style={{
            transform: `translate(-50%, -100%) rotate(${angle}deg)`,
          }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary glow-effect" />
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-lg font-semibold text-foreground">{label}</div>
      </div>
    </div>
  );
};
