"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import type { CustomerInfo } from "./customer-list";
import { ErrorMessage } from "../../_components/error-message";
import { useActionState } from "react";
import { SubmitButton } from "./submit-button";
import type { CustomerStatus } from "@prisma/client";
import { createCustomer, updateCustomer } from "@/actions/customer/index";

interface Props {
  modal?: "add" | "edit";
  selectedCustomer?: CustomerInfo | null;
  onClose: () => void;
}

export const CustomerForm = ({ modal, selectedCustomer, onClose }: Props) => {
  const [selectStatus, setSelectStatus] = useState<CustomerStatus>(
    selectedCustomer?.customerDetails?.status || "INACTIVE"
  );
  const [createState, createAction] = useActionState(createCustomer, {
    error: null,
  });
  const [updateState, updateAction] = useActionState(updateCustomer, {
    error: null,
  });

  return (
    <>
      <h2 className="text-2xl md:text-3xl font-black mb-6 border-b-4 border-red-500 pb-2 text-neutral-800">
        {modal === "add" ? "Tambah Customer" : "Edit Customer"}
      </h2>
      <form action={modal === "add" ? createAction : updateAction}>
        <input type="hidden" name="id" defaultValue={selectedCustomer?.id} />
        {createState.error || updateState.error ? (
          <ErrorMessage message={createState.error || updateState.error} />
        ) : null}

        <div className="mb-5">
          <label className="block text-neutral-800 mb-2 font-bold">
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="Masukkan username"
            className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
            required
            defaultValue={selectedCustomer?.username}
          />
        </div>

        {modal === "add" ? null : (
          <div className="mb-5">
            <label className="block text-neutral-800 mb-2 font-bold">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Masukkan password"
              maxLength={6}
              className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
              required
            />
          </div>
        )}

        <div className="mb-5">
          <label className="block text-neutral-800 mb-2 font-bold">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Masukkan nama lengkap"
            className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
            required
            defaultValue={selectedCustomer?.customerDetails?.fullName || ""}
          />
        </div>

        <div className="mb-5">
          <label className="block text-neutral-800 mb-2 font-bold">
            Alamat
          </label>
          <textarea
            name="address"
            placeholder="Masukkan alamat lengkap"
            className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800 min-h-[100px] resize-vertical"
            required
            defaultValue={selectedCustomer?.customerDetails?.address || ""}
          />
        </div>

        <div className="mb-5">
          <label className="block text-neutral-800 mb-2 font-bold">
            No. HP
          </label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Masukkan nomor HP"
            className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
            required
            defaultValue={selectedCustomer?.customerDetails?.phoneNumber || ""}
          />
        </div>

        <div className="mb-5">
          <label className="block text-neutral-800 mb-2 font-bold">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Masukkan email"
            className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
            required
            defaultValue={selectedCustomer?.customerDetails?.email || ""}
          />
        </div>

        <div className="mb-5">
          <label className="block text-neutral-800 mb-2 font-bold">
            No. KTP
          </label>
          <input
            type="text"
            name="idCardNumber"
            maxLength={16}
            placeholder="Masukkan nomor KTP"
            className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
            required
            defaultValue={selectedCustomer?.customerDetails?.idCardNumber || ""}
          />
        </div>

        <div className="mb-5">
          <label className="block text-neutral-800 mb-2 font-bold">
            No. KK
          </label>
          <input
            type="text"
            name="familyCardNumber"
            maxLength={16}
            placeholder="Masukkan nomor KK"
            className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
            required
            defaultValue={
              selectedCustomer?.customerDetails?.familyCardNumber || ""
            }
          />
        </div>
        <div className="mb-5">
          <label className="block text-neutral-800 mb-2 font-bold">
            Tempat Lahir
          </label>
          <input
            type="text"
            name="birthPlace"
            placeholder="Masukkan tempat lahir"
            className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
            required
            defaultValue={
              selectedCustomer?.customerDetails?.birthPlace.toString() || ""
            }
          />
        </div>

        <div className="mb-5">
          <label className="block text-neutral-800 mb-2 font-bold">
            Tanggal Lahir
          </label>
          <input
            type="date"
            name="birthDate"
            className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
            required
            defaultValue={
              selectedCustomer?.customerDetails?.birthDate
                ? new Date(selectedCustomer?.customerDetails.birthDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
          />
        </div>

        <div className="mb-5">
          <label className="block text-neutral-800 mb-2 font-bold">
            Status
          </label>
          <div className="flex space-x-6">
            {["ACTIVE", "INACTIVE", "SUSPENDED"].map((statusOption) => (
              <label
                key={statusOption}
                className="flex items-center cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="radio"
                    name="status"
                    value={statusOption}
                    checked={selectStatus === statusOption}
                    onChange={(e) =>
                      setSelectStatus(e.target.value as CustomerStatus)
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-6 h-6 border-2 border-neutral-300 ${
                      statusOption === selectStatus
                        ? "bg-red-500"
                        : "bg-neutral-200"
                    } mr-2 flex items-center justify-center`}
                  >
                    {statusOption === selectStatus && (
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    )}
                  </div>
                </div>
                <span className="text-neutral-800 font-bold">
                  {statusOption}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-neutral-800 mb-2 font-bold">
            Tanggal Registrasi
          </label>
          <input
            type="date"
            name="registrationDate"
            className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
            required
            defaultValue={
              selectedCustomer?.customerDetails?.registrationDate
                ? new Date(selectedCustomer?.customerDetails.registrationDate)
                    .toISOString()
                    .split("T")[0]
                : new Date().toISOString().split("T")[0]
            }
          />
        </div>

        <div className="mb-5">
          <label className="block text-neutral-800 mb-2 font-bold">
            Mulai Berlangganan
          </label>
          <input
            type="date"
            name="subscriptionDate"
            className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
            defaultValue={
              selectedCustomer?.customerDetails?.subscriptionStartDate
                ? new Date(
                    selectedCustomer?.customerDetails.subscriptionStartDate
                  )
                    .toISOString()
                    .split("T")[0]
                : ""
            }
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
