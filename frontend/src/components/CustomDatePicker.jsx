import { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import "./CustomDatePicker.css";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const CustomDatePicker = ({ value, onChange, placeholder = "Select date" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const [viewDate, setViewDate] = useState(() => {
        if (value) {
            const [y, m] = value.split("-").map(Number);
            return new Date(y, m - 1, 1);
        }
        return new Date();
    });

    useEffect(() => {
        if (value) {
            const [y, m] = value.split("-").map(Number);
            setViewDate(new Date(y, m - 1, 1));
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const viewYear = viewDate.getFullYear();
    const viewMonth = viewDate.getMonth();

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        setViewDate(new Date(viewYear, viewMonth - 1, 1));
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        setViewDate(new Date(viewYear, viewMonth + 1, 1));
    };

    const handleSelectDay = (day) => {
        const selected = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        onChange(selected);
        setIsOpen(false);
    };

    const handleToday = (e) => {
        e.stopPropagation();
        onChange(todayStr);
        setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
        setIsOpen(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange("");
        setIsOpen(false);
    };

    const formatDisplay = (val) => {
        if (!val) return "";
        try {
            const [y, m, d] = val.split("-").map(Number);
            const dateObj = new Date(y, m - 1, d);
            return dateObj.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
        } catch {
            return val;
        }
    };

    // Calculate calendar grid
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        days.push({
            day: daysInPrevMonth - i,
            isCurrentMonth: false,
            isPrev: true
        });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        const fullDate = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        days.push({
            day: i,
            isCurrentMonth: true,
            isSelected: value === fullDate,
            isToday: todayStr === fullDate
        });
    }

    // Next month padding to fill up grid (multiple of 7)
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({
            day: i,
            isCurrentMonth: false,
            isNext: true
        });
    }

    return (
        <div className="cdp-wrapper" ref={containerRef}>
            {/* Clickable anywhere trigger */}
            <div
                className={`cdp-trigger ${isOpen ? "is-open" : ""} ${value ? "has-value" : ""}`}
                onClick={() => setIsOpen((prev) => !prev)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setIsOpen((prev) => !prev);
                    }
                }}
            >
                <CalendarIcon size={15} className="cdp-trigger-icon" />
                <span className={`cdp-trigger-text ${!value ? "is-placeholder" : ""}`}>
                    {value ? formatDisplay(value) : placeholder}
                </span>
                {value ? (
                    <button
                        type="button"
                        className="cdp-clear-btn"
                        onClick={handleClear}
                        title="Clear date"
                        aria-label="Clear date"
                    >
                        <X size={13} />
                    </button>
                ) : (
                    <div className="cdp-caret" />
                )}
            </div>

            {/* Custom Modern Dropdown Calendar */}
            {isOpen && (
                <div className="cdp-dropdown" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="cdp-header">
                        <button
                            type="button"
                            className="cdp-nav-btn"
                            onClick={handlePrevMonth}
                            title="Previous Month"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="cdp-month-label">
                            {MONTH_NAMES[viewMonth]} {viewYear}
                        </span>
                        <button
                            type="button"
                            className="cdp-nav-btn"
                            onClick={handleNextMonth}
                            title="Next Month"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Days of Week */}
                    <div className="cdp-weekdays">
                        {DAYS_OF_WEEK.map((w) => (
                            <span key={w} className="cdp-weekday">
                                {w}
                            </span>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="cdp-days-grid">
                        {days.map((item, idx) => {
                            if (!item.isCurrentMonth) {
                                return (
                                    <span key={idx} className="cdp-day is-muted">
                                        {item.day}
                                    </span>
                                );
                            }
                            return (
                                <button
                                    type="button"
                                    key={idx}
                                    className={`cdp-day is-current ${item.isSelected ? "is-selected" : ""} ${item.isToday ? "is-today" : ""}`}
                                    onClick={() => handleSelectDay(item.day)}
                                >
                                    {item.day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Quick Action Footer */}
                    <div className="cdp-footer">
                        <button
                            type="button"
                            className="cdp-footer-btn cdp-btn-clear"
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            className="cdp-footer-btn cdp-btn-today"
                            onClick={handleToday}
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;
