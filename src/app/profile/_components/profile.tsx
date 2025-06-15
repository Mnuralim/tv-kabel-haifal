"use client";

import React from "react";
import { Edit3, User, Calendar, Clock, CreditCard } from "lucide-react";
import type { Prisma } from "@prisma/client";
import {
  formatDate,
  getCustomerStatusColor,
  getCustomerStatusText,
} from "@/lib/utils";
import { PasswordTab } from "./password-tab";
import { CustomerInformationTab } from "./customer-information-tab";
import { useRouter } from "next/navigation";

export type UserCustomer = Prisma.UserGetPayload<{
  select: {
    username: true;
    id: true;
    role: true;
    lastLogin: true;
    createdAt: true;
    customerDetails: true;
  };
}>;

interface Props {
  customer: UserCustomer;
  currentTab?: "info" | "password";
}

export const CustomerProfile = ({ customer, currentTab }: Props) => {
  const router = useRouter();

  const changeTab = (tab: "info" | "password") => {
    if (tab === "info") {
      router.replace(`/profile`, {
        scroll: false,
      });
    } else {
      router.replace(`/profile?tab=password`, {
        scroll: false,
      });
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Profile Saya 👤
        </h1>
        <p className="text-gray-600 font-medium">
          Informasi lengkap tentang akun Anda
        </p>
      </div>

      <div className="mb-8">
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => changeTab("info")}
            className={`group px-6 py-3 font-black text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center ${
              currentTab !== "password"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <Edit3 className="w-5 h-5 mr-2" />
            Edit Profil
          </button>
          <button
            onClick={() => changeTab("password")}
            className={`group px-6 py-3 font-black text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center ${
              currentTab === "password"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Ubah Password
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {currentTab === "password" ? (
            <PasswordTab customerId={customer.id} />
          ) : (
            <CustomerInformationTab customer={customer} />
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-4">
              <div
                className={`w-10 h-10 ${getCustomerStatusColor(
                  customer.customerDetails?.status || "ACTIVE"
                )} border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-3`}
              >
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-gray-900">Status</h3>
            </div>
            <div className="text-2xl font-black text-blue-600">
              {getCustomerStatusText(
                customer.customerDetails?.status || "ACTIVE"
              )}
            </div>
          </div>

          <div className="bg-green-50 p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-3">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-gray-900">Bergabung</h3>
            </div>
            <div className="text-lg font-bold text-green-600">
              {customer.customerDetails?.registrationDate
                ? formatDate(
                    customer.customerDetails.registrationDate.toString()
                  )
                : formatDate(customer.createdAt.toString())}
            </div>
          </div>

          <div className="bg-purple-50 p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-3">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-gray-900">Langganan</h3>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1">
                  MULAI LANGGANAN
                </div>
                <div className="text-sm font-medium">
                  {customer.customerDetails?.subscriptionStartDate
                    ? formatDate(
                        customer.customerDetails.subscriptionStartDate.toString()
                      )
                    : "Belum Aktif"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-indigo-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-gray-900">Info Sistem</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1">
                  LOGIN TERAKHIR
                </div>
                <div className="text-sm font-medium">
                  {customer.lastLogin
                    ? formatDate(customer.lastLogin?.toString())
                    : "-"}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1">
                  DIBUAT
                </div>
                <div className="text-sm font-medium">
                  {formatDate(customer.createdAt.toString())}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-xs font-bold text-gray-400 mb-1">
              CUSTOMER ID
            </div>
            <div className="text-xs font-mono break-all">
              {customer.customerDetails?.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
