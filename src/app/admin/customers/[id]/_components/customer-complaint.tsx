import React from "react";
import type { CustomerInfo } from "../../_components/customer-list";
import {
  formatDate,
  getComplaintCategoryText,
  getComplaintStatusColor,
  getComplaintStatusText,
} from "@/lib/utils";

interface Props {
  customer: CustomerInfo;
}
export const CustomerComplaint = ({ customer }: Props) => {
  return (
    <div>
      <h3 className="text-xl font-black border-b-4 border-red-500 pb-2 mb-6">
        Riwayat Keluhan
      </h3>
      <div className="space-y-4">
        {customer.customerDetails?.complaints.length === 0 && (
          <p className="text-gray-600 text-center">
            Tidak ada keluhan yang tercatat.
          </p>
        )}
        {customer.customerDetails?.complaints.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-white border-4 border-neutral-700 p-4 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-200 border-2 border-neutral-700 px-3 py-1 text-sm font-bold">
                    {getComplaintCategoryText(complaint.category)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(complaint.createdAt.toString())}
                  </span>
                </div>
                <h4 className="font-bold text-lg">{complaint.title}</h4>
              </div>
              <div
                className={`px-4 py-2 font-bold border-4 ${getComplaintStatusColor(
                  complaint.complaintStatus
                )}`}
              >
                {getComplaintStatusText(complaint.complaintStatus)}
              </div>
            </div>
            <p className="text-gray-700 mb-2">{complaint.description}</p>
            {complaint.completionDate && (
              <p className="text-sm text-green-600 font-bold">
                Diselesaikan: {formatDate(complaint.completionDate.toString())}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
