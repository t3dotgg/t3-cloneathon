"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (): { timeLeft: TimeLeft; isExpired: boolean } => {
  const targetDate = new Date("2025-06-17T12:00:00-07:00").getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      timeLeft: { days, hours, minutes, seconds },
      isExpired: false,
    };
  } else {
    return {
      timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      isExpired: true,
    };
  }
};

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const updateCountdown = () => {
      const { timeLeft: newTimeLeft, isExpired: newIsExpired } =
        calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      setIsExpired(newIsExpired);
      return newIsExpired;
    };

    // Set initial values
    if (updateCountdown()) return;

    const timer = setInterval(() => {
      if (updateCountdown()) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isMounted) {
    return (
      <div className="text-center">
        <div className="flex justify-center gap-8 text-white/70 opacity-0">
          <div className="text-center bg-white/5 rounded-lg p-3 min-w-[60px]">
            <div className="text-2xl font-bold drop-shadow-sm">--</div>
            <div className="text-xs text-white/40 mt-1">days</div>
          </div>
          <div className="text-center bg-white/5 rounded-lg p-3 min-w-[60px]">
            <div className="text-2xl font-bold drop-shadow-sm">--</div>
            <div className="text-xs text-white/40 mt-1">hrs</div>
          </div>
          <div className="text-center bg-white/5 rounded-lg p-3 min-w-[60px]">
            <div className="text-2xl font-bold drop-shadow-sm">--</div>
            <div className="text-xs text-white/40 mt-1">min</div>
          </div>
          <div className="text-center bg-white/5 rounded-lg p-3 min-w-[60px]">
            <div className="text-2xl font-bold drop-shadow-sm">--</div>
            <div className="text-xs text-white/40 mt-1">sec</div>
          </div>
        </div>
        <div className="text-xs text-white/40 mt-3 opacity-0">
          Deadline: June 17, 2025 at 12:00 PM PDT
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="text-center text-white/50 text-sm">Competition ended</div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex justify-center gap-8 text-white/80 animate-in fade-in duration-500">
        <div className="text-center bg-white/5 rounded-lg p-3 min-w-[60px] shadow-lg">
          <div className="text-2xl font-bold drop-shadow-sm">
            {timeLeft.days}
          </div>
          <div className="text-xs text-white/40 mt-1 font-medium">days</div>
        </div>
        <div className="text-center bg-white/5 rounded-lg p-3 min-w-[60px] shadow-lg">
          <div className="text-2xl font-bold drop-shadow-sm">
            {timeLeft.hours}
          </div>
          <div className="text-xs text-white/40 mt-1 font-medium">hrs</div>
        </div>
        <div className="text-center bg-white/5 rounded-lg p-3 min-w-[60px] shadow-lg">
          <div className="text-2xl font-bold drop-shadow-sm">
            {timeLeft.minutes}
          </div>
          <div className="text-xs text-white/40 mt-1 font-medium">min</div>
        </div>
        <div className="text-center bg-white/5 rounded-lg p-3 min-w-[60px] shadow-lg">
          <div className="text-2xl font-bold drop-shadow-sm">
            {timeLeft.seconds}
          </div>
          <div className="text-xs text-white/40 mt-1 font-medium">sec</div>
        </div>
      </div>
      <div className="text-xs text-white/40 mt-3 animate-in fade-in duration-500">
        Deadline: June 17, 2025 at 12:00 PM PDT
      </div>
    </div>
  );
}
