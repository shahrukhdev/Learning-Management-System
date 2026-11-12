
import SEO from "../../../components/Seo/SEO";

import NoticeList from "../../../components/Notices/NoticesList";
import { notices } from "../../../components/Notices/Notices.data";

import "../../../components/Notices/Notices.css";
import "./Notices.css";

const StudentNotices = () => {

    // Latest notices first
    const sortedNotices = [...notices].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
    );

    return (
        <>
            <SEO
                title="Notices & Announcements | Noor Ul Imaan Masjid"
                description="View the latest notices and announcements for Noor Ul Imaan Masjid Madrassah."
            />

            <section className="student-notices-section">

                <div className="container-fluid">

                    <div className="row">

                        {/* Page Heading */}

                        <div className="col-12">

                            <div className="student-notices-head">

                                <div>
                                    <h1 className="section-title">
                                        Notices & Announcements
                                    </h1>

                                    <p className="notices-desc m-0">
                                        Stay updated with the latest madrassah
                                        announcements and important information.
                                    </p>
                                </div>

                            </div>

                        </div>


                        {/* Notice List */}

                        <div className="col-12">

                            <div className="notice-box student-notice-box">

                                {sortedNotices.length > 0 ? (

                                    sortedNotices.map((notice) => (

                                        <NoticeList
                                            key={notice.id}
                                            notice={notice}
                                            showActions={false}
                                            showDate={true}
                                            showPostedBy={true}
                                        />

                                    ))

                                ) : (

                                    <div className="student-notices-empty">
                                        <h3>No announcements yet</h3>

                                        <p>
                                            New notices and announcements
                                            will appear here.
                                        </p>
                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </section>
        </>
    );
};

export default StudentNotices;
