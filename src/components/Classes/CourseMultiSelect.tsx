import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

import type { ClassCourseSummary } from "../../types/academicClass.types";

// Reuses the existing multi-select styles from the Add User popup
// ("Assign Children" picker)
import "../Popups/Popup.css";

interface CourseMultiSelectProps {
    id: string;
    courses: ClassCourseSummary[];
    selectedIds: number[];
    onChange: (ids: number[]) => void;
    isLoading?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    // Wording (defaults are for courses; e.g. the Course form passes class wording)
    placeholder?: string;
    loadingText?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    noMatchText?: string;
    itemLabel?: string; // used for options missing from the list: "<itemLabel> #<id>"
}

// Searchable multi-select: shows option names, works with numeric IDs.
// Used for courses (Class form) and academic classes (Course form).
const CourseMultiSelect = ({
    id,
    courses,
    selectedIds,
    onChange,
    isLoading = false,
    disabled = false,
    invalid = false,
    placeholder = "Select courses",
    loadingText = "Loading courses...",
    searchPlaceholder = "Search courses...",
    emptyText = "No courses available.",
    noMatchText = "No courses found.",
    itemLabel = "Course",
}: CourseMultiSelectProps) => {

    const [isOpen, setIsOpen] = useState(false);

    const [search, setSearch] = useState("");

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const term = search.trim().toLowerCase();

    const filteredCourses = term
        ? courses.filter((course) => course.name.toLowerCase().includes(term))
        : courses;

    // Selected IDs may include courses not in the options list (e.g. inactive);
    // show those by ID so they are never silently dropped
    const selectedChips = selectedIds.map((courseId) => ({
        id: courseId,
        name: courses.find((course) => course.id === courseId)?.name ?? `${itemLabel} #${courseId}`,
    }));

    const toggleCourse = (courseId: number) => {
        onChange(
            selectedIds.includes(courseId)
                ? selectedIds.filter((idValue) => idValue !== courseId)
                : [...selectedIds, courseId]
        );
    };

    const isDisabled = disabled || isLoading;

    return (
        <div className="add-user-children" ref={wrapperRef}>

            <div
                id={id}
                role="button"
                tabIndex={isDisabled ? -1 : 0}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-invalid={invalid}
                aria-disabled={isDisabled}
                className={`add-user-children-control ${isOpen ? "open" : ""}`}
                onClick={() => {
                    if (!isDisabled) setIsOpen((current) => !current);
                }}
                onKeyDown={(event) => {
                    if (!isDisabled && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        setIsOpen((current) => !current);
                    }
                }}
            >

                {selectedChips.length > 0 ? (
                    <div className="add-user-selected-list">
                        {selectedChips.map((course) => (
                            <span className="add-user-child-chip" key={course.id}>
                                {course.name}
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        toggleCourse(course.id);
                                    }}
                                    aria-label={`Remove ${course.name}`}
                                    disabled={disabled}
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="add-user-children-placeholder">
                        {isLoading ? loadingText : placeholder}
                    </span>
                )}

                <ChevronDown
                    className={`add-user-children-arrow ${isOpen ? "rotate" : ""}`}
                    size={17}
                />

            </div>

            {isOpen && (
                <div className="add-user-children-dropdown">

                    <div className="add-user-children-search">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            onClick={(event) => event.stopPropagation()}
                        />
                    </div>

                    <div className="add-user-children-list" role="listbox" aria-multiselectable="true">
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => {
                                const isSelected = selectedIds.includes(course.id);

                                return (
                                    <button
                                        type="button"
                                        key={course.id}
                                        role="option"
                                        aria-selected={isSelected}
                                        className={`add-user-child-option ${isSelected ? "selected" : ""}`}
                                        onClick={() => toggleCourse(course.id)}
                                    >
                                        <div className="add-user-child-info">
                                            <span className="add-user-child-name">{course.name}</span>
                                        </div>
                                        <span className={`add-user-child-check ${isSelected ? "checked" : ""}`}>
                                            {isSelected && <Check size={13} strokeWidth={3} />}
                                        </span>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="add-user-no-children">
                                {courses.length === 0 ? emptyText : noMatchText}
                            </div>
                        )}
                    </div>

                    <div className="add-user-children-footer">
                        <span>{selectedIds.length} selected</span>
                        {selectedIds.length > 0 && (
                            <button type="button" onClick={() => onChange([])}>
                                Clear
                            </button>
                        )}
                    </div>

                </div>
            )}

        </div>
    );
};

export default CourseMultiSelect;
