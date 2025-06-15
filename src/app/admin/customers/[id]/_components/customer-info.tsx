import { formatDate } from "@/lib/utils";
import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import React from "react";
import type { CustomerInfo as CustomerInfoType } from "../../_components/customer-list";

interface Props {
  customer: CustomerInfoType;
}

export const CustomerInfo = ({ customer }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-xl font-black border-b-4 border-red-500 pb-2 mb-4">
          Informasi Personal
        </h3>

        <div className="flex items-start gap-3">
          <MapPin
            className="w-5 h-5 text-red-600 mt-1 flex-shrink-0"
            strokeWidth={2.5}
          />
          <div>
            <p className="font-bold text-gray-700">Alamat:</p>
            <p className="text-gray-900">
              {customer.customerDetails?.address || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-red-600" strokeWidth={2.5} />
          <div>
            <p className="font-bold text-gray-700">Nomor HP:</p>
            <p className="text-gray-900">
              {customer.customerDetails?.phoneNumber || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-red-600" strokeWidth={2.5} />
          <div>
            <p className="font-bold text-gray-700">Email:</p>
            <p className="text-gray-900">
              {customer.customerDetails?.email || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-red-600" strokeWidth={2.5} />
          <div>
            <p className="font-bold text-gray-700">Tanggal Lahir:</p>
            <p className="text-gray-900">
              {formatDate(customer.customerDetails?.birthDate.toString() || "")}{" "}
              ({customer.customerDetails?.birthPlace || "Tidak Diketahui"})
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-black border-b-4 border-red-500 pb-2 mb-4">
          Dokumen & ID
        </h3>

        <div>
          <p className="font-bold text-gray-700">Nomor KTP:</p>
          <p className="text-gray-900 font-mono">
            {customer.customerDetails?.idCardNumber || "-"}
          </p>
        </div>

        <div>
          <p className="font-bold text-gray-700">Nomor KK:</p>
          <p className="text-gray-900 font-mono">
            {customer.customerDetails?.familyCardNumber || "-"}
          </p>
        </div>

        <div>
          <p className="font-bold text-gray-700">Username:</p>
          <p className="text-gray-900 font-mono">{customer.username}</p>
        </div>

        <div>
          <p className="font-bold text-gray-700">Tanggal Registrasi:</p>
          <p className="text-gray-900">
            {customer.customerDetails?.registrationDate
              ? formatDate(customer.customerDetails.registrationDate.toString())
              : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};
