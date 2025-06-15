import { formatDate } from "@/lib/utils";
import type { CustomerDetail } from "@prisma/client";
import { Mail, MapPin, Phone, User } from "lucide-react";

interface Props {
  customer: CustomerDetail;
}

export const CustomerInformation = ({ customer }: Props) => {
  return (
    <div className="bg-white border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Informasi Pelanggan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-gray-500 mt-1" />
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Nama Lengkap
              </label>
              <p className="text-lg">{customer.fullName}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-500 mt-1" />
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Alamat Terdaftar
              </label>
              <p className="text-base">{customer.address}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Phone className="w-4 h-4 text-gray-500 mt-1" />
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Nomor Telepon
              </label>
              <p className="text-lg">{customer.phoneNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Mail className="w-4 h-4 text-gray-500 mt-1" />
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Email
              </label>
              <p className="text-lg">{customer.email}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">NIK</label>
            <p className="text-lg font-mono">{customer.idCardNumber}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Nomor KK
            </label>
            <p className="text-lg font-mono">{customer.familyCardNumber}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Tempat, Tanggal Lahir
            </label>
            <p className="text-lg">
              {customer.birthPlace}, {formatDate(customer.birthDate.toString())}
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Status Pelanggan
            </label>
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold border-2 ml-2 ${
                customer.status === "ACTIVE"
                  ? "bg-green-100 text-green-800 border-green-300"
                  : customer.status === "INACTIVE"
                  ? "bg-gray-100 text-gray-800 border-gray-300"
                  : "bg-red-100 text-red-800 border-red-300"
              }`}
            >
              {customer.status === "ACTIVE"
                ? "AKTIF"
                : customer.status === "INACTIVE"
                ? "TIDAK AKTIF"
                : "DITANGGUHKAN"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
