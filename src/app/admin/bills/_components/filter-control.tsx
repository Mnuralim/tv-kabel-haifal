import React from "react";
import {
  ChevronDown,
  Search,
  SortAsc,
  SortDesc,
  Calendar,
  User,
  CreditCard,
} from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";
import type { CustomerInfo } from "../../customers/_components/customer-list";

interface Props {
  currentSortOrder?: string;
  customers?: CustomerInfo[];
}

export const BillFilterControl = ({
  currentSortOrder,
  customers = [],
}: Props) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const sortOptions = [
    { value: "createdAt", label: "Tanggal Dibuat" },
    { value: "dueDate", label: "Tanggal Jatuh Tempo" },
    { value: "amount", label: "Jumlah Tagihan" },
    { value: "month", label: "Bulan" },
    { value: "year", label: "Tahun" },
  ];

  const paymentStatusOptions = [
    { value: "ALL", label: "Semua Status" },
    { value: "PAID", label: "Sudah Dibayar" },
    { value: "UNPAID", label: "Belum Dibayar" },
    { value: "IN_REVIEW", label: "Menunggu Verifikasi" },
    { value: "REJECTED", label: "Ditolak" },
  ];

  const monthOptions = [
    { value: "", label: "Semua Bulan" },
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: "", label: "Semua Tahun" },
    ...Array.from({ length: 5 }, (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString(),
    })),
  ];

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newParams = new URLSearchParams(searchParams);
      if (e.target.value.trim() === "") {
        newParams.delete("search");
      } else {
        newParams.set("search", e.target.value);
      }
      replace(`/admin/bills?${newParams.toString()}`, {
        scroll: false,
      });
    },
    500
  );

  const handleFilterPaymentStatus = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "ALL") {
      newParams.delete("paymentStatus");
    } else {
      newParams.set("paymentStatus", e.target.value);
    }
    replace(`/admin/bills?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleFilterMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "") {
      newParams.delete("month");
    } else {
      newParams.set("month", e.target.value);
    }
    replace(`/admin/bills?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleFilterYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "") {
      newParams.delete("year");
    } else {
      newParams.set("year", e.target.value);
    }
    replace(`/admin/bills?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleFilterCustomer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "") {
      newParams.delete("customerId");
    } else {
      newParams.set("customerId", e.target.value);
    }
    replace(`/admin/bills?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortBy", e.target.value);
    replace(`/admin/bills?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleSortOrder = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortOrder", currentSortOrder === "asc" ? "desc" : "asc");
    replace(`/admin/bills?${newParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Search Section */}
      <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-none p-4">
        <div className="flex items-center mb-2">
          <Search className="w-5 h-5 mr-2" />
          <h3 className="font-bold">Pencarian</h3>
        </div>
        <div className="relative">
          <input
            type="text"
            onChange={handleSearch}
            placeholder="Cari tagihan berdasarkan nama pelanggan..."
            className="w-full border-2 border-neutral-700 p-2 pl-10 rounded-none focus:outline-none focus:ring-2 focus:ring-red-500"
            defaultValue={searchParams.get("search") || ""}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-none p-4">
        <div className="flex items-center mb-3">
          <ChevronDown className="w-5 h-5 mr-2" />
          <h3 className="font-bold">Filter</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Payment Status Filter */}
          <div className="relative">
            <label className="text-sm font-medium mb-1  flex items-center">
              <CreditCard className="w-4 h-4 mr-1" />
              Status Pembayaran
            </label>
            <select
              onChange={handleFilterPaymentStatus}
              value={searchParams.get("paymentStatus") || "ALL"}
              className="w-full appearance-none border-2 border-neutral-700 p-2 pr-10 rounded-none focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {paymentStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-[calc(50%+0.75rem)] transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
          </div>

          {/* Month Filter */}
          <div className="relative">
            <label className="text-sm font-medium mb-1  flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Bulan
            </label>
            <select
              onChange={handleFilterMonth}
              value={searchParams.get("month") || ""}
              className="w-full appearance-none border-2 border-neutral-700 p-2 pr-10 rounded-none focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-[calc(50%+0.75rem)] transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
          </div>

          {/* Year Filter */}
          <div className="relative">
            <label className="text-sm font-medium mb-1  flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Tahun
            </label>
            <select
              onChange={handleFilterYear}
              value={searchParams.get("year") || ""}
              className="w-full appearance-none border-2 border-neutral-700 p-2 pr-10 rounded-none focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {yearOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-[calc(50%+0.75rem)] transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
          </div>

          {/* Customer Filter */}
          <div className="relative">
            <label className="text-sm font-medium mb-1 flex items-center">
              <User className="w-4 h-4 mr-1" />
              Pelanggan
            </label>
            <select
              onChange={handleFilterCustomer}
              value={searchParams.get("customerId") || ""}
              className="w-full appearance-none border-2 border-neutral-700 p-2 pr-10 rounded-none focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Semua Pelanggan</option>
              {customers
                .filter((customer) => customer.customerDetails?.fullName)
                .map((customer) => (
                  <option
                    key={customer.customerDetails?.id}
                    value={customer.customerDetails?.id}
                  >
                    {customer.customerDetails?.fullName || customer.username}
                  </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-[calc(50%+0.75rem)] transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Sort Section */}
      <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-none p-4">
        <div className="flex items-center mb-3">
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
              value={searchParams.get("sortBy") || "createdAt"}
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
  );
};
