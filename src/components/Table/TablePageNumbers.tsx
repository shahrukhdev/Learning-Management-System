interface TablePageNumbersProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

type PageItem = number | "ellipsis-start" | "ellipsis-end";

// Compact list: all pages when there are few, otherwise
// 1 … (current-1) current (current+1) … last
const getPageItems = (page: number, totalPages: number): PageItem[] => {

    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    const items: PageItem[] = [1];

    if (start > 2) items.push("ellipsis-start");

    for (let current = start; current <= end; current++) {
        items.push(current);
    }

    if (end < totalPages - 1) items.push("ellipsis-end");

    items.push(totalPages);

    return items;
};

// Page-number buttons for the existing table pagination footer.
// Uses the same `.table-pagination button` styling as Previous/Next.
const TablePageNumbers = ({
    page,
    totalPages,
    onPageChange,
    disabled = false,
}: TablePageNumbersProps) => {

    if (totalPages <= 1) return null;

    return (
        <>
            {getPageItems(page, totalPages).map((item) =>

                typeof item === "number" ? (

                    <button
                        key={item}
                        type="button"
                        className={item === page ? "active" : ""}
                        onClick={() => onPageChange(item)}
                        disabled={disabled}
                        aria-label={`Page ${item}`}
                        aria-current={item === page ? "page" : undefined}
                    >
                        {item}
                    </button>

                ) : (

                    <span key={item} className="table-page-ellipsis" aria-hidden="true">
                        …
                    </span>

                )
            )}
        </>
    );
};

export default TablePageNumbers;
