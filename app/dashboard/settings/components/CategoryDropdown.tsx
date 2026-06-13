"use client";

import * as React from "react";

interface CategoryDropdownProps {
  activeType: "User" | "Coach";
  onSelectType: (type: "User" | "Coach") => void;
}

export default function CategoryDropdown({ activeType, onSelectType }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary/10 border border-primary/20 text-primary font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 focus:outline-none transition-all cursor-pointer h-9 hover:bg-primary/15"
      >
        <span>{activeType} Package Settings</span>
        <svg
          className={`w-3.5 h-3.5 text-primary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 z-30 w-44 bg-white border border-border rounded-xl shadow-lg p-1.5 flex flex-col animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={() => {
              onSelectType("User");
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 text-xs font-semibold rounded-lg transition-colors text-left cursor-pointer ${
              activeType === "User"
                ? "bg-primary text-white"
                : "text-slate-700 hover:bg-card hover:text-primary"
            }`}
          >
            User Packages
          </button>
          <button
            onClick={() => {
              onSelectType("Coach");
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 text-xs font-semibold rounded-lg transition-colors text-left cursor-pointer ${
              activeType === "Coach"
                ? "bg-primary text-white"
                : "text-slate-700 hover:bg-card hover:text-primary"
            }`}
          >
            Coach Packages
          </button>
        </div>
      )}
    </div>
  );
}
