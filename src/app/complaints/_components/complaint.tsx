"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Plus,
} from "lucide-react";
import type { ComplainInfo } from "@/app/admin/complaints/_components/complaints-list";
import {
  formatDate,
  getComplaintCategoryText,
  getComplaintStatusColor,
  getComplaintStatusIcon,
  getComplaintStatusText,
} from "@/lib/utils";
import { Modal } from "@/app/admin/_components/modal";
import { useRouter } from "next/navigation";
import { FilterControll } from "./filter-controll";
import { ComplaintForm } from "./complaint-form";
import Image from "next/image";

interface Props {
  complaints: ComplainInfo[];
  modal?: "add" | "detail";
  customerId: string;
  currentSort?: string;
}

export const Complaint = ({
  complaints,
  modal,
  customerId,
  currentSort,
}: Props) => {
  const [selectedComplaint, setSelectedComplaint] =
    useState<ComplainInfo | null>(null);
  const router = useRouter();
  const showModal = modal === "add" || modal === "detail";

  const handleOpenAddModal = () => {
    router.push("/complaints?modal=add", {
      scroll: false,
    });
  };

  const handleOpenDetailModal = (complaint: ComplainInfo) => {
    router.push("/complaints?modal=detail", {
      scroll: false,
    });
    setSelectedComplaint(complaint);
  };

  const handleCloseModal = () => {
    router.back();
  };

  const summary = {
    totalOpen: complaints.filter((c) => c.complaintStatus === "OPEN").length,
    totalInProgress: complaints.filter(
      (c) => c.complaintStatus === "IN_PROGRESS"
    ).length,
    totalResolved: complaints.filter((c) => c.complaintStatus === "RESOLVED")
      .length,
    totalClosed: complaints.filter((c) => c.complaintStatus === "CLOSED")
      .length,
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8 justify-between w-full mb-8 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Keluhan Saya 💬
          </h1>
          <p className="text-gray-600 font-medium">
            Laporkan masalah dan pantau status penanganan keluhan Anda
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-blue-600 text-white font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Buat Keluhan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="font-bold text-gray-900">Keluhan Terbuka</h3>
          </div>
          <p className="text-2xl font-black text-red-600">
            {summary.totalOpen}
          </p>
          <p className="text-sm text-gray-600 mt-1">butuh perhatian</p>
        </div>

        <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h3 className="font-bold text-gray-900">Sedang Diproses</h3>
          </div>
          <p className="text-2xl font-black text-yellow-600">
            {summary.totalInProgress}
          </p>
          <p className="text-sm text-gray-600 mt-1">dalam penanganan</p>
        </div>

        <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-gray-900">Selesai</h3>
          </div>
          <p className="text-2xl font-black text-green-600">
            {summary.totalResolved}
          </p>
          <p className="text-sm text-gray-600 mt-1">berhasil ditangani</p>
        </div>

        <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-gray-900">Total Keluhan</h3>
          </div>
          <p className="text-2xl font-black text-blue-600">
            {complaints.length}
          </p>
          <p className="text-sm text-gray-600 mt-1">dari filter aktif</p>
        </div>
      </div>

      <FilterControll currentSort={currentSort} />

      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="p-6 border-b-2 border-black">
          <h2 className="text-xl font-black text-gray-900">Daftar Keluhan</h2>
        </div>

        {complaints.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-600 mb-2">
              Tidak ada keluhan ditemukan
            </h3>
            <p className="text-gray-500">
              Coba ubah filter atau kata kunci pencarian
            </p>
          </div>
        ) : (
          <div className="divide-y-2 divide-gray-100">
            {complaints.map((complaint, index) => (
              <div
                key={complaint.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-25"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-bold border-2 ${getComplaintStatusColor(
                          complaint.complaintStatus
                        )}`}
                      >
                        {getComplaintStatusIcon(complaint.complaintStatus)}
                        {getComplaintStatusText(complaint.complaintStatus)}
                      </div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm font-medium border border-gray-300">
                        {getComplaintCategoryText(complaint.category)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {complaint.title}
                    </h3>

                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {complaint.description}
                    </p>

                    <div className="text-sm text-gray-500">
                      Dibuat: {formatDate(complaint.createdAt.toString())}
                      {complaint.completionDate && (
                        <span className="ml-4">
                          Selesai:{" "}
                          {formatDate(complaint.completionDate.toString())}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenDetailModal(complaint)}
                    className="ml-4 p-2 text-blue-600 hover:bg-blue-50 border-2 border-transparent hover:border-black transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        onClose={handleCloseModal}
        isOpen={showModal && modal === "detail"}
      >
        {selectedComplaint ? (
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-black flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">
                Detail Keluhan
              </h2>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-bold border-2 ${getComplaintStatusColor(
                    selectedComplaint.complaintStatus
                  )}`}
                >
                  {getComplaintStatusIcon(selectedComplaint.complaintStatus)}
                  {getComplaintStatusText(selectedComplaint.complaintStatus)}
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm font-medium border border-gray-300">
                  {getComplaintCategoryText(selectedComplaint.category)}
                </span>
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-4">
                {selectedComplaint.title}
              </h3>

              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-2">Deskripsi:</h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedComplaint.description}
                </p>
              </div>
              {selectedComplaint.image ? (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-2">
                    Lampiran Gambar:
                  </h4>
                  <Image
                    width={500}
                    height={500}
                    src={selectedComplaint.image}
                    alt={selectedComplaint.title}
                    className="w-full aspect-video object-contain"
                  />
                </div>
              ) : null}

              {selectedComplaint.adminResponse && (
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-2">
                    Respon Admin:
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedComplaint.adminResponse}
                  </p>
                </div>
              )}

              <div className="text-sm text-gray-500 space-y-1">
                <div>
                  Dibuat: {formatDate(selectedComplaint.createdAt.toString())}
                </div>
                {selectedComplaint.completionDate && (
                  <div>
                    Selesai:{" "}
                    {formatDate(selectedComplaint.completionDate.toString())}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal isOpen={showModal && modal === "add"} onClose={handleCloseModal}>
        <ComplaintForm
          handleCloseModal={handleCloseModal}
          customerId={customerId}
        />
      </Modal>
    </div>
  );
};
