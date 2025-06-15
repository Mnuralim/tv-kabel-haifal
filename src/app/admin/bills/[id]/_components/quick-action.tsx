import { formatDate } from "@/lib/utils";
import { CreditCard, Download, Mail } from "lucide-react";
import React from "react";
import type { BillDetailInfo } from "./bill-detail";
import Link from "next/link";

interface Props {
  bill: BillDetailInfo;
}

export const QuickAction = ({ bill }: Props) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h3>
        <div className="space-y-3">
          {bill.paymentStatus === "PAID" && bill.receipt && (
            <Link
              href={bill.receipt}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="w-full bg-green-600 text-white border-2 border-neutral-700 px-4 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Kwitansi
            </Link>
          )}

          {bill.paymentStatus !== "PAID" &&
            bill.paymentStatus !== "IN_REVIEW" && (
              <button className="w-full bg-blue-600 text-white border-2 border-neutral-700 px-4 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Proses Pembayaran Manual
              </button>
            )}
          {bill.paymentStatus === "UNPAID" ||
          bill.paymentStatus === "REJECTED" ? (
            <button className="w-full bg-orange-600 text-white border-2 border-neutral-700 px-4 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center">
              <Mail className="w-4 h-4 mr-2" />
              Kirim Reminder
            </button>
          ) : null}
        </div>
      </div>

      <div className="bg-white border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Timeline</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-semibold">Tagihan Dibuat</p>
              <p className="text-xs text-gray-600">
                {formatDate(bill.createdAt.toString())}
              </p>
            </div>
          </div>

          {bill.payment && (
            <>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-semibold">Pembayaran Diupload</p>
                  <p className="text-xs text-gray-600">
                    {formatDate(bill.payment.uploadDate.toString())}
                  </p>
                </div>
              </div>

              {bill.verifiedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-semibold">
                      Pembayaran Diverifikasi
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatDate(bill.verifiedAt.toString())}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
