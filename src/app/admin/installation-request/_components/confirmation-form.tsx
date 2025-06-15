"use client";

import React from "react";
import { ErrorMessage } from "../../_components/error-message";
import { useActionState } from "react";
import { SubmitButton } from "./submit-button";
import { confirmInstallationRequest } from "@/actions/installation-request";

interface Props {
  modal?: "accept" | "reject";
  selectedId?: string | null;
  onClose: () => void;
  isDetail?: "0" | "1";
}

export const ConfirmationForm = ({
  modal,
  selectedId,
  onClose,
  isDetail = "0",
}: Props) => {
  const [confirmState, confirmAction] = useActionState(
    confirmInstallationRequest,
    {
      error: null,
    }
  );

  return (
    <>
      <h2 className="text-2xl md:text-3xl font-black mb-6 border-b-4 border-red-500 pb-2 text-neutral-800">
        {modal === "accept" ? "Jadwalkan Instalasi" : "Alasan Penolakan"}
      </h2>
      <form action={confirmAction}>
        <input type="hidden" name="id" defaultValue={selectedId || ""} />
        {confirmState.error ? (
          <ErrorMessage message={confirmState.error} />
        ) : null}
        <input
          type="hidden"
          name="isDetail"
          defaultValue={isDetail === "0" ? "0" : "1"}
        />
        <input
          type="hidden"
          name="status"
          defaultValue={modal === "accept" ? "APPROVED" : "REJECTED"}
        />
        {modal === "accept" && (
          <div className="mb-5">
            <label className="block text-neutral-800 mb-2 font-bold">
              Tanggal Instalasi
            </label>
            <input
              type="date"
              name="scheduledDate"
              className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
              required
            />
          </div>
        )}

        {modal === "reject" && (
          <div className="mb-5">
            <label className="block text-neutral-800 mb-2 font-bold">
              Alasan Penolakan
            </label>
            <textarea
              name="notes"
              className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
              required
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-8 pb-10">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 bg-neutral-200 text-neutral-800 border-4 border-neutral-300 font-bold shadow-[4px_4px_0px_0px_rgba(230,230,230,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(230,230,230,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
          >
            Batal
          </button>
          <SubmitButton modalMode={modal as "accept" | "reject"} />
        </div>
      </form>
    </>
  );
};
