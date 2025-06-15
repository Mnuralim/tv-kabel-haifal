"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Clock,
  AlertTriangle,
  Download,
  FileText,
  Phone,
  Copy,
  HelpCircle,
  MessageCircle,
  Bell,
  Info,
  Building,
  XCircle,
} from "lucide-react";
import {
  formatCurrency,
  formatDate,
  getMonthName,
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from "@/lib/utils";
import type { BillInfo } from "@/app/admin/bills/_components/bill-list";
import { useRouter } from "next/navigation";
import { Modal } from "@/app/admin/_components/modal";
import { PaymentForm } from "../../_components/payment-form";
import Link from "next/link";
import type { CompanySettings } from "@prisma/client";

interface Props {
  bill: BillInfo;
  modal?: "add";
  setting?: CompanySettings;
}

export const BillDetail = ({ bill, modal, setting }: Props) => {
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const router = useRouter();
  const isPaymentModalOpen = modal === "add";

  const handleOpenPaymentModal = () => {
    router.push(`/bills/${bill.id}?modal=add`, {
      scroll: false,
    });
  };

  const handleCloseOpenModal = () => {
    router.back();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const isOverdue =
    new Date(bill.dueDate) < new Date() && bill.paymentStatus !== "PAID";
  const daysUntilDue = Math.ceil(
    (new Date(bill.dueDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Tagihan Saya
        </button>
      </div>

      {isOverdue && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-600 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-bold text-red-900">Tagihan Terlambat!</h3>
              <p className="text-red-700">
                Tagihan ini sudah melewati batas waktu pembayaran. Segera
                lakukan pembayaran untuk menghindari denda lebih lanjut.
              </p>
            </div>
          </div>
        </div>
      )}

      {bill.paymentStatus === "IN_REVIEW" && (
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-600 shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-bold text-yellow-900">
                Pembayaran Sedang Diverifikasi
              </h3>
              <p className="text-yellow-700">
                Bukti pembayaran Anda sedang dalam proses verifikasi. Mohon
                tunggu maksimal 1x24 jam.
              </p>
            </div>
          </div>
        </div>
      )}

      {bill.paymentStatus === "REJECTED" && bill.payment?.notes && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-600 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]">
          <div className="flex items-start gap-3">
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-900">Pembayaran Ditolak</h3>
              <p className="text-red-700 mb-2">
                Bukti pembayaran Anda ditolak oleh admin. Silakan periksa
                catatan di bawah dan lakukan pembayaran ulang.
              </p>
              <div className="p-3 bg-red-100 border border-red-300 rounded">
                <p className="text-sm font-medium text-red-800">
                  <strong>Catatan Admin:</strong>
                </p>
                <p className="text-sm text-red-700 mt-1">
                  {bill.payment.notes}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="p-6 border-b-2 border-black bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 mb-1">
                    Tagihan {getMonthName(bill.month)} {bill.year}
                  </h1>
                  <p className="text-gray-600 font-medium">
                    No. Tagihan: {bill.id}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-bold border-2 ${getStatusColor(
                    bill.paymentStatus
                  )}`}
                >
                  {getStatusIcon(bill.paymentStatus)}
                  {getStatusText(bill.paymentStatus)}
                </div>
              </div>

              {!isOverdue && daysUntilDue > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-700">
                    {daysUntilDue} hari lagi sampai jatuh tempo
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1  gap-6 mb-6">
                <div className="text-center">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Total Pembayaran
                  </label>
                  <div className="text-3xl font-black text-green-600">
                    {formatCurrency(bill.amount)}
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Jatuh Tempo
                    </label>
                    <div className="font-bold text-lg text-gray-900">
                      {formatDate(bill.dueDate.toString())}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-1" />
                      Tanggal Dibuat
                    </label>
                    <div className="font-medium text-gray-900">
                      {formatDate(bill.createdAt.toString())}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bill.paymentStatus !== "PAID" && (
              <button
                onClick={handleOpenPaymentModal}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                disabled={bill.paymentStatus === "IN_REVIEW"}
              >
                <CreditCard className="w-5 h-5" />
                {bill.paymentStatus === "IN_REVIEW"
                  ? "Menunggu Verifikasi"
                  : bill.paymentStatus === "REJECTED"
                  ? "Bayar Ulang"
                  : "Bayar Sekarang"}
              </button>
            )}

            <button
              onClick={() => setShowPaymentInfo(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <Info className="w-5 h-5" />
              Info Pembayaran
            </button>

            {bill.paymentStatus === "PAID" && bill.receipt && (
              <Link
                href={bill.receipt}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <Download className="w-5 h-5" />
                Download Kwitansi
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="p-6 border-b-2 border-black">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Butuh Bantuan?
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-green-50 border-2 border-green-200 hover:border-green-400 transition-colors">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <div className="font-bold text-green-900">WhatsApp</div>
                  <div className="text-xs text-green-700">
                    Chat langsung dengan CS
                  </div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-3 bg-blue-50 border-2 border-blue-200 hover:border-blue-400 transition-colors">
                <Phone className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-bold text-blue-900">Telepon</div>
                  <div className="text-xs text-blue-700">
                    {setting?.phoneNumber}
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(234,179,8,1)] p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-1">💡 Tips</h3>
                <p className="text-sm text-yellow-800">
                  Bayar tagihan sebelum tanggal jatuh tempo untuk menghindari
                  denda keterlambatan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isPaymentModalOpen} onClose={handleCloseOpenModal}>
        <PaymentForm bill={bill} onClose={handleCloseOpenModal} />
      </Modal>

      <Modal isOpen={showPaymentInfo} onClose={() => setShowPaymentInfo(false)}>
        <div className=" border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]  w-full">
          <div className="p-6 border-b-2 border-black flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900">
              Info Pembayaran
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border-2 border-green-200">
                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Transfer Bank
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      BANK
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{setting?.bankName}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      NO. REKENING
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">
                        {setting?.accountNumber}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            setting?.accountNumber || "",
                            "rekening"
                          )
                        }
                        className="p-1 hover:bg-gray-200 border-2 border-transparent hover:border-black transition-all"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      ATAS NAMA
                    </label>
                    <div className="font-bold">{setting?.accountName}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      JUMLAH TRANSFER
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-green-600 text-lg">
                        {formatCurrency(bill.amount)}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(bill.amount.toString(), "jumlah")
                        }
                        className="p-1 hover:bg-gray-200 border-2 border-transparent hover:border-black transition-all"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border-2 border-blue-200">
                <h4 className="font-bold text-blue-900 mb-2">
                  📝 Cara Pembayaran:
                </h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Transfer sesuai jumlah yang tertera</li>
                  <li>2. Simpan bukti transfer</li>
                  <li>3. Upload bukti transfer di aplikasi</li>
                  <li>4. Tunggu verifikasi maksimal 1x24 jam</li>
                </ol>
              </div>

              {copiedText && (
                <div className="p-2 bg-green-100 border-2 border-green-400 text-center">
                  <span className="text-sm font-bold text-green-800">
                    ✅ {copiedText} berhasil disalin!
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowPaymentInfo(false)}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Mengerti
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
