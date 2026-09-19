import { useState } from "react";
import "./HifzStudentDetails.css";
import HifzStudentHeader from "./HifzStudentHeader/HifzStudentHeader";
import HifzStudentStates from "./HifzStudentStates/HifzStudentStates";
import HifzStudentTabs, { type HifzStudentTab } from "./HifzTabs/HifzTabs";
import HifzStudentLog from "./HifzStudentLog/HifzStudentLog";


const HifzStudentDetails = () => {


    const [activeTab, setActiveTab] =
        useState<HifzStudentTab>("student-log");

    return (
        <div className="hifz-student-details hifz-box">
            
            {/* Student Header */}
            <HifzStudentHeader />

            {/* Student Stats */}
            <HifzStudentStates />

            {/* Tabs */}
            <HifzStudentTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            <div className="hifz-student-tab-content">

                {activeTab === "student-log" && (
                    <HifzStudentLog />
                )}

                {activeTab === "quran-map" && (
                    <div className="text-center">
                        <h1>Quran Map</h1>
                        <h4>Coming Soon!</h4>
                    </div>
                )}

                {activeTab === "surah-list" && (
                    <div className=" text-center">
                        <h1>Surah List</h1>
                        <h4>Coming Soon!</h4>
                    </div>
                )}

                {activeTab === "sessions" && (
                    <div className=" text-center">
                        <h1>Sessions</h1>
                        <h4>Coming Soon!</h4>
                    </div>
                )}

            </div>

        </div>
    );
};

export default HifzStudentDetails;