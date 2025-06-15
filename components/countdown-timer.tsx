"use client";

import { useEffect, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const timezones = [
  { value: "America/Los_Angeles", label: "PST/PDT (UTC-8/-7)" },
  { value: "America/Denver", label: "MST/MDT (UTC-7/-6)" },
  { value: "America/Chicago", label: "CST/CDT (UTC-6/-5)" },
  { value: "America/New_York", label: "EST/EDT (UTC-5/-4)" },
  { value: "Europe/London", label: "GMT/BST (UTC+0/+1)" },
  { value: "Europe/Berlin", label: "CET/CEST (UTC+1/+2)" },
  { value: "Asia/Dubai", label: "GST (UTC+4)" },
  { value: "Asia/Karachi", label: "PKT (UTC+5)" },
  { value: "Asia/Kolkata", label: "IST (UTC+5:30)" },
  { value: "Asia/Shanghai", label: "CST (UTC+8)" },
  { value: "Asia/Tokyo", label: "JST (UTC+9)" },
  { value: "Australia/Sydney", label: "AEDT/AEST (UTC+11/+10)" },
];

export function CountdownTimer() {
  // Detect user's timezone and set as default
  const getUserTimezone = () => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "America/Los_Angeles"; // fallback
    }
  };

  const [selectedTimezone, setSelectedTimezone] = useState(getUserTimezone());
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  // The actual deadline: June 17, 2025 at 12:00:00 PM PDT
  const getTargetDateUTC = () => {
    // Create the deadline in PDT (Pacific Daylight Time)
    const deadlineInPDT = new Date("2025-06-17T24:00:00-07:00"); // PDT is UTC-7
    return deadlineInPDT;
  };

  useEffect(() => {
    const targetUTC = getTargetDateUTC();

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetUTC.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
        return true;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      setIsExpired(false);
      return false;
    };

    updateCountdown();
    const timer = setInterval(() => {
      if (updateCountdown()) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedTimezone]);

  // Format the deadline in the user's selected timezone
  const formattedDeadline = formatInTimeZone(
    getTargetDateUTC(),
    selectedTimezone,
    "MMMM d, yyyy 'at' hh:mm a zzz"
  );

  // Get current time in selected timezone for display
  const currentTimeInTz = formatInTimeZone(
    new Date(),
    selectedTimezone,
    "MMM d, hh:mm:ss a zzz"
  );

  return (
    <div className="space-y-4 text-center">
      {/* <div className="text-xs text-white/30 mb-2">
        Current time: {currentTimeInTz}
      </div> */}

      {isExpired ? (
        <div className="text-white/60 text-sm">Competition ended</div>
      ) : (
        <>
          <div className="flex justify-center gap-4 text-white/90">
            {(["days", "hours", "minutes", "seconds"] as const).map((unit, idx) => (
              <div
                key={unit}
                className="bg-white/5 rounded-lg px-3 py-2 min-w-[60px] shadow text-center"
              >
                <div className="text-2xl font-bold">{timeLeft[unit]}</div>
                <div className="text-xs text-white/50 mt-1">{unit}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-white/40 mt-2">
            Deadline: {formattedDeadline}
          </div>
        </>
      )}

      <div className="w-[200px] mx-auto mt-6">
        <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white/90 h-6 text-xs opacity-55">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value} className="text-xs">
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}