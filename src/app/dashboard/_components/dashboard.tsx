"use client";
import React from "react";
import {
  CreditCard,
  MessageSquare,
  Tv,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";
import {
  formatCurrency,
  formatDate,
  getComplaintStatusColor,
  getComplaintStatusText,
} from "@/lib/utils";
import type { CompanySettings, Prisma } from "@prisma/client";
import type { BillInfo } from "@/app/admin/bills/_components/bill-list";
import Link from "next/link";
import { getStatusText as getBillStatusText } from "@/lib/utils";

type CustomerInfo = Prisma.UserGetPayload<{
  select: {
    username: true;
    id: true;
    customerDetails: {
      select: {
        status: true;
        subscriptionStartDate: true;
        address: true;
        id: true;
        fullName: true;
        complaints: {
          take: 2;
        };
      };
    };
  };
}>;

interface Props {
  customer: CustomerInfo;
  bill?: BillInfo;
  setting: CompanySettings;
  pendingBillAmount?: number;
  totalPendingBill?: number;
}

export const Dashboard = ({
  customer,
  bill,
  pendingBillAmount,
  totalPendingBill,
  setting,
}: Props) => {
  const today = new Date();
  const thisMonth = today.getMonth() + 1;
  const thisYear = today.getFullYear();

  return (
    <div className="min-h-screen">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Selamat Datang, {customer.customerDetails?.fullName}! 👋
          </h1>
          <p className="text-gray-600 font-medium">
            Kelola langganan TV kabel Anda dengan mudah
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <Tv className="w-8 h-8 text-red-600" />
              <span
                className={`px-3 py-1 text-sm font-bold border-2 ${
                  customer.customerDetails?.subscriptionStartDate
                    ? "border-green-600"
                    : "border-red-600"
                }`}
              >
                {customer.customerDetails?.subscriptionStartDate
                  ? "AKTIF"
                  : "NON-AKTIF"}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Status Langganan
            </h3>
            <p className="text-sm text-gray-600">
              Aktif sejak{" "}
              {customer.customerDetails?.subscriptionStartDate
                ? formatDate(
                    customer.customerDetails?.subscriptionStartDate.toString()
                  )
                : "-"}
            </p>
          </div>

          <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-yellow-600" />
              <div className="text-2xl font-black text-gray-900">
                {customer.customerDetails?.subscriptionStartDate
                  ? formatCurrency(setting.montyhlyRate)
                  : "-"}
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Paket Bulanan
            </h3>
            <p className="text-sm text-gray-600">Paket Bulanan Anda</p>
          </div>

          <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <div className="text-2xl font-black text-gray-900">
                {totalPendingBill || 0}
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Tagihan Pending
            </h3>
            <p className="text-sm text-gray-600">
              Total: {formatCurrency(pendingBillAmount || 0)}
            </p>
          </div>
          <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <MessageSquare className="w-8 h-8 text-purple-600" />
              <div className="text-2xl font-black text-gray-900">
                {customer.customerDetails?.complaints?.length || 0}
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Keluhan Aktif
            </h3>
            <p className="text-sm text-gray-600">Sedang diproses</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900">
                Tagihan Bulan Ini
              </h2>
              <Calendar className="w-6 h-6 text-gray-600" />
            </div>

            {bill && bill.month === thisMonth && bill.year === thisYear ? (
              <>
                <div className="bg-red-50 border-2 border-red-200 p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-bold text-red-800 mb-1">
                        Tagihan {bill.month}/{bill.year}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-red-700">Jumlah Tagihan:</span>
                          <span className="font-bold text-red-800">
                            {formatCurrency(bill.amount)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-700">Jatuh Tempo:</span>
                          <span className="font-bold text-red-800">
                            {formatDate(bill.dueDate.toString())}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-700">Status:</span>
                          <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-bold">
                            {getBillStatusText(bill.paymentStatus)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/bills/${bill.id}`}
                    className="flex-1 px-4 py-3 text-center bg-red-600 text-white font-bold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    Lihat Tagihan
                  </Link>
                </div>
              </>
            ) : (
              <div className="p-4 text-gray-600">
                <p className="text-sm">
                  Tidak ada tagihan untuk bulan ini. Silakan tunggu hingga
                  tagihan berikutnya diterbitkan.
                </p>
              </div>
            )}
          </div>
          <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900">
                Keluhan Terbaru
              </h2>
              <MessageSquare className="w-6 h-6 text-gray-600" />
            </div>

            <div className="space-y-4">
              {customer.customerDetails?.complaints
                .slice(0, 2)
                .map((complaint) => (
                  <div
                    key={complaint.id}
                    className="p-4 border-2 border-gray-200 hover:border-black transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-sm">
                        {complaint.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-bold border ${getComplaintStatusColor(
                          complaint.complaintStatus
                        )}`}
                      >
                        {getComplaintStatusText(complaint.complaintStatus)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      {formatDate(complaint.createdAt.toString())}
                    </div>
                  </div>
                ))}
            </div>

            <Link
              href={"/complaints?modal=add"}
              className="w-full block text-center mt-4 px-4 py-3 bg-purple-600 text-white font-bold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Buat Keluhan Baru
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-black text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href={"/bills"}
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-black transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-blue-800">
                Lihat Semua Tagihan
              </span>
            </Link>
            {bill?.id ? (
              <Link
                href={`/bills/${bill.id}`}
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-black transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-800">
                  Upload Pembayaran
                </span>
              </Link>
            ) : null}
            <Link
              href={"/complaints"}
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 hover:border-black transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <span className="font-bold text-purple-800">Kelola Keluhan</span>
            </Link>
            <Link
              href={"/dashboard#"}
              className="flex items-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 hover:border-black transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <Tv className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-yellow-800">Info Paket</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
