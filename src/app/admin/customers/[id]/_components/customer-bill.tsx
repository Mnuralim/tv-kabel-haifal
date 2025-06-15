import React from "react";
import type { CustomerInfo } from "../../_components/customer-list";
import {
  formatCurrency,
  formatDate,
  getMonthName,
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from "@/lib/utils";

interface Props {
  customer: CustomerInfo;
}

export const CustomerBill = ({ customer }: Props) => {
  return (
    <div>
      <h3 className="text-xl font-black border-b-4 border-red-500 pb-2 mb-6">
        Riwayat Tagihan
      </h3>
      <div className="space-y-4">
        {customer.customerDetails?.bills.length === 0 && (
          <p className="text-gray-600 text-center">
            Tidak ada tagihan yang tercatat.
          </p>
        )}
        {customer.customerDetails?.bills.map((bill) => (
          <div
            key={bill.id}
            className="bg-white border-4 border-neutral-700 p-4 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h4 className="font-bold text-lg">
                  Tagihan {getMonthName(bill.month)} {bill.year}
                </h4>
                <p className="text-gray-600">
                  Jatuh tempo: {formatDate(bill.dueDate.toString() || "")}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-lg font-bold">
                    {formatCurrency(bill.amount)}
                  </span>
                </div>
              </div>
              <div
                className={`px-4 py-2 font-bold border-4 flex items-center gap-2 ${getStatusColor(
                  bill.paymentStatus
                )}`}
              >
                {getStatusIcon(bill.paymentStatus)}
                {getStatusText(bill.paymentStatus)}
              </div>
            </div>
            {bill.verifiedAt && (
              <p className="text-sm text-gray-600 mt-2">
                Diverifikasi: {formatDate(bill.verifiedAt.toString() || "")}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
