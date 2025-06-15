"use client";

import type { Prisma } from "@prisma/client";
import {
  ArrowLeft,
  Calendar,
  AlertCircle,
  XCircle,
  Download,
  Eye,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { formatDate, getStatusColor, getStatusText } from "@/lib/utils";
import { Modal } from "@/app/admin/_components/modal";
import { BillInformation } from "./bill-information";
import { CustomerInformation } from "./customer-information";
import { QuickAction } from "./quick-action";
import { confirmPaymentProof } from "@/actions/bill";
import Image from "next/image";

export type BillDetailInfo = Prisma.BillGetPayload<{
  include: {
    customer: {
      include: {
        user: {
          select: {
            username: true;
            lastLogin: true;
          };
        };
      };
    };
    payment: {
      include: {
        admin: {
          select: {
            adminName: true;
          };
        };
      };
    };
  };
}>;

interface Props {
  bill: BillDetailInfo;
}

export const BillDetail = ({ bill }: Props) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPaymentProof, setShowPaymentProof] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleBack = () => {
    router.push("/admin/bills");
  };

  const handleVerifyPayment = async (status: "APPROVED" | "REJECTED") => {
    if (status === "REJECTED") {
      setShowVerificationModal(true);
    } else {
      await verifyPaymentNow("PAID");
    }
  };

  const verifyPaymentNow = async (status: "PAID" | "REJECTED") => {
    setIsVerifying(true);
    const response = await confirmPaymentProof(
      bill.id,
      status,
      status === "REJECTED" ? verificationNotes : undefined
    );
    if (response?.error) {
      alert(response.error);
      setIsVerifying(false);
      setShowVerificationModal(false);
      setVerificationNotes("");
    } else {
      alert("Berhasil memverifikasi pembayaran");
    }

    setShowVerificationModal(false);
    setVerificationNotes("");
    setIsVerifying(false);
  };

  const canVerifyPayment = bill.payment && bill.paymentStatus === "IN_REVIEW";

  return (
    <div className="w-full pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="bg-gray-600 text-white border-2 border-neutral-700 px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black border-b-8 border-blue-500 pb-2 text-black">
            Detail Tagihan
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BillInformation bill={bill} />
          <CustomerInformation bill={bill} />
          {bill.payment ? (
            <div className="bg-white border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Informasi Pembayaran
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Tanggal Pembayaran
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <p className="text-lg">
                        {formatDate(bill.payment.paymentDate.toString())}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Tanggal Upload Bukti
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <p className="text-lg">
                        {formatDate(bill.payment.uploadDate.toString())}
                      </p>
                    </div>
                  </div>

                  {bill.payment.admin && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Diverifikasi Oleh
                      </label>
                      <p className="text-lg">{bill.payment.admin.adminName}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Status Pembayaran
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-3 py-1 text-sm font-semibold border-2 ${getStatusColor(
                          bill.paymentStatus
                        )}`}
                      >
                        {getStatusText(bill.paymentStatus)}
                      </span>
                    </div>
                  </div>

                  {bill.verifiedAt && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Tanggal Verifikasi
                      </label>
                      <p className="text-lg">
                        {formatDate(bill.verifiedAt.toString())}
                      </p>
                    </div>
                  )}

                  {bill.payment.paymentProof && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Bukti Pembayaran
                      </label>
                      <button
                        onClick={() => setShowPaymentProof(true)}
                        className="flex items-center gap-2 mt-1 bg-blue-600 text-white px-3 py-2 border-2 border-neutral-700 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        Lihat Bukti
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {bill.payment.notes && (
                <div className="mt-6 p-4 bg-gray-50 border-2 border-gray-200">
                  <label className="text-sm font-semibold text-gray-600">
                    Catatan Verifikasi
                  </label>
                  <p className="text-base mt-1">{bill.payment.notes}</p>
                </div>
              )}

              {canVerifyPayment && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleVerifyPayment("APPROVED")}
                    disabled={isVerifying}
                    className="bg-green-600 text-white border-2 border-neutral-700 px-4 py-2 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? "Memproses..." : "Setujui Pembayaran"}
                  </button>
                  <button
                    onClick={() => handleVerifyPayment("REJECTED")}
                    disabled={isVerifying}
                    className="bg-red-600 text-white border-2 border-neutral-700 px-4 py-2 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? "Memproses..." : "Tolak Pembayaran"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Status Pembayaran
              </h2>
              <div className="text-center py-8">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-2">
                  Belum ada bukti pembayaran yang dikirim
                </p>
                <p className="text-sm text-gray-500">
                  Pelanggan belum mengirim bukti pembayaran untuk tagihan ini
                </p>
              </div>
            </div>
          )}
        </div>
        <QuickAction bill={bill} />
      </div>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
            <h3 className="text-xl font-bold">Konfirmasi Hapus</h3>
          </div>
          <p className="text-gray-700 mb-6">
            Apakah Anda yakin ingin menghapus tagihan ini? Tindakan ini tidak
            dapat dibatalkan.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="bg-gray-600 text-white border-2 border-neutral-700 px-4 py-2 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
            >
              Batal
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
              }}
              className="bg-red-600 text-white border-2 border-neutral-700 px-4 py-2 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
            >
              Hapus
            </button>
          </div>
        </div>
      </Modal>

      {bill.payment?.paymentProof && (
        <Modal
          isOpen={showPaymentProof}
          onClose={() => setShowPaymentProof(false)}
        >
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Bukti Pembayaran</h3>
            <div className="text-center">
              <Image
                width={600}
                height={600}
                src={bill.payment.paymentProof}
                alt="Bukti Pembayaran"
                className="max-w-full max-h-96 mx-auto border-2 border-gray-300"
              />
              <div className="mt-4 flex gap-3 justify-center">
                <button
                  onClick={() => setShowPaymentProof(false)}
                  className="bg-gray-600 text-white border-2 border-neutral-700 px-4 py-2 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
                >
                  Tutup
                </button>
                <a
                  href={bill.payment.paymentProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white border-2 border-neutral-700 px-4 py-2 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <Modal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
            <h3 className="text-xl font-bold">Alasan Penolakan</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Mohon berikan alasan mengapa pembayaran ini ditolak:
          </p>
          <textarea
            value={verificationNotes}
            onChange={(e) => setVerificationNotes(e.target.value)}
            className="w-full border-2 border-neutral-700 p-2 mb-4"
            rows={4}
            placeholder="Contoh: Bukti pembayaran tidak jelas, nominal tidak sesuai, dll."
          />
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowVerificationModal(false)}
              className="bg-gray-600 text-white border-2 border-neutral-700 px-4 py-2 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
            >
              Batal
            </button>
            <button
              onClick={() => verifyPaymentNow("REJECTED")}
              disabled={!verificationNotes || isVerifying}
              className="bg-red-600 text-white border-2 border-neutral-700 px-4 py-2 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Memproses..." : "Konfirmasi Penolakan"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
