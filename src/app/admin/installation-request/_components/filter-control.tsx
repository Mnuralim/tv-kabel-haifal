import React from "react";
import { ChevronDown, Search, SortAsc, SortDesc } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  currentSortOrder?: string;
}

export const FilterControl1 = ({ currentSortOrder }: Props) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const sortOptions = [
    { value: "fullName", label: "Nama" },
    { value: "createdAt", label: "Tanggal" },
  ];

  const statusOptions = [
    { value: "ALL", label: "Semua Status" },
    { value: "PENDING", label: "Menunggu Verifikasi" },
    { value: "APPROVED", label: "Disetujui" },
    { value: "COMPLETED", label: "Selesai" },
    { value: "REJECTED", label: "Ditolak" },
  ];

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.trim() === "") {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("search");
        replace(`/admin/installation-request?${newParams.toString()}`, {
          scroll: false,
        });
      } else {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("search", e.target.value);
        replace(`/admin/installation-request?${newParams.toString()}`, {
          scroll: false,
        });
      }
    },
    500
  );

  const handleFilterStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "ALL") {
      newParams.delete("status");
    } else {
      newParams.set("status", e.target.value);
    }
    replace(`/admin/installation-request?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortBy", e.target.value);
    replace(`/admin/installation-request?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleSortOrder = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortOrder", currentSortOrder === "asc" ? "desc" : "asc");
    replace(`/admin/installation-request?${newParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-none p-4">
        <div className="flex items-center mb-2">
          <Search className="w-5 h-5 mr-2" />
          <h3 className="font-bold">Pencarian</h3>
        </div>
        <div className="relative flex-1">
          <input
            type="text"
            onChange={handleSearch}
            placeholder="Cari berdasarkan nama, username..."
            className="w-full border-2 border-neutral-700 p-2 pl-10 rounded-none focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-none p-4 flex-1">
          <div className="flex items-center mb-2">
            <ChevronDown className="w-5 h-5 mr-2" />
            <h3 className="font-bold">Filter</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <label className="text-sm font-medium mb-1 block"></label>
              <select
                onChange={handleFilterStatus}
                className="w-full appearance-none border-2 border-neutral-700 p-2 pr-10 rounded-none focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-[calc(50%+0.5rem)] transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-none p-4 flex-1 md:flex-initial md:w-72">
          <div className="flex items-center mb-2">
            {currentSortOrder === "asc" ? (
              <SortAsc className="w-5 h-5 mr-2" />
            ) : (
              <SortDesc className="w-5 h-5 mr-2" />
            )}
            <h3 className="font-bold">Urutkan</h3>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <select
                onChange={handleSortBy}
                className="w-full appearance-none border-2 border-neutral-700 p-2 pr-10 rounded-none focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
            </div>
            <button
              onClick={handleSortOrder}
              className="bg-neutral-200 border-2 border-neutral-700 p-2 rounded-none hover:bg-neutral-300 transition-colors"
            >
              {currentSortOrder === "asc" ? (
                <SortAsc className="w-5 h-5" />
              ) : (
                <SortDesc className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
