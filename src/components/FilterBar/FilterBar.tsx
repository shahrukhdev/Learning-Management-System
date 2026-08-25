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

    selectFilters?: {
        name: string;
        value: string;
        options: FilterOption[];
        onChange: (value: string) => void;
    }[];

    dateValue?: string;
    onDateChange?: (value: string) => void;
}

const FilterBar = ({
    searchPlaceholder = "Search...",
    searchValue = "",
    onSearchChange,

    selectFilters = [],

    dateValue = "",
    onDateChange,
}: FilterBarProps) => {
    return (
        <div className="filter-bar">

            {/* Search */}
            <div className="filter-search">
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
                    onChange={(e) => onSearchChange?.(e.target.value)}
                />
            </div>

            {/* Select Filters */}
            {selectFilters.map((filter) => (
                <div className="filter-select-wrapper" key={filter.name}>
                    <select
                        className="filter-select"
                        value={filter.value}
                        onChange={(e) => filter.onChange(e.target.value)}
                    >
                        {filter.options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            {/* Date */}
            {onDateChange && (
                <div className="filter-date-wrapper">
                    <input
                        type="date"
                        className="filter-date"
                        value={dateValue}
                        onChange={(e) => onDateChange(e.target.value)}
                    />
                </div>
            )}

        </div>
    );
};

export default FilterBar;