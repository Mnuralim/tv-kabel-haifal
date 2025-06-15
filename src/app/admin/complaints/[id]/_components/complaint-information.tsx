import {
  formatDate,
  getComplaintStatusIcon,
  getComplaintStatusColor,
  getComplaintStatusText,
  getComplaintCategoryText,
} from "@/lib/utils";
import {
  Calendar,
  FileText,
  Tag,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import type { ComplainInfo } from "../../_components/complaints-list";
import { useState } from "react";
import { Modal } from "@/app/admin/_components/modal";
import Image from "next/image";

export const ComplaintInformation = ({
  complaint,
}: {
  complaint: ComplainInfo;
}) => {
  const [showImage, setShowImage] = useState<boolean>(false);
  return (
    <div className="bg-white border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Informasi Keluhan</h2>
        <div className="flex items-center gap-2">
          {getComplaintStatusIcon(complaint.complaintStatus)}
          <span
            className={`px-3 py-1 text-sm font-semibold border-2 ${getComplaintStatusColor(
              complaint.complaintStatus
            )}`}
          >
            {getComplaintStatusText(complaint.complaintStatus)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">
              ID Keluhan
            </label>
            <p className="text-lg font-mono">{complaint.id}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Tanggal Keluhan
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <p className="text-lg">
                {formatDate(complaint.createdAt.toString())}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Tag className="w-4 h-4 text-gray-500 mt-1" />
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Kategori Keluhan
              </label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-base font-medium">
                  {getComplaintCategoryText(complaint.category)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-gray-500 mt-1" />
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Judul Keluhan
              </label>
              <p className="text-lg font-medium">{complaint.title}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {complaint.completionDate && (
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Tanggal Selesai
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-500" />
                <p className="text-lg">
                  {formatDate(complaint.completionDate.toString())}
                </p>
              </div>
            </div>
          )}

          {complaint.image && (
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Bukti Foto
              </label>
              <div className="mt-2 border-2 border-neutral-700 p-2 bg-gray-50">
                <button
                  onClick={() => setShowImage(true)}
                  className="flex items-center gap-2 text-blue-600"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm">Lihat foto keluhan</span>
                </button>
              </div>
            </div>
          )}

          <div className="p-4 bg-yellow-50 border-2 border-yellow-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  Prioritas Penanganan
                </p>
                <p className="text-sm text-yellow-700">
                  {complaint.category === "VIDEO_ISSUE" ||
                  complaint.category === "AUDIO_ISSUE"
                    ? "Tinggi - Gangguan Layanan"
                    : complaint.category === "BILLING_ISSUE"
                    ? "Sedang - Masalah Pembayaran"
                    : "Normal - Keluhan Umum"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 border-2 border-gray-200">
        <div className="flex items-start gap-2 mb-2">
          <FileText className="w-4 h-4 text-gray-500 mt-1" />
          <label className="text-sm font-semibold text-gray-600">
            Deskripsi Keluhan
          </label>
        </div>
        <p className="text-base leading-relaxed">{complaint.description}</p>
      </div>

      {complaint.complaintStatus === "OPEN" && (
        <div className="mt-6 p-4 bg-red-50 border-2 border-red-200">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Keluhan Baru</span>
          </div>
          <p className="text-red-700 mt-1">
            Keluhan ini belum ditangani. Harap segera direspon untuk memberikan
            pelayanan terbaik kepada pelanggan.
          </p>
        </div>
      )}

      {complaint.complaintStatus === "IN_PROGRESS" && (
        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200">
          <div className="flex items-center gap-2 text-blue-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Sedang Ditangani</span>
          </div>
          <p className="text-blue-700 mt-1">
            Keluhan sedang dalam proses penanganan. Pastikan untuk memberikan
            update kepada pelanggan.
          </p>
        </div>
      )}

      {complaint.complaintStatus === "RESOLVED" && (
        <div className="mt-6 p-4 bg-green-50 border-2 border-green-200">
          <div className="flex items-center gap-2 text-green-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Keluhan Selesai</span>
          </div>
          <p className="text-green-700 mt-1">
            Keluhan telah diselesaikan. Pelanggan telah mendapat solusi.
          </p>
        </div>
      )}
      <Modal isOpen={showImage} onClose={() => setShowImage(false)}>
        {complaint.image && (
          <div className="h-full flex items-center justify-center">
            <Image
              src={complaint.image}
              alt="complaint image"
              width={500}
              height={500}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
