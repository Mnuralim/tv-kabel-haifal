"use client";
import React, { useActionState } from "react";
import { Home, Plus, Tv, RefreshCw } from "lucide-react";
import type { InstallationRequestInfo } from "@/app/admin/installation-request/_components/installation-request-list";
import { useRouter } from "next/navigation";
import { Modal } from "@/app/admin/_components/modal";
import {
  formatDate,
  getInstalationStatusIcon,
  getInstallationRequestStatusColor,
  getInstallationRequestStatusText,
} from "@/lib/utils";
import { createInstallationRequest } from "@/actions/installation-request";
import { ErrorMessage } from "@/app/admin/_components/error-message";
import { SubmitButton } from "./submit-button";
import { Prisma } from "@prisma/client";
import { CustomerStatusWarning } from "./customer-status-warning";

type Customer = Prisma.UserGetPayload<{
  select: {
    username: true;
    id: true;
    customerDetails: {
      select: {
        status: true;
        subscriptionStartDate: true;
        address: true;
        id: true;
        fullName: true;
      };
    };
  };
}>;

interface Props {
  request: InstallationRequestInfo | null;
  modal?: "add";
  customerStatus?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  customer: Customer;
}

export const InstallationRequest = ({ request, modal, customer }: Props) => {
  const [state, action] = useActionState(createInstallationRequest, {
    error: null,
  });
  const router = useRouter();
  const isModalOpen = modal === "add";
  const canRequestInstallation = customer.customerDetails?.status === "ACTIVE";

  const handleOpenModal = () => {
    router.push("/installations?modal=add", {
      scroll: false,
    });
  };

  const handleCloseModal = () => {
    router.back();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Status Instalasi 🏠
        </h1>
        <p className="text-gray-600 font-medium">
          Cek status permintaan instalasi TV kabel Anda
        </p>
      </div>

      <CustomerStatusWarning customer={customer} />

      {request ? (
        <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Home className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-black text-gray-900">
              Status Instalasi
            </h2>
          </div>

          <div className="flex items-center gap-3 mb-6">
            {getInstalationStatusIcon(request.status)}
            <span
              className={`px-4 py-2 text-sm font-bold border-2 ${getInstallationRequestStatusColor(
                request.status
              )}`}
            >
              {getInstallationRequestStatusText(request.status)}
            </span>
          </div>

          <div
            className={`p-4 border-2 ${getInstallationRequestStatusColor(
              request.status
            )} mb-6`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-bold text-gray-700">
                    Alamat Instalasi:
                  </span>
                  <p className="text-gray-900 font-medium">
                    {request.installationAddress}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-700">
                    Tanggal Pengajuan:
                  </span>
                  <p className="text-gray-900 font-medium">
                    {formatDate(request.createdAt.toString())}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {request.scheduledDate && (
                  <div>
                    <span className="text-sm font-bold text-gray-700">
                      Tanggal Terjadwal:
                    </span>
                    <p className="text-gray-900 font-medium">
                      {formatDate(request.scheduledDate.toString())}
                    </p>
                  </div>
                )}
                {request.admin?.adminName && (
                  <div>
                    <span className="text-sm font-bold text-gray-700">
                      Admin Penanggung Jawab:
                    </span>
                    <p className="text-gray-900 font-medium">
                      {request.admin.adminName}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {request.notes && (
              <div className="mt-4">
                <span className="text-sm font-bold text-gray-700">
                  Catatan:
                </span>
                <p className="text-gray-900 font-medium">{request.notes}</p>
              </div>
            )}
          </div>

          {request.status === "REJECTED" && canRequestInstallation && (
            <div className="mb-6">
              <button
                onClick={handleOpenModal}
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                Ajukan Ulang
              </button>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-black text-gray-900">
              Timeline Proses
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-900">
                  Permintaan diajukan -{" "}
                  {formatDate(request.createdAt.toString())}
                </span>
              </div>
              {["APPROVED", "COMPLETED"].includes(request.status) &&
                request.approvedDate && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">
                      Permintaan disetujui -{" "}
                      {formatDate(request.approvedDate.toString())}
                    </span>
                  </div>
                )}
              {request.status === "COMPLETED" && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-900">
                    Instalasi selesai -{" "}
                    {request.completionDate
                      ? formatDate(request.completionDate.toString())
                      : "Belum selesai"}
                  </span>
                </div>
              )}
              {request.status === "REJECTED" && request.rejectedDate && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-900">
                    Permintaan ditolak-{" "}
                    {formatDate(request.rejectedDate.toString())}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
          <div className="text-center py-8">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-black text-gray-900 mb-2">
              Belum Ada Permintaan Instalasi
            </h2>
            <p className="text-gray-600 mb-6">
              {canRequestInstallation
                ? "Anda belum pernah mengajukan permintaan instalasi TV kabel. Ajukan sekarang untuk mulai menikmati layanan kami!"
                : "Anda belum dapat mengajukan instalasi. Pastikan akun Anda sudah diverifikasi terlebih dahulu."}
            </p>

            {canRequestInstallation ? (
              <button
                onClick={handleOpenModal}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <Plus className="w-5 h-5" />
                Ajukan Instalasi
              </button>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-400 text-gray-600 font-bold border-2 border-gray-500 shadow-[4px_4px_0px_0px_rgba(107,114,128,1)] cursor-not-allowed opacity-60"
              >
                <Plus className="w-5 h-5" />
                Ajukan Instalasi
              </button>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen && canRequestInstallation}
        onClose={handleCloseModal}
      >
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl md:text-3xl font-black mb-6 border-b-4 border-red-500 pb-2 text-neutral-800 flex items-center gap-2">
            <Tv /> Ajukan Instalasi
          </h2>
        </div>
        <form action={action} className="space-y-4">
          {state.error && <ErrorMessage message={state.error} />}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Alamat Instalasi *
            </label>
            <input
              type="text"
              name="installationAddress"
              placeholder="Masukkan alamat lengkap untuk instalasi"
              className="w-full p-3 border-2 border-gray-300 focus:border-black focus:outline-none font-medium"
              required
            />
          </div>
          <div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-bold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Batal
              </button>

              <SubmitButton />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
