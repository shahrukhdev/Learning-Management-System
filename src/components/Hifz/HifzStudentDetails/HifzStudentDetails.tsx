import { useState } from "react";

import "./HifzStudentDetails.css";

import HifzStudentHeader from "./HifzStudentHeader/HifzStudentHeader";
import HifzStudentStates from "./HifzStudentStates/HifzStudentStates";

import HifzStudentTabs, { type HifzStudentTab } from "./HifzTabs/HifzTabs";

import HifzStudentLog from "./HifzStudentLog/HifzStudentLog";
import HifzStudentSessions from "./HifzStudentSessions/HifzStudentSessions";
import QuranMap from "./QuranMap/QuranMap";
import SurahList from "./SurahList/SurahList";

import { DEFAULT_STATUS, SURAH_DATA, type SurahStatus } from "./QuranMap/QuranMap.data";

const HifzStudentDetails = () => {
    const [activeTab, setActiveTab] = useState<HifzStudentTab>("student-log");

    const [statuses, setStatuses] = useState<Record<number, SurahStatus>>(DEFAULT_STATUS);

    return (
        <div className="hifz-student-details hifz-box">
            <HifzStudentHeader />

            <HifzStudentStates />

            <HifzStudentTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <div className="hifz-student-tab-content">
                {activeTab === "student-log" && (
                    <HifzStudentLog />
                )}

                {activeTab === "quran-map" && (
                    <QuranMap
                        statuses={statuses}
                        setStatuses={setStatuses}
                    />
                )}

                {activeTab === "surah-list" && (
                    <SurahList
                        surahs={SURAH_DATA}
                        statuses={statuses}
                    />
                )}

                {activeTab === "sessions" && (
                    <HifzStudentSessions />
                )}
            </div>
        </div>
    );
};

export default HifzStudentDetails;