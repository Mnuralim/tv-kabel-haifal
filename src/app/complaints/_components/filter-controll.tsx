import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { complaintCategories } from "./complaint-form";

interface Props {
  currentSort?: string;
}

export const FilterControll = ({ currentSort }: Props) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const handleFilterCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "ALL") {
      newParams.delete("category");
    } else {
      newParams.set("category", e.target.value);
    }
    replace(`/complaints?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleFilterComplaintStatus = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "ALL") {
      newParams.delete("status");
    } else {
      newParams.set("status", e.target.value);
    }
    replace(`/complaints?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    const [sortBy, sortOrder] = e.target.value.split("-");
    newParams.set("sortBy", sortBy);
    newParams.set("sortOrder", sortOrder);

    replace(`/complaints?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const complaintStatusOptions = [
    { value: "ALL", label: "Semua Status" },
    { value: "OPEN", label: "Dibuat" },
    { value: "IN_PROGRESS", label: "Dalam Proses" },
    { value: "RESOLVED", label: "Selesai" },
    { value: "CLOSED", label: "Ditutup" },
  ];

  const sortOptions = [
    { value: "createdAt-desc", label: "Terbaru" },
    { value: "createdAt-asc", label: "Terlama" },
  ];

  const categories = [
    {
      value: "ALL",
      label: "Semua Kategori",
    },
    ...complaintCategories,
  ];

  return (
    <div className="bg-white p-6  border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
      <h2 className="text-xl font-black text-gray-900 mb-4">Filter</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <select
          onChange={handleFilterCategory}
          value={searchParams.get("year") || ""}
          className="px-4 py-3 border-2 border-gray-300  font-medium focus:border-black focus:outline-none bg-white"
        >
          {categories.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          onChange={handleFilterComplaintStatus}
          className="px-4 py-3 border-2 border-gray-300  font-medium focus:border-black focus:outline-none bg-white"
        >
          {complaintStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          onChange={handleSortBy}
          className="px-4 py-3 border-2 border-gray-300  font-medium focus:border-black focus:outline-none bg-white"
          defaultValue={currentSort}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
