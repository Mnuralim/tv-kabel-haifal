import { ChevronDown, Filter, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useDebouncedCallback } from "use-debounce";

export const FilterControll = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newParams = new URLSearchParams(searchParams);

      if (e.target.value === "") {
        newParams.delete("search");
      } else {
        newParams.set("search", e.target.value);
      }

      router.push(`/notifications?${newParams.toString()}`, {
        scroll: false,
      });
    },
    500
  );
  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "ALL") {
      newParams.delete("type");
    } else {
      newParams.set("type", e.target.value);
    }
    router.push(`/notifications?${newParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="mb-6 sm:mb-8 space-y-4">
      <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] p-4">
        <div className="flex items-center mb-2">
          <Search className="w-5 h-5 mr-2" />
          <h3 className="font-bold">Pencarian</h3>
        </div>
        <div className="relative">
          <input
            type="text"
            onChange={handleSearch}
            placeholder="Cari notifikasi..."
            className="w-full border-2 border-neutral-700 p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
      </div>

      <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] p-4">
        <div className="flex items-center mb-2">
          <Filter className="w-5 h-5 mr-2" />
          <h3 className="font-bold">Filter</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <label className="text-sm font-medium mb-1 block">
              Tipe Notifikasi
            </label>
            <select
              onChange={handleFilter}
              className="w-full appearance-none border-2 border-neutral-700 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Semua Tipe</option>
              <option value="BILL_DUE">Tagihan Jatuh Tempo</option>
              <option value="PAYMENT_CONFIRMED">Pembayaran Dikonfirmasi</option>
              <option value="COMPLAINT_UPDATE">Update Keluhan</option>
              <option value="INSTALLATION_SCHEDULED">
                Instalasi Terjadwal
              </option>
              <option value="SERVICE_ANNOUNCEMENT">Pengumuman Layanan</option>
            </select>
            <ChevronDown className="absolute right-3 top-[calc(50%+0.5rem)] transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
