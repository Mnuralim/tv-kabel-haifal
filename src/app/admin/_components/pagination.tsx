"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemsPerPageOptions = [5, 10, 25, 50, 100],
  className = "",
  preserveParams = {},
  labels = {},
}: PaginationProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const defaultLabels = {
    itemsLabel: "items",
    showingText: "Tampilkan",
    displayingText: "Menampilkan",
    ofText: "dari",
    prevText: "Prev",
    nextText: "Next",
    ...labels,
  };

  const createURL = (page: number, newItemsPerPage?: number) => {
    const params = new URLSearchParams(currentSearchParams.toString());

    const itemsPP = newItemsPerPage || itemsPerPage;
    const skip = (page - 1) * itemsPP;

    params.set("skip", skip.toString());
    params.set("limit", itemsPP.toString());

    Object.entries(preserveParams).forEach(([key, value]) => {
      if (key === "skip" || key === "limit") return;
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    return `?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    router.push(createURL(page), {
      scroll: false,
    });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    router.push(createURL(1, newItemsPerPage), {
      scroll: false,
    });
    setIsDropdownOpen(false);
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return [...new Set(rangeWithDots)].filter((item) => {
      if (totalPages === 1) return item === 1;
      if (item === 1) return true;
      if (item === totalPages) return totalPages > 1;
      return item !== 1 && item !== totalPages;
    });
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex items-center gap-3 text-sm font-bold text-gray-800">
        <span>{defaultLabels.showingText}</span>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white border-3 border-black px-4 py-2 font-black text-gray-800 hover:bg-red-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-x-1 hover:-translate-y-1"
          >
            {itemsPerPage}
            <ChevronRight
              className={`ml-2 h-4 w-4 inline transition-transform ${
                isDropdownOpen ? "rotate-90" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 min-w-full">
              {itemsPerPageOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleItemsPerPageChange(option)}
                  className={`block w-full px-4 py-2 text-left font-bold hover:bg-red-50 transition-colors ${
                    option === itemsPerPage ? "bg-red-100" : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        <span>
          {defaultLabels.ofText} {totalItems} {defaultLabels.itemsLabel}
        </span>
      </div>

      <div className="text-sm font-bold text-gray-800">
        {defaultLabels.displayingText} {startItem}-{endItem}{" "}
        {defaultLabels.ofText} {totalItems} {defaultLabels.itemsLabel}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center px-4 py-2 font-black border-3 border-black transition-all transform ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-800 hover:bg-red-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
          }`}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {defaultLabels.prevText}
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(1)}
            className={`px-4 py-2 font-black border-3 border-black transition-all transform ${
              currentPage === 1
                ? "bg-red-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white text-gray-800 hover:bg-red-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
            }`}
          >
            1
          </button>

          {currentPage > 4 && totalPages > 5 && (
            <div className="px-2 py-2 font-black text-gray-800">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          )}

          {getPageNumbers()
            .filter(
              (page) => page !== 1 && page !== totalPages && page !== "..."
            )
            .map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page as number)}
                className={`px-4 py-2 font-black border-3 border-black transition-all transform ${
                  currentPage === page
                    ? "bg-red-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-gray-800 hover:bg-red-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
                }`}
              >
                {page}
              </button>
            ))}

          {currentPage < totalPages - 3 && totalPages > 5 && (
            <div className="px-2 py-2 font-black text-gray-800">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          )}

          {totalPages > 1 && (
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`px-4 py-2 font-black border-3 border-black transition-all transform ${
                currentPage === totalPages
                  ? "bg-red-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-gray-800 hover:bg-red-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
              }`}
            >
              {totalPages}
            </button>
          )}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center px-4 py-2 font-black border-3 border-black transition-all transform ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-800 hover:bg-red-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
          }`}
        >
          {defaultLabels.nextText}
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
