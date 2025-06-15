"use client";

import {
  Bell,
  BellRing,
  Check,
  Clock,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import { FilterControll } from "./filter-controll";
import type { CustomerNotification } from "@prisma/client";
import {
  formatDate,
  formatTimeAgo,
  getCustomerNotificationTypeBgColor,
  getCustomerNotificationTypeColor,
  getCustomerNotificationTypeIcon,
} from "@/lib/utils";
import { markAllAsRead, markAsRead } from "@/actions/customer-notification";
import { MarkAllAsReadButton } from "./mark-all-as-read-button";
import { MarkAsReadButton } from "./mark-as-read-button";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  notifications: CustomerNotification[];
  currentLimit: number;
  hideRead?: "true";
}

export const CustomerNotifications = ({
  notifications,
  currentLimit,
  hideRead,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleShowMore = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("limit", (currentLimit + 10).toString());
    router.push(`/notifications?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleHideRead = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (hideRead === "true") {
      params.delete("hideRead");
    } else {
      params.set("hideRead", "true");
    }
    router.push(`/notifications?${params.toString()}`, {
      scroll: false,
    });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Notifikasi Pelanggan 🔔
        </h1>
        <p className="text-gray-600 font-medium">
          Kelola dan pantau semua notifikasi anda
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-blue-50 p-3 sm:p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-2 sm:mr-3">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-blue-600">
                {notifications.length}
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-700">
                Total
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-3 sm:p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-2 sm:mr-3">
              <BellRing className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-red-600">
                {unreadCount}
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-700">
                Belum Dibaca
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <form action={markAllAsRead} className="h-full flex">
            <MarkAllAsReadButton />
          </form>
          <button
            onClick={handleHideRead}
            className={`flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-3 font-black text-sm sm:text-base border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center ${
              hideRead !== "true"
                ? "bg-gray-500 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            {hideRead !== "true" ? (
              <EyeOff className="w-4 h-4 mr-1 sm:mr-2" />
            ) : (
              <Eye className="w-4 h-4 mr-1 sm:mr-2" />
            )}
            <span className="hidden sm:inline">
              {hideRead !== "true" ? "Sembunyikan Dibaca" : "Tampilkan Dibaca"}
            </span>
            <span className="sm:hidden">
              {hideRead !== "true" ? "Sembunyikan" : "Tampilkan"}
            </span>
          </button>
        </div>
      </div>
      <FilterControll />
      <div className="space-y-3 sm:space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-gray-50 p-6 sm:p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
            <Bell className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">
              Tidak Ada Notifikasi
            </h3>
            <p className="text-gray-600 font-medium text-sm sm:text-base">
              Tidak ada notifikasi yang sesuai dengan filter Anda.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 sm:p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
                notification.isRead
                  ? "bg-white"
                  : getCustomerNotificationTypeBgColor(notification.type)
              } ${!notification.isRead ? "ring-4 ring-yellow-300" : ""}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start flex-1">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 ${getCustomerNotificationTypeColor(
                      notification.type
                    )} border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-3 sm:mr-4 flex-shrink-0`}
                  >
                    {getCustomerNotificationTypeIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center mb-2 gap-2">
                      <h3 className="text-base sm:text-lg font-black text-gray-900">
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-bold border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                            notification.type === "BILL_DUE"
                              ? "bg-red-100 text-red-800"
                              : notification.type === "PAYMENT_CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : notification.type === "COMPLAINT_UPDATE"
                              ? "bg-orange-100 text-orange-800"
                              : notification.type === "INSTALLATION_SCHEDULED"
                              ? "bg-blue-100 text-blue-800"
                              : notification.type === "SERVICE_ANNOUNCEMENT"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {notification.type === "BILL_DUE"
                            ? "TAGIHAN"
                            : notification.type === "PAYMENT_CONFIRMED"
                            ? "PEMBAYARAN"
                            : notification.type === "COMPLAINT_UPDATE"
                            ? "KELUHAN"
                            : notification.type === "INSTALLATION_SCHEDULED"
                            ? "INSTALASI"
                            : notification.type === "SERVICE_ANNOUNCEMENT"
                            ? "PENGUMUMAN"
                            : notification.type}
                        </span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 border border-black rounded-full shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 font-medium mb-3 text-sm sm:text-base break-words">
                      {notification.message}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(notification.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(notification.createdAt.toString(), true)}
                      </div>
                    </div>

                    {notification.isRead && notification.readAt && (
                      <div className="text-xs text-gray-500 mt-2 flex items-center">
                        <Check className="w-3 h-3 mr-1" />
                        Dibaca pada{" "}
                        {formatDate(notification.readAt.toString(), true)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end sm:justify-start space-x-2 sm:ml-4">
                  <form
                    action={() => {
                      if (!notification.isRead) {
                        markAsRead(notification.id);
                      }
                      if (notification.redirectTo) {
                        router.push(`${notification.redirectTo}`);
                      }
                    }}
                  >
                    <MarkAsReadButton />
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="mt-6 sm:mt-8 text-center">
          <button
            onClick={handleShowMore}
            className="w-full sm:w-auto px-6 py-3 bg-black text-white font-black text-base sm:text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Muat Lebih Banyak
          </button>
        </div>
      )}
    </div>
  );
};
