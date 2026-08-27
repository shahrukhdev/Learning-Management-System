import "./FilterBar.css";

import { Search } from "lucide-react";

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

    statusValue?: string;
    onStatusChange?: (value: string) => void;
    statusOptions?: FilterOption[];
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

    statusValue = "all",
    onStatusChange,
    statusOptions = [],

}: FilterBarProps) => {

    return (
        <div className="filter-bar">

            {/* Search */}
            <div className="filter-search filter-wrapper">
                <Search className="filter-search-icon" size={15} strokeWidth={2} />

                <input type="text" className="filter-search-input" placeholder={searchPlaceholder} value={searchValue} onChange={(e) => onSearchChange?.(e.target.value)} />
            </div>

            {/* CLasses */}
            {onClassChange && (
                <div className="filter-select-wrapper filter-wrapper">
                    <select className="filter-select" value={classValue} name="" id="" onChange={(e) => onClassChange(e.target.value)}>
                        {classOptions.map((option) => (
                            <option value={option.value} key={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Date */}
            {onDateChange && (
                <div className="filter-date-wrapper filter-wrapper">
                    <input type="date" className="filter-date" value={dateValue} name="" id="" onChange={(e) => onDateChange(e.target.value)} />
                </div>
            )}

            {/* Status */}
            {onStatusChange && (
                <div className="filter-select-wrapper filter-wrapper">
                    <select className="filter-select" name="" id="" value={statusValue} onChange={(e) => onStatusChange(e.target.value)}>
                        {statusOptions.map((option) => (
                            <option value={option.value} key={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default FilterBar;