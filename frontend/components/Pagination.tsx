"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

type PageItem = number | "...";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: PageItem[] = [];

  pages.push(1);

  if (currentPage > 3) {
    pages.push("...");
  }

  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-10 flex justify-between gap-5 flex-wrap">
      <div className="text-sm font-medium">
        <span className="text-amber-800 font-semibold text-sm">{startItem}</span> to <span className="text-amber-800 font-semibold text-sm">{endItem}</span> of <span className="text-amber-800 font-semibold text-sm">{totalItems}</span>
      </div>

      <div className="flex items-center justify-center gap-2">
        {/* Prev */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-full border text-sm font-medium transition 
          hover:bg-[#7b1e2b] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={index} className="px-2 text-gray-500">
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200
              ${
                isActive
                  ? "bg-[#7b1e2b] text-white shadow-md scale-105"
                  : "bg-white border hover:bg-[#7b1e2b] hover:text-white hover:scale-105"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-full border text-sm font-medium transition 
          hover:bg-[#7b1e2b] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
