import { useState } from "react";
import "./FilterBar.css";

import { Search, SlidersHorizontal, Calendar } from "lucide-react";

import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";

interface FilterOption {
    value: string;
    label: string;
}

interface FilterBarProps {
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;

    classValue?: string;
    onClassChange?: (value: string) => void;
    classOptions?: FilterOption[];

    dateValue?: string;
    onDateChange?: (value: string) => void;

    filterButtonLabel?: string;
    onFilterClick?: () => void;
}

const FilterBar = ({
    searchPlaceholder = "Search...",
    searchValue = "",
    onSearchChange,

    classValue = "all",
    onClassChange,
    classOptions = [],

    dateValue = "",
    onDateChange,

    filterButtonLabel = "Filter",
    onFilterClick,

}: FilterBarProps) => {

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    // Convert YYYY-MM-DD string into Date
    const selectedDate = dateValue
        ? new Date(`${dateValue}T00:00:00`)
        : undefined;

    // Convert Date into YYYY-MM-DD string
    const formatDate = (date: Date) => {

        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    return (
        <div className="filter-bar">

            {/* Search */}
            <div className="filter-search filter-wrapper">

                <Search
                    className="filter-search-icon"
                    size={15}
                    strokeWidth={2}
                />

                <input
                    type="text"
                    className="filter-search-input"
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) =>
                        onSearchChange?.(e.target.value)
                    }
                />

            </div>


            {/* Classes */}
            {onClassChange && (
                <div className="filter-select-wrapper filter-wrapper">

                    <select
                        className="filter-select"
                        value={classValue}
                        onChange={(e) =>
                            onClassChange(e.target.value)
                        }
                    >

                        {classOptions.map((option) => (
                            <option
                                value={option.value}
                                key={option.value}
                            >
                                {option.label}
                            </option>
                        ))}

                    </select>

                </div>
            )}


            {/* Date */}
            {onDateChange && (
                <div className="filter-date-wrapper filter-wrapper">

                    <button
                        type="button"
                        className="filter-date"
                        onClick={() =>
                            setIsDatePickerOpen(
                                (previous) => !previous
                            )
                        }
                    >

                        <Calendar
                            size={16}
                            strokeWidth={2}
                        />

                        <span>
                            {selectedDate
                                ? selectedDate.toLocaleDateString(
                                    "en-GB",
                                    {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )
                                : "Select Date"
                            }
                        </span>

                    </button>


                    {/* Calendar */}
                    {isDatePickerOpen && (

                        <div className="filter-date-picker">

                            <DayPicker
                                mode="single"
                                selected={selectedDate}
                                disabled={{
                                    after: new Date(),
                                }}
                                onSelect={(date) => {

                                    if (!date) {
                                        return;
                                    }

                                    onDateChange(
                                        formatDate(date)
                                    );

                                    setIsDatePickerOpen(false);

                                }}
                            />

                        </div>

                    )}

                </div>
            )}


            {/* Optional Filter Button */}
            {onFilterClick && (
                <button
                    type="button"
                    className="filter-button"
                    onClick={onFilterClick}
                >

                    <SlidersHorizontal size={16} />

                    <span>
                        {filterButtonLabel}
                    </span>

                </button>
            )}

        </div>
    );
};

export default FilterBar;