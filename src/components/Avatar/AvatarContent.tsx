import { useState } from "react";
import type { ReactNode } from "react";

interface AvatarContentProps {
    src: string | null;
    alt: string;
    // What to show when there is no image or it fails to load
    fallback: ReactNode;
    className?: string;
}

// Renders the user's image inside an existing avatar container, falling back
// to the existing default avatar content when there is no usable image.
const AvatarContent = ({ src, alt, fallback, className }: AvatarContentProps) => {

    // Remember which URL failed so a new URL gets a fresh attempt
    const [failedSrc, setFailedSrc] = useState<string | null>(null);

    if (!src || src === failedSrc) {
        return <>{fallback}</>;
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setFailedSrc(src)}
        />
    );
};

export default AvatarContent;
