"use client";

import React, { useState } from "react";
import {
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Download,
} from "lucide-react";
import type { BillInfo } from "@/app/admin/bills/_components/bill-list";
import {
  formatCurrency,
  formatDate,
  getMonthName,
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from "@/lib/utils";
import { FilterControll } from "./filter-controll";
import { Modal } from "@/app/admin/_components/modal";
import { PaymentForm } from "./payment-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  bills: BillInfo[];
  modal?: "add";
}

export const Bills = ({ bills, modal }: Props) => {
  const [selectedBill, setSelectedBill] = useState<BillInfo | null>(null);
  const router = useRouter();

  const isModalOpen = modal === "add";

  const handleClose = () => {
    setSelectedBill(null);
    router.push("/bills", {
      scroll: false,
    });
  };

  const handleOpen = (billId: BillInfo) => {
    setSelectedBill(billId);
    router.push("/bills?modal=add", {
      scroll: false,
    });
  };

  const summary = {
    totalUnpaid: bills
      .filter((bill) => bill.paymentStatus !== "PAID")
      .reduce((sum, bill) => sum + bill.amount, 0),
    totalPending: bills
      .filter((bill) => bill.paymentStatus === "IN_REVIEW")
      .reduce((sum, bill) => sum + bill.amount, 0),
    unpaidCount: bills.filter((bill) => bill.paymentStatus !== "PAID").length,
    pendingCount: bills.filter((bill) => bill.paymentStatus === "IN_REVIEW")
      .length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Tagihan Saya 💳
        </h1>
        <p className="text-gray-600 font-medium">
          Kelola dan pantau semua tagihan bulanan Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6  border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="font-bold text-gray-900">Total Belum Bayar</h3>
          </div>
          <p className="text-2xl font-black text-red-600">
            {formatCurrency(summary.totalUnpaid)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {summary.unpaidCount} tagihan
          </p>
        </div>

        <div className="bg-white p-6  border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-800" />
            <h3 className="font-bold text-gray-900">Tagihan Diproses</h3>
          </div>
          <p className="text-2xl font-black text-yellow-800">
            {formatCurrency(summary.totalPending)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {summary.pendingCount} tagihan
          </p>
        </div>

        <div className="bg-white p-6  border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-gray-900">Tahun Ini</h3>
          </div>
          <p className="text-2xl font-black text-green-600">
            {
              bills.filter(
                (bill) =>
                  bill.year === new Date().getFullYear() &&
                  bill.paymentStatus === "PAID"
              ).length
            }
          </p>
          <p className="text-sm text-gray-600 mt-1">tagihan lunas</p>
        </div>

        <div className="bg-white p-6  border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-gray-900">Total Tagihan</h3>
          </div>
          <p className="text-2xl font-black text-blue-600">{bills.length}</p>
          <p className="text-sm text-gray-600 mt-1">dari filter aktif</p>
        </div>
      </div>

      <FilterControll />
      <div className="bg-white  border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="p-6 border-b-2 border-black">
          <h2 className="text-xl font-black text-gray-900">Daftar Tagihan</h2>
        </div>

        {bills.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-600 mb-2">
              Tidak ada tagihan ditemukan
            </h3>
            <p className="text-gray-500">
              Coba ubah filter atau kata kunci pencarian
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-black">
                <tr>
                  <th className="px-6 py-4 text-left font-black text-gray-900">
                    Periode
                  </th>
                  <th className="px-6 py-4 text-left font-black text-gray-900">
                    Jumlah Tagihan
                  </th>
                  <th className="px-6 py-4 text-left font-black text-gray-900">
                    Jatuh Tempo
                  </th>
                  <th className="px-6 py-4 text-left font-black text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-black text-gray-900">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, index) => (
                  <tr
                    key={bill.id}
                    className={`border-b-2 border-gray-100 hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {getMonthName(bill.month)} {bill.year}
                      </div>
                      <div className="text-sm text-gray-600">
                        Dibuat: {formatDate(bill.createdAt.toString())}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatCurrency(bill.amount)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {formatDate(bill.dueDate.toString())}
                      </div>
                      {new Date(bill.dueDate) < new Date() &&
                        bill.paymentStatus !== "PAID" && (
                          <div className="text-xs text-red-600 font-bold">
                            LEWAT TEMPO
                          </div>
                        )}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-bold border-2 ${getStatusColor(
                          bill.paymentStatus
                        )}`}
                      >
                        {getStatusIcon(bill.paymentStatus)}
                        {getStatusText(bill.paymentStatus)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/bills/${bill.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 border-2 border-transparent hover:border-black  transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {bill.paymentStatus === "PAID" && bill.receipt && (
                          <Link
                            href={bill.receipt}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="p-2 text-green-600 hover:bg-green-50 border-2 border-transparent hover:border-black  transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          >
                            <Download className="w-4 h-4" />
                          </Link>
                        )}
                        {bill.paymentStatus !== "PAID" && (
                          <button
                            disabled={bill.paymentStatus === "IN_REVIEW"}
                            onClick={() => handleOpen(bill)}
                            className="px-3 py-1 bg-red-600 text-white text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:translate-x-0 disabled:hover:shadow-none"
                          >
                            BAYAR
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen && selectedBill !== null}
        onClose={handleClose}
      >
        {selectedBill && (
          <PaymentForm bill={selectedBill} onClose={handleClose} />
        )}
      </Modal>
    </div>
  );
};
