"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Users,
  Clock,
  FileText,
  Settings,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CableBillingStats {
  totalRevenue: number;
  revenueChangePercentage: string | number;
  totalBills: number;
  paidBills: number;
  collectionRate: string | number;
  overdueBills: number;
  billsInReview: number;
  activeCustomers: number;
  todayPaymentCount: number;
}

interface MonthlyPayment {
  month: string;
  payments: number;
  revenue: number;
}

interface BillingStatus {
  status: string;
  count: number;
}

interface MonthlyStats {
  billingStatus: BillingStatus[];
  openComplaints: number;
  pendingInstallations: number;
}

interface Props {
  stats: CableBillingStats;
  monthlyPayments: MonthlyPayment[];
  monthlyStats: MonthlyStats;
}

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6b7280"];

export const CableBillingDashboard = ({
  stats,
  monthlyPayments,
  monthlyStats,
}: Props) => {
  const billingStatusData = monthlyStats.billingStatus.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
    label:
      item.status === "PAID"
        ? "Lunas"
        : item.status === "UNPAID"
        ? "Belum Bayar"
        : item.status === "IN_REVIEW"
        ? "Dalam Review"
        : "Ditolak",
  }));

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black border-b-8 border-red-500 pb-2 text-neutral-800">
          Dashboard Tagihan TV Kabel
        </h1>
        <div className="mt-4 md:mt-0 text-sm text-neutral-600 font-semibold">
          Bulan:{" "}
          {new Date().toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border-4 border-neutral-700 p-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-neutral-500 font-bold">
                Total Pendapatan
              </p>
              <h3 className="text-2xl font-black mt-2">
                {formatCurrency(stats.totalRevenue)}
              </h3>
              <p
                className={`font-bold text-sm mt-2 flex items-center ${
                  parseFloat(stats.revenueChangePercentage.toString()) >= 0
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                <ArrowUpRight size={14} className="mr-1" />
                {stats.revenueChangePercentage}% dari bulan lalu
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-none flex items-center justify-center border-2 border-neutral-700">
              <DollarSign size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-4 border-neutral-700 p-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-neutral-500 font-bold">
                Tingkat Penagihan
              </p>
              <h3 className="text-2xl font-black mt-2">
                {stats.collectionRate}%
              </h3>
              <p className="text-neutral-600 font-bold text-sm mt-2">
                {stats.paidBills} dari {stats.totalBills} tagihan
              </p>
            </div>
            <div className="h-12 w-12 bg-emerald-100 rounded-none flex items-center justify-center border-2 border-neutral-700">
              <TrendingUp size={24} className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-4 border-neutral-700 p-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-neutral-500 font-bold">
                Pelanggan Aktif
              </p>
              <h3 className="text-2xl font-black mt-2">
                {stats.activeCustomers}
              </h3>
              <p className="text-blue-500 font-bold text-sm mt-2 flex items-center">
                <Users size={14} className="mr-1" />
                Total pelanggan aktif
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-none flex items-center justify-center border-2 border-neutral-700">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-4 border-neutral-700 p-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-neutral-500 font-bold">
                Tagihan Terlambat
              </p>
              <h3 className="text-2xl font-black mt-2">{stats.overdueBills}</h3>
              <p className="text-red-500 font-bold text-sm mt-2 flex items-center">
                <AlertTriangle size={14} className="mr-1" />
                Perlu tindak lanjut
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-none flex items-center justify-center border-2 border-neutral-700">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border-4 border-neutral-700 p-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-neutral-500 font-bold">
                Pembayaran Review
              </p>
              <h3 className="text-2xl font-black mt-2">
                {stats.billsInReview}
              </h3>
              <p className="text-yellow-500 font-bold text-sm mt-2 flex items-center">
                <Clock size={14} className="mr-1" />
                Menunggu verifikasi
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-none flex items-center justify-center border-2 border-neutral-700">
              <FileText size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-4 border-neutral-700 p-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-neutral-500 font-bold">
                Komplain Terbuka
              </p>
              <h3 className="text-2xl font-black mt-2">
                {monthlyStats.openComplaints}
              </h3>
              <p className="text-orange-500 font-bold text-sm mt-2 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                Perlu penanganan
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-none flex items-center justify-center border-2 border-neutral-700">
              <AlertCircle size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-4 border-neutral-700 p-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-neutral-500 font-bold">
                Instalasi Pending
              </p>
              <h3 className="text-2xl font-black mt-2">
                {monthlyStats.pendingInstallations}
              </h3>
              <p className="text-purple-500 font-bold text-sm mt-2 flex items-center">
                <Settings size={14} className="mr-1" />
                Menunggu jadwal
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-none flex items-center justify-center border-2 border-neutral-700">
              <Settings size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white border-4 border-neutral-700 p-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
          <h3 className="text-xl font-black mb-4 border-b-4 border-blue-500 pb-2 inline-block">
            Pendapatan Bulanan
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPayments}>
                <XAxis dataKey="month" stroke="#374151" fontWeight="bold" />
                <YAxis stroke="#374151" fontWeight="bold" />
                <Tooltip
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    "Pendapatan",
                  ]}
                  contentStyle={{
                    borderRadius: 0,
                    border: "2px solid #1f2937",
                    fontWeight: "bold",
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#3b82f6"
                  stroke="#1f2937"
                  strokeWidth={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border-4 border-neutral-700 p-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
          <h3 className="text-xl font-black mb-4 border-b-4 border-emerald-500 pb-2 inline-block">
            Status Tagihan
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={billingStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  stroke="#1f2937"
                  strokeWidth={2}
                >
                  {billingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} tagihan`,
                    props.payload.label,
                  ]}
                  contentStyle={{
                    borderRadius: 0,
                    border: "2px solid #1f2937",
                    fontWeight: "bold",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {billingStatusData.map((item, index) => (
              <div key={index} className="flex items-center text-sm font-bold">
                <div
                  className="w-3 h-3 mr-2 border border-neutral-700"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span>
                  {item.label}: {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
