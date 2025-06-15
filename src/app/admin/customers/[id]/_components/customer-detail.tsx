"use client";

import React, { useState } from "react";
import { ArrowLeft, CreditCard, FileText, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  formatCurrency,
  formatDate,
  getCustomerStatusColor,
  getCustomerStatusText,
} from "@/lib/utils";
import type { CustomerInfo as CustomerInfoType } from "../../_components/customer-list";
import { CustomerInfo } from "./customer-info";
import { CustomerBill } from "./customer-bill";
import { CustomerComplaint } from "./customer-complaint";
import { ActivatedButton } from "./activated-button";
import { handleCustomerStatus } from "@/actions/customer/index";
import { RestoreButton } from "./restore-button";

const tabs = [
  {
    id: "info",
    label: "Info Pelanggan",
    icon: <FileText className="w-4 h-4" strokeWidth={2.5} />,
  },
  {
    id: "bills",
    label: "Riwayat Tagihan",
    icon: <CreditCard className="w-4 h-4" strokeWidth={2.5} />,
  },
  {
    id: "complaints",
    label: "Keluhan",
    icon: <AlertTriangle className="w-4 h-4" strokeWidth={2.5} />,
  },
];

interface Props {
  customer: CustomerInfoType;
  monthlyRate?: number;
}

export const CustomerDetail = ({ customer, monthlyRate }: Props) => {
  const [activeTab, setActiveTab] = useState("info");
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const renderActionButton = () => {
    const status = customer.customerDetails?.status;

    if (status === "INACTIVE") {
      return (
        <form action={() => handleCustomerStatus("ACTIVE", customer.id)}>
          <ActivatedButton />
        </form>
      );
    }

    if (status === "SUSPENDED") {
      return (
        <form action={() => handleCustomerStatus("ACTIVE", customer.id)}>
          <RestoreButton />
        </form>
      );
    }

    return null;
  };

  return (
    <div>
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
            Detail Pelanggan
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-lg font-bold text-gray-700">
            {customer.customerDetails?.fullName ||
              "Nama Pelanggan Tidak Tersedia"}
          </p>
          {renderActionButton()}
        </div>
      </div>

      <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <div
            className={`px-4 py-2 font-bold border-4 ${getCustomerStatusColor(
              customer.customerDetails?.status || "ACTIVE"
            )}`}
          >
            {getCustomerStatusText(
              customer.customerDetails?.status || "ACTIVE"
            )}
          </div>
          <div className="text-lg font-bold">
            Berlangganan sejak:{" "}
            {customer.customerDetails?.subscriptionStartDate
              ? formatDate(
                  customer.customerDetails.subscriptionStartDate.toString()
                )
              : "-"}
          </div>
          <div className="text-lg font-bold text-green-600">
            Tarif:{" "}
            {customer.customerDetails?.subscriptionStartDate
              ? `${formatCurrency(monthlyRate || 0)}/bulan`
              : "-"}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-bold border-4 border-neutral-700 flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all ${
                activeTab === tab.id
                  ? "bg-red-600 text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-6">
          {activeTab === "info" && <CustomerInfo customer={customer} />}
          {activeTab === "bills" && <CustomerBill customer={customer} />}
          {activeTab === "complaints" && (
            <CustomerComplaint customer={customer} />
          )}
        </div>
      </div>
    </div>
  );
};
