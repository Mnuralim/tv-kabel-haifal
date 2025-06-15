import {
  formatDate,
  getInstalationStatusIcon,
  getInstallationRequestStatusColor,
  getInstallationRequestStatusText,
} from "@/lib/utils";
import {
  Calendar,
  CheckCircle,
  Clock,
  Home,
  MessageSquare,
  XCircle,
} from "lucide-react";
import type { InstallationRequestInfo } from "../../_components/installation-request-list";

export const InstallationInformation = ({
  request,
}: {
  request: InstallationRequestInfo;
}) => {
  return (
    <div className="bg-white border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Informasi Permintaan Instalasi
        </h2>
        <div className="flex items-center gap-2">
          {getInstalationStatusIcon(request.status)}
          <span
            className={`px-3 py-1 text-sm font-semibold border-2 ${getInstallationRequestStatusColor(
              request.status
            )}`}
          >
            {getInstallationRequestStatusText(request.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">
              ID Permintaan
            </label>
            <p className="text-lg font-mono">{request.id}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Tanggal Permintaan
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <p className="text-lg">
                {formatDate(request.createdAt.toString())}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Home className="w-4 h-4 text-gray-500 mt-1" />
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Alamat Instalasi
              </label>
              <p className="text-base">{request.installationAddress}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {request.scheduledDate && (
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Tanggal Terjadwal
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <p className="text-lg">
                  {formatDate(request.scheduledDate.toString())}
                </p>
              </div>
            </div>
          )}

          {request.approvedDate && (
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Tanggal Disetujui
              </label>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <p className="text-lg">
                  {formatDate(request.approvedDate.toString())}
                </p>
              </div>
            </div>
          )}

          {request.completionDate && (
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Tanggal Selesai
              </label>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <p className="text-lg">
                  {formatDate(request.completionDate.toString())}
                </p>
              </div>
            </div>
          )}

          {request.admin && (
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Admin Yang Menangani
              </label>
              <p className="text-lg">{request.admin.adminName}</p>
            </div>
          )}
        </div>
      </div>

      {request.notes && (
        <div className="mt-6 p-4 bg-gray-50 border-2 border-gray-200">
          <div className="flex items-start gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-gray-500 mt-1" />
            <label className="text-sm font-semibold text-gray-600">
              Catatan Pelanggan
            </label>
          </div>
          <p className="text-base">{request.notes}</p>
        </div>
      )}

      {request.status === "PENDING" && (
        <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Menunggu Persetujuan Admin</span>
          </div>
          <p className="text-yellow-700 mt-1">
            Permintaan instalasi ini masih menunggu persetujuan dari admin.
            Harap segera ditindaklanjuti.
          </p>
        </div>
      )}

      {request.status === "APPROVED" && (
        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200">
          <div className="flex items-center gap-2 text-blue-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Permintaan Telah Disetujui</span>
          </div>
          <p className="text-blue-700 mt-1">
            Permintaan instalasi telah disetujui dan sudah dijadwalkan.
            Pelanggan akan mendapat notifikasi.
          </p>
        </div>
      )}

      {request.status === "REJECTED" && (
        <div className="mt-6 p-4 bg-red-50 border-2 border-red-200">
          <div className="flex items-center gap-2 text-red-800">
            <XCircle className="w-5 h-5" />
            <span className="font-semibold">Permintaan Ditolak</span>
          </div>
          <p className="text-red-700 mt-1">
            Permintaan instalasi telah ditolak. Pelanggan akan mendapat
            notifikasi.
          </p>
        </div>
      )}
    </div>
  );
};
