import { useState } from "react";
import "./HifzStudentHeader.css";
import { Calendar } from "lucide-react";

import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";

import StudentDummyImg from "../../../../assets/images/student-dummy-img.png";

const HifzStudentHeader = () => {

    const [selectedDate, setSelectedDate] = 
        useState<Date | undefined>(
        new Date()
    );

    console.log(selectedDate);
    

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    return (

        <div className="hifz-student-header">

            {/* Student Information */}
            <div className="hifz-student-info">

                <div className="hifz-student-header-avatar">
                    <img
                        src={StudentDummyImg}
                        alt="Muhammad Ali"
                    />
                </div>

                <h2 className="hifz-student-name">
                    Muhammad Ali
                </h2>

                <span className="hifz-student-count">
                    2
                </span>

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
                            onSelect={(date) => {

                                setSelectedDate(date);

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