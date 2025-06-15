"use client";

import React, { useState } from "react";
import { ErrorMessage } from "../../_components/error-message";
import { useActionState } from "react";
import { SubmitButton } from "./submit-button";
import { createBill, updateBill } from "@/actions/bill";
import type { BillInfo } from "./bill-list";
import type { CustomerInfo } from "../../customers/_components/customer-list";

interface Props {
  modal?: "add" | "edit";
  selectedBill?: BillInfo | null;
  customers?: CustomerInfo[];
  onClose: () => void;
}

export const BillForm = ({
  modal,
  selectedBill,
  customers = [],
  onClose,
}: Props) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [createState, createAction] = useActionState(createBill, {
    error: null,
  });
  const [updateState, updateAction] = useActionState(updateBill, {
    error: null,
  });

  const [selectedCustomer, setSelectedCustomer] = useState<string>(
    selectedBill?.customerId || ""
  );

  const months = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ];

  return (
    <>
      <h2 className="text-2xl md:text-3xl font-black mb-6 border-b-4 border-red-500 pb-2 text-neutral-800">
        {modal === "add" ? "Tambah Tagihan" : "Edit Tagihan"}
      </h2>
      <form
        className="overflow-y-auto max-h-[calc(100vh-200px)]"
        action={modal === "add" ? createAction : updateAction}
      >
        {modal === "edit" && (
          <input type={"hidden"} name="customerId" value={selectedCustomer} />
        )}
        <input type="hidden" name="id" defaultValue={selectedBill?.id} />
        {createState.error || updateState.error ? (
          <ErrorMessage message={createState.error || updateState.error} />
        ) : null}

        <div className="mb-5">
          <label className="block text-neutral-800 mb-2 font-bold">
            Pelanggan
          </label>
          <select
            name="customerId"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
            required
            disabled={modal === "edit"}
            defaultValue={selectedCustomer || ""}
          >
            <option value="">Pilih Pelanggan</option>
            {customers
              .filter(
                (customer) => customer.customerDetails?.status === "ACTIVE"
              )
              .map((customer) => (
                <option
                  key={customer.customerDetails?.id}
                  value={customer.customerDetails?.id}
                >
                  {customer.customerDetails?.fullName || customer.username}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-neutral-800 mb-2 font-bold">Bulan</label>
          <select
            name="month"
            className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
            required
            defaultValue={selectedBill?.month || currentMonth}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-neutral-800 mb-2 font-bold">Tahun</label>
          <input
            type="number"
            name="year"
            placeholder="Masukkan tahun"
            min={currentYear - 1}
            max={currentYear + 10}
            className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
            required
            defaultValue={selectedBill?.year || currentYear}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8 pb-10">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 bg-neutral-200 text-neutral-800 border-4 border-neutral-300 font-bold shadow-[4px_4px_0px_0px_rgba(230,230,230,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(230,230,230,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
          >
            Batal
          </button>
          <SubmitButton modalMode={modal as "add" | "edit"} />
        </div>
      </form>
    </>
  );
};
