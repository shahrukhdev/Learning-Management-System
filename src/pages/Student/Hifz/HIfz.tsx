
import { useState } from "react";

import SEO from "../../../components/Seo/SEO";

import StudentHifzHeader from "../../../components/StudentComponents/StudentHifz/StudentHifzHeader/StudentHifzHeader";
import StudentHifzStates from "../../../components/StudentComponents/StudentHifz/StudentHifzStates/StudentHifzStates";
import StudentHifzTabs, { type StudentHifzTab } from "../../../components/StudentComponents/StudentHifz/StudentHifzTabs/StudentHifzTabs";

import StudentQuranMap from "../../../components/StudentComponents/StudentHifz/StudentQuranMap/StudentQuranMap";
import SurahList from "../../../components/Hifz/HifzStudentDetails/SurahList/SurahList";
import HifzStudentSessions from "../../../components/Hifz/HifzStudentDetails/HifzStudentSessions/HifzStudentSessions";

import { DEFAULT_STATUS, SURAH_DATA, type SurahStatus } from "../../../components/Hifz/HifzStudentDetails/QuranMap/QuranMap.data";

import "./Hifz.css";

const StudentHifz = () => {

    const [activeTab, setActiveTab] = useState<StudentHifzTab>("quran-map");

    const [statuses] = useState<Record<number, SurahStatus>>(DEFAULT_STATUS);

    return (
        <>
            <SEO
                title="My Hifz | Noor Ul Imaan Masjid"
                description="View your Quran memorisation progress and Hifz sessions."
            />

            <section className="student-hifz-section">
                <div className="container-fluid">

                    {/* Page Heading */}
                    <div className="student-hifz-page-heading">
                        <h1 className="section-title m-0">
                            My Hifz
                        </h1>

                        <p className="section-desc-para">
                            Track your Quran memorisation journey and progress.
                        </p>
                    </div>

                    {/* Student Profile */}
                    <StudentHifzHeader />

                    {/* Hifz Summary */}
                    <StudentHifzStates />

                    {/* Tabs */}
                    <StudentHifzTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {/* Tab Content */}
                    <div className="student-hifz-tab-content">

                        {activeTab === "quran-map" && (
                            <StudentQuranMap
                                statuses={statuses}
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
            </section>
        </>
    );
};

export default StudentHifz;
