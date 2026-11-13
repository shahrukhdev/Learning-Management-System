import { useState } from "react";
import "./HifzStudentHeader.css";
import { Calendar } from "lucide-react";

import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";

import StudentDummyImg from "../../../../assets/images/student-dummy-img.png";

interface HifzStudentHeaderProps {
    // The tracker's date (Y-m-d); null = no date selected
    date: string | null;
    onDateChange: (date: string | null) => void;
    // The student's number on the left student list (its card number)
    studentNumber: number | null;
    // The selected student's name (from the student list)
    studentName: string;
}

const toYmd = (date: Date) =>
    [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");

const HifzStudentHeader = ({ date, onDateChange, studentNumber, studentName }: HifzStudentHeaderProps) => {

    const selectedDate = date ? new Date(`${date}T00:00:00`) : undefined;

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    // Today (local): later days can't be picked
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (

        <div className="hifz-student-header">

            {/* Student Information */}
            <div className="hifz-student-info">

                <div className="hifz-student-header-avatar">
                    <img
                        src={StudentDummyImg}
                        alt={studentName}
                    />
                </div>

                <h2 className="hifz-student-name">
                    {studentName}
                </h2>

                {studentNumber !== null && (
                    <span className="hifz-student-count">
                        {studentNumber}
                    </span>
                )}

            </div>

            {/* Date Picker */}
            <div className="hifz-student-date-wrapper">
                <button 
                    type="button" 
                    className="hifz-student-date-btn" 
                    onClick={() => setIsDatePickerOpen((previous) => !previous)}
                >

                    <Calendar size={20} strokeWidth={2} color="#444841" />

                    <span>
                        {
                            selectedDate 
                                ? selectedDate.toLocaleDateString(
                                "en-GB",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                }

                            )
                            : "Select Date"
                        }
                    </span>

                </button>

                {/* Calendar */}

                {/* Calendar */}
                {isDatePickerOpen && (

                    <div className="hifz-date-picker">

                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            // Up to today only (no future dates or months)
                            disabled={{ after: today }}
                            endMonth={today}
                            defaultMonth={selectedDate ?? today}
                            onSelect={(value) => {

                                // Never accept a future day
                                if (value && value > today) return;

                                // Clicking the selected day again clears it
                                onDateChange(value ? toYmd(value) : null);

                                setIsDatePickerOpen(false);

                            }}
                        />

                    </div>

                )}

            </div>

        </div>

    );
};

export default HifzStudentHeader;