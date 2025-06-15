import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export const FilterControll = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const handleFilterYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "") {
      newParams.delete("year");
    } else {
      newParams.set("year", e.target.value);
    }
    replace(`/bills?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleFilterPaymentStatus = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "ALL") {
      newParams.delete("paymentStatus");
    } else {
      newParams.set("paymentStatus", e.target.value);
    }
    replace(`/bills?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    const [sortBy, sortOrder] = e.target.value.split("-");
    newParams.set("sortBy", sortBy);
    newParams.set("sortOrder", sortOrder);

    replace(`/bills?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: "", label: "Semua Tahun" },
    ...Array.from({ length: 5 }, (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString(),
    })),
  ];

  const paymentStatusOptions = [
    { value: "ALL", label: "Semua Status" },
    { value: "PAID", label: "Sudah Dibayar" },
    { value: "UNPAID", label: "Belum Dibayar" },
    { value: "IN_REVIEW", label: "Menunggu Verifikasi" },
    { value: "REJECTED", label: "Ditolak" },
  ];

  const sortOptions = [
    { value: "createdAt-desc", label: "Terbaru" },
    { value: "createdAt-asc", label: "Terlama" },
    { value: "amount-desc", label: "Jumlah Tertinggi" },
    { value: "amount-asc", label: "Jumlah Terendah" },
  ];

  return (
    <div className="bg-white p-6  border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
      <h2 className="text-xl font-black text-gray-900 mb-4">Filter</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <select
          onChange={handleFilterYear}
          value={searchParams.get("year") || ""}
          className="px-4 py-3 border-2 border-gray-300  font-medium focus:border-black focus:outline-none bg-white"
        >
          {yearOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          onChange={handleFilterPaymentStatus}
          value={searchParams.get("paymentStatus") || "ALL"}
          className="px-4 py-3 border-2 border-gray-300  font-medium focus:border-black focus:outline-none bg-white"
        >
          {paymentStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          onChange={handleSortBy}
          className="px-4 py-3 border-2 border-gray-300  font-medium focus:border-black focus:outline-none bg-white"
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
