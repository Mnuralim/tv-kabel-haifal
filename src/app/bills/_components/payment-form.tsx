"use client";

import React, { useState } from "react";
import { Upload, Calendar, CreditCard } from "lucide-react";
import { useActionState } from "react";
import type { BillInfo } from "@/app/admin/bills/_components/bill-list";
import { getMonthName, formatCurrency } from "@/lib/utils";
import { createPaymentProof } from "@/actions/payment";
import { SubmitButton } from "./submit-button";
import { ErrorMessage } from "@/app/admin/_components/error-message";

interface Props {
  bill: BillInfo;
  onClose?: () => void;
}

export const PaymentForm = ({ bill, onClose }: Props) => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitState, submitAction] = useActionState(createPaymentProof, {
    error: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-black mb-6 border-b-4 border-red-500 pb-2 text-neutral-800">
        💳 Bayar Tagihan
      </h2>

      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-3 border-blue-200 shadow-[4px_4px_0px_0px_rgba(59,130,246,0.3)]">
        <div className="flex items-center gap-3 mb-3">
          <CreditCard className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-black text-neutral-800">
            Detail Tagihan
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-bold text-neutral-600">Periode</p>
            <p className="text-lg font-black text-neutral-800">
              {getMonthName(bill.month)} {bill.year}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-600">Jumlah Tagihan</p>
            <p className="text-lg font-black text-neutral-800">
              {formatCurrency(bill.amount)}
            </p>
          </div>
        </div>
      </div>

      <form action={submitAction}>
        <input type="hidden" name="billId" value={bill ? bill.id : ""} />

        {submitState.error ? (
          <ErrorMessage message={submitState.error} />
        ) : null}

        <div className="mb-6">
          <label className="flex items-center gap-2 text-neutral-800 mb-3 font-black text-lg">
            <Calendar className="w-5 h-5" />
            Tanggal Pembayaran *
          </label>
          <input
            type="date"
            name="paymentDate"
            max={today}
            className="w-full px-4 py-4 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-red-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800 font-bold text-lg"
            required
          />
          <p className="text-sm text-neutral-600 mt-2 font-medium">
            Pilih tanggal ketika Anda melakukan pembayaran
          </p>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2 text-neutral-800 mb-3 font-black text-lg">
            <Upload className="w-5 h-5" />
            Bukti Pembayaran *
          </label>

          <div className="border-3 border-dashed border-neutral-300 p-6 text-center bg-neutral-50 hover:bg-neutral-100 transition-colors">
            <input
              type="file"
              name="paymentProof"
              accept="image/jpeg,image/jpg,image/png,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="payment-proof"
              required
            />
            <label htmlFor="payment-proof" className="cursor-pointer block">
              <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-lg font-bold text-neutral-600 mb-2">
                {selectedFile ? "File Terpilih" : "Klik untuk upload file"}
              </p>
              {selectedFile && (
                <div className="bg-white border-2 border-neutral-300 p-3 rounded-none shadow-[2px_2px_0px_0px_rgba(230,230,230,1)] mb-3">
                  <p className="font-bold text-neutral-800">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {getFileSize(selectedFile.size)}
                  </p>
                </div>
              )}
              <p className="text-sm text-neutral-500 font-medium">
                Format: JPG, PNG, atau PDF
              </p>
              <p className="text-sm text-neutral-500 font-medium">
                Maksimal ukuran: 5MB
              </p>
            </label>
          </div>
          <p className="text-sm text-neutral-600 mt-2 font-medium">
            Upload foto struk transfer, screenshot m-banking, atau bukti
            pembayaran lainnya
          </p>
        </div>

        <div className="mb-6 bg-yellow-50 p-4 border-3 border-yellow-200">
          <h4 className="font-black text-yellow-800 mb-2">⚠️ Penting!</h4>
          <ul className="text-sm text-yellow-700 font-medium space-y-1">
            <li>• Pastikan bukti pembayaran jelas dan terbaca</li>
            <li>• Jumlah pembayaran harus sesuai dengan total tagihan</li>
            <li>• Pembayaran akan diverifikasi dalam 1x24 jam</li>
            <li>• Jika ditolak, Anda bisa mengajukan ulang</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8 pb-10">
          <button
            type="button"
            onClick={onClose}
            className="py-4 px-6 bg-neutral-200 text-neutral-800 border-4 border-neutral-300 font-black text-lg shadow-[4px_4px_0px_0px_rgba(230,230,230,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(230,230,230,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
          >
            Batal
          </button>
          <SubmitButton modalMode="add" />
        </div>
      </form>
    </div>
  );
};
