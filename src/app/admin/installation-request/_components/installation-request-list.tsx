"use client";

import type { Prisma } from "@prisma/client";
import { Eye, X, Check, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useActionState, useState } from "react";
import { Tabel, type TabelColumn } from "../../_components/tabel";
import {
  formatDate,
  getInstallationRequestStatusColor,
  getInstallationRequestStatusText,
} from "@/lib/utils";
import { Modal } from "../../_components/modal";
import Link from "next/link";
import { ConfirmationForm } from "./confirmation-form";
import { confirmInstallationRequest } from "@/actions/installation-request";
import { FilterControl1 } from "./filter-control";
import { Pagination } from "../../_components/pagination";

export type InstallationRequestInfo = Prisma.InstallationRequestGetPayload<{
  include: {
    admin: true;
    customer: true;
  };
}>;

interface Props {
  requests: InstallationRequestInfo[];
  modal?: "accept" | "reject";
  pagination: PaginationProps;
}

export const InstallationRequestList = ({
  requests,
  modal,
  pagination,
}: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();
  const [, confirmAction] = useActionState(confirmInstallationRequest, {
    error: null,
  });
  const isModalOpen = modal === "accept" || modal === "reject";

  const handleAcceptRequest = (id: string) => {
    setSelectedId(id);
    router.push("/admin/installation-request?modal=accept", {
      scroll: false,
    });
  };

  const handleRejectRequest = (id: string) => {
    setSelectedId(id);
    router.push(`/admin/installation-request?modal=reject`, {
      scroll: false,
    });
  };

  const handleCloseModal = () => {
    router.back();
  };

  const columns: TabelColumn<InstallationRequestInfo>[] = [
    {
      header: "No",
      accessor: "id",
      render: (_, index) => (index as number) + 1,
    },
    {
      header: "Nama Pelanggan",
      accessor: (item) => item.customer.fullName || "-",
    },
    {
      header: "No Telepon",
      accessor: (item) => item.customer?.phoneNumber || "-",
    },
    {
      header: "Alamat Pemasangan",
      accessor: (item) => item.installationAddress || "-",
    },
    {
      header: "Status",
      accessor: (item) => item.status || "-",
      render: (item) => (
        <div
          className={`px-3 w-full py-1 text-sm font-bold border-2 text-center ${getInstallationRequestStatusColor(
            item.status || "PENDING"
          )}`}
        >
          {getInstallationRequestStatusText(item.status || "PENDING")}
        </div>
      ),
    },
    {
      header: "Tgl. Pengajuan",
      accessor: (item) =>
        item.createdAt ? formatDate(item.createdAt.toString()) : "-",
    },
    {
      header: "Tgl. Terjadwal",
      accessor: (item) =>
        item.scheduledDate ? formatDate(item.scheduledDate.toString()) : "-",
    },
    {
      header: "Admin PJ",
      accessor: (item) => item.admin?.adminName || "-",
    },

    {
      header: "Aksi",
      accessor: (item) => item.id,
      render: (item) => (
        <div className="grid lg:grid-cols-2 gap-2">
          <div>
            <Link
              href={`/admin/installation-request/${item.id}`}
              className="bg-indigo-600 text-white border-2 border-neutral-700 px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center disabled:opacity-50"
            >
              <Eye className="w-4 h-4 min-w-4" strokeWidth={2.5} />
            </Link>
          </div>

          {item.status === "PENDING" && (
            <div>
              <button
                onClick={() => handleAcceptRequest(item.id)}
                className="bg-green-600 text-white border-2 border-neutral-700 px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center disabled:opacity-50"
              >
                <Check className="w-4 h-4 min-w-4" strokeWidth={2.5} />
              </button>
            </div>
          )}

          {(item.status === "PENDING" || item.status === "APPROVED") && (
            <div>
              <button
                onClick={() => handleRejectRequest(item.id)}
                className="bg-red-600 text-white border-2 border-neutral-700 px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center disabled:opacity-50"
              >
                <X className="w-4 h-4 min-w-4" strokeWidth={2.5} />
              </button>
            </div>
          )}

          {item.status === "APPROVED" && (
            <div>
              <form action={confirmAction}>
                <input type="hidden" name="id" defaultValue={item.id} />
                <input type="hidden" name="status" defaultValue="COMPLETED" />
                <button
                  type="submit"
                  className="bg-emerald-600 text-white border-2 border-neutral-700 px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4 min-w-4" strokeWidth={2.5} />
                </button>
              </form>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black border-b-8 border-red-500 pb-2 text-black">
          Daftar Permintaan Instalasi
        </h1>
      </div>

      <FilterControl1
        currentSortOrder={pagination.preserveParams!.sortOrder as string}
      />

      {/* <div className="md:hidden space-y-4">
        {menuData.map((item, index) => (
          <MobileMenuCard
            index={index}
            key={item.id}
            item={item}
            onDeleteClick={handleDelete}
            onEditClick={handleEditItem}
          />
        ))}
      </div> */}

      <div className=" bg-neutral-50 border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] overflow-hidden rounded-none">
        <div className="overflow-x-auto">
          <Tabel columns={columns} data={requests} />
        </div>
      </div>

      <div className="mt-10">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          preserveParams={pagination.preserveParams}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ConfirmationForm
          onClose={handleCloseModal}
          selectedId={selectedId}
          modal={modal}
        />
      </Modal>

      {/* <Alert
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onConfirm={alert.onConfirm}
      /> */}
    </div>
  );
};
