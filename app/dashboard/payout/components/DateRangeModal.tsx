"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FaChevronLeft, FaChevronRight, FaCheck } from "react-icons/fa6";

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: Date | null;
  endDate: Date | null;
  onSelectRange: (start: Date | null, end: Date | null, rangeText: string) => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function DateRangeModal({
  isOpen,
  onClose,
  startDate,
  endDate,
  onSelectRange
}: DateRangeModalProps) {
  // Calendar viewport month/year
  const [currentMonth, setCurrentMonth] = React.useState(3); // Default to April
  const [currentYear, setCurrentYear] = React.useState(2026); // Default to 2026 to match mockup database

  // Range Selection States
  const [tempStartDate, setTempStartDate] = React.useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = React.useState<Date | null>(null);
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);

  // Sync internal temp state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTempStartDate(startDate);
      setTempEndDate(endDate);
      if (startDate) {
        setCurrentMonth(startDate.getMonth());
        setCurrentYear(startDate.getFullYear());
      } else {
        // Fallback to April 2026 if no active filter
        setCurrentMonth(3);
        setCurrentYear(2026);
      }
    }
  }, [isOpen, startDate, endDate]);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleDayClick = (day: number) => {
    const clicked = new Date(currentYear, currentMonth, day);

    // If both set or none set, start new selection range
    if (tempStartDate === null || (tempStartDate !== null && tempEndDate !== null)) {
      setTempStartDate(clicked);
      setTempEndDate(null);
    } else {
      // If clicked date is before start date, treat it as the new start date
      if (clicked < tempStartDate) {
        setTempStartDate(clicked);
      } else {
        setTempEndDate(clicked);
      }
    }
  };

  const handleShortcut = (monthsAgo: number) => {
    // Current simulated date is June 12, 2026
    const end = new Date(2026, 5, 12);
    const start = new Date(2026, 5, 12);
    start.setMonth(start.getMonth() - monthsAgo);

    setTempStartDate(start);
    setTempEndDate(end);

    // Move view to focus on the start of range
    setCurrentMonth(start.getMonth());
    setCurrentYear(start.getFullYear());
  };

  const getDayStatus = (day: number) => {
    const checkDate = new Date(currentYear, currentMonth, day);

    const isStart = tempStartDate && checkDate.toDateString() === tempStartDate.toDateString();
    const isEnd = tempEndDate && checkDate.toDateString() === tempEndDate.toDateString();

    let isInRange = false;
    if (tempStartDate && tempEndDate) {
      isInRange = checkDate >= tempStartDate && checkDate <= tempEndDate;
    } else if (tempStartDate && hoverDate && hoverDate >= tempStartDate) {
      isInRange = checkDate >= tempStartDate && checkDate <= hoverDate;
    }

    return { isStart, isEnd, isInRange };
  };

  const formatDateString = (date: Date) => {
    const m = MONTH_NAMES[date.getMonth()];
    const d = String(date.getDate()).padStart(2, "0");
    const y = date.getFullYear();
    return `${m} ${d}, ${y}`;
  };

  const handleSetDate = () => {
    if (!tempStartDate) return;

    if (tempEndDate) {
      onSelectRange(
        tempStartDate,
        tempEndDate,
        `${formatDateString(tempStartDate)} - ${formatDateString(tempEndDate)}`
      );
    } else {
      onSelectRange(
        tempStartDate,
        null,
        formatDateString(tempStartDate)
      );
    }
    onClose();
  };

  const handleClearFilter = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    onSelectRange(null, null, "Select Date Range");
    onClose();
  };

  // Generate days grid
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const leadingBlanks = Array.from({ length: firstDayOfWeek });
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="font-sans text-left space-y-4 py-2">
        <h3 className="text-lg font-bold text-slate-800 font-sans">Calendar Date Picker</h3>

        {/* Shortcuts */}
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => handleShortcut(3)}
            className="bg-zinc-100 hover:bg-[#e8f5e9] hover:text-[#0da34c] text-slate-600 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            3 months ago
          </button>
          <button
            onClick={() => handleShortcut(6)}
            className="bg-zinc-100 hover:bg-[#e8f5e9] hover:text-[#0da34c] text-slate-600 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            6 months ago
          </button>
          <button
            onClick={() => handleShortcut(12)}
            className="bg-zinc-100 hover:bg-[#e8f5e9] hover:text-[#0da34c] text-slate-600 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            1 Year Ago
          </button>
        </div>

        {/* Month Navigation Row with direct selectors */}
        <div className="flex justify-between items-center bg-[#f8faf8] border border-border p-3 rounded-xl gap-2 shadow-inner">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-[#e8f5e9] hover:text-[#0da34c] rounded-xl text-[#6D6D6D] transition-colors cursor-pointer"
          >
            <FaChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex gap-2 items-center">
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(parseInt(e.target.value, 10))}
              className="bg-white border border-border hover:border-[#c8e6c9] rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all"
            >
              {MONTH_NAMES.map((name, index) => (
                <option key={name} value={index}>{name}</option>
              ))}
            </select>

            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(parseInt(e.target.value, 10))}
              className="bg-white border border-border hover:border-[#c8e6c9] rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all"
            >
              {Array.from({ length: 15 }, (_, i) => 2020 + i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-[#e8f5e9] hover:text-[#0da34c] rounded-xl text-[#6D6D6D] transition-colors cursor-pointer"
          >
            <FaChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Calendar Grid Container */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
            <div key={d} className="font-bold text-slate-500 py-1">{d}</div>
          ))}

          {/* Render blanks leading to first day of week */}
          {leadingBlanks.map((_, idx) => (
            <div key={`blank-${idx}`} className="py-2" />
          ))}

          {/* Render days of the month */}
          {daysArray.map((day) => {
            const { isStart, isEnd, isInRange } = getDayStatus(day);

            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => {
                  if (tempStartDate && !tempEndDate) {
                    setHoverDate(new Date(currentYear, currentMonth, day));
                  }
                }}
                onMouseLeave={() => setHoverDate(null)}
                className={`
                  py-2 rounded-lg font-semibold cursor-pointer transition-all duration-100 select-none
                  ${isStart || isEnd ? "bg-[#0da34c] text-white shadow-sm font-bold scale-105" : ""}
                  ${isInRange && !isStart && !isEnd ? "bg-[#e8f5e9] text-[#0da34c] hover:bg-[#c8e6c9]" : ""}
                  ${!isInRange && !isStart && !isEnd ? "hover:bg-zinc-100 text-slate-800" : ""}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-border mt-4 items-center">
          {(startDate || tempStartDate) && (
            <button
              onClick={handleClearFilter}
              className="mr-auto text-xs font-semibold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Clear Filter
            </button>
          )}
          <Button
            variant="outline"
            onClick={onClose}
            className="px-5 text-sm h-10 border-border text-[#6D6D6D] hover:bg-zinc-50 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSetDate}
            disabled={!tempStartDate}
            className="px-5 text-sm h-10 bg-[#0da34c] hover:bg-[#0da34c]/95 text-white font-semibold cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <FaCheck className="w-3.5 h-3.5" />
            <span>Set date</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
