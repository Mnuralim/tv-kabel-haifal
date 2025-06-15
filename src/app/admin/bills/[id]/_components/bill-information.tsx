import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from "@/lib/utils";
import { AlertCircle, Calendar, Clock, XCircle } from "lucide-react";
import React from "react";
import type { BillDetailInfo } from "./bill-detail";

interface Props {
  bill: BillDetailInfo;
}

export const BillInformation = ({ bill }: Props) => {
  const isOverdue =
    new Date() > new Date(bill.dueDate) && bill.paymentStatus !== "PAID";
  const daysUntilDue = Math.ceil(
    (new Date(bill.dueDate).getTime() - new Date().getTime()) /
      (1000 * 3600 * 24)
  );

  return (
    <div className="bg-white border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Informasi Tagihan</h2>
        <div className="flex items-center gap-2">
          {getStatusIcon(bill.paymentStatus)}
          <span
            className={`px-3 py-1 text-sm font-semibold border-2 ${getStatusColor(
              bill.paymentStatus
            )}`}
          >
            {getStatusText(bill.paymentStatus)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">
              ID Tagihan
            </label>
            <p className="text-lg font-mono">{bill.id}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Periode
            </label>
            <p className="text-lg font-semibold">
              {bill.month}/{bill.year}
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Jatuh Tempo
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <p className="text-lg">{formatDate(bill.dueDate.toString())}</p>
              {isOverdue && (
                <span className="text-red-600 text-sm font-semibold">
                  (Terlambat {Math.abs(daysUntilDue)} hari)
                </span>
              )}
              {!isOverdue &&
                bill.paymentStatus !== "PAID" &&
                daysUntilDue > 0 && (
                  <span className="text-orange-600 text-sm font-semibold">
                    ({daysUntilDue} hari lagi)
                  </span>
                )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Jumlah Tagihan
            </label>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(bill.amount)}
            </p>
          </div>

          <div className="border-t-2 border-gray-200 pt-2">
            <label className="text-sm font-semibold text-gray-600">
              Total Pembayaran
            </label>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(bill.amount)}
            </p>
          </div>
        </div>
      </div>

      {bill &&
        bill.paymentStatus !== "PAID" &&
        new Date(bill.dueDate).getTime() < new Date().getTime() && (
          <div className="mt-6 p-4 bg-red-50 border-2 border-red-200">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">
                Peringatan: Tagihan Terlambat
              </span>
            </div>
            <p className="text-red-700 mt-1">
              Tagihan ini sudah melewati batas jatuh tempo. Mohon segera lakukan
              pembayaran untuk menghindari denda tambahan.
            </p>
          </div>
        )}

      {bill && bill.paymentStatus === "IN_REVIEW" && (
        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200">
          <div className="flex items-center gap-2 text-blue-800">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">
              Menunggu Verifikasi Pembayaran
            </span>
          </div>
          <p className="text-blue-700 mt-1">
            Pelanggan telah mengirim bukti pembayaran dan menunggu verifikasi
            dari admin.
          </p>
        </div>
      )}

      {bill && bill.paymentStatus === "REJECTED" && (
        <div className="mt-6 p-4 bg-red-50 border-2 border-red-200">
          <div className="flex items-center gap-2 text-red-800">
            <XCircle className="w-5 h-5" />
            <span className="font-semibold">Pembayaran Ditolak</span>
          </div>
          <p className="text-red-700 mt-1">
            Bukti pembayaran yang dikirim pelanggan telah ditolak. Pelanggan
            perlu mengirim ulang bukti pembayaran yang valid.
          </p>
          {bill.payment?.notes && (
            <p className="text-red-700 mt-2 text-sm">
              <strong>Alasan:</strong> {bill.payment.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
