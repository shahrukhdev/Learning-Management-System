import { Helmet } from "react-helmet-async";

import { formatPageTitle } from "../../utils/pageTitle";

interface SEOProps {
    // Page name; the " - Noor Ul Imaan Masjid" suffix is added here (an
    // existing suffix is normalized, so titles stay consistent)
    title: string;
    description: string;
}

const SEO = ({ title, description }: SEOProps) => {
    return (
        <>
            <Helmet>
                <title>{formatPageTitle(title)}</title>
                <meta name="description" content={description} />
            </Helmet>
        </>
    );
};

export default SEO;