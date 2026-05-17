import { useEffect, useState } from "react";
import { animate } from "framer-motion";

interface StatCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
}

export function StatCounter({ value, duration = 2, suffix = "" }: StatCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      onUpdate(value) {
        setCount(Math.floor(value));
      },
    });
    return () => controls.stop();
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
}
