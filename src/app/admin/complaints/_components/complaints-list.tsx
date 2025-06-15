"use client";

import type { Prisma } from "@prisma/client";
import { Trash2, Eye, CheckCircle, Play, XCircle } from "lucide-react";
import React, { useActionState } from "react";
import { Tabel, type TabelColumn } from "../../_components/tabel";
import {
  formatDate,
  getComplaintCategoryText,
  getComplaintStatusColor,
  getComplaintStatusIcon,
  getComplaintStatusText,
} from "@/lib/utils";
import Link from "next/link";
import { confirmComplaint } from "@/actions/complaint";
import { FilterControl1 } from "./filter-control";
import { Pagination } from "../../_components/pagination";

export type ComplainInfo = Prisma.ComplaintGetPayload<{
  include: {
    customer: true;
  };
}>;

interface Props {
  complaints: ComplainInfo[];
  pagination: PaginationProps;
}

export const ComplaintsList = ({ complaints, pagination }: Props) => {
  const [, confirmationAction] = useActionState(confirmComplaint, {
    error: null,
  });

  const columns: TabelColumn<ComplainInfo>[] = [
    {
      header: "No",
      accessor: "id",
      render: (_, index) => (index as number) + 1,
    },
    {
      header: "Pelanggan",
      accessor: (item) => item.customer.fullName || "-",
    },
    {
      header: "Kategori",
      accessor: (item) => getComplaintCategoryText(item.category) || "-",
    },
    {
      header: "Keluhan",
      accessor: (item) => item.title || "-",
    },
    {
      header: "Status",
      accessor: (item) => item.complaintStatus || "-",
      render: (item) => (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-bold border-2 ${getComplaintStatusColor(
            item.complaintStatus
          )}`}
        >
          {getComplaintStatusIcon(item.complaintStatus)}
          {getComplaintStatusText(item.complaintStatus)}
        </div>
      ),
    },
    {
      header: "Dibuat",
      accessor: (item) => formatDate(item.createdAt.toString()) || "-",
    },

    {
      header: "Aksi",
      accessor: (item) => item.id,
      render: (item) => (
        <div className="flex gap-2">
          <Link
            href={`/admin/complaints/${item.id}`}
            className="bg-indigo-600 text-white border-2 border-neutral-700 px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center"
            title="Lihat Detail"
          >
            <Eye className="w-4 h-4" strokeWidth={2.5} />
          </Link>

          {item.complaintStatus === "OPEN" && (
            <form action={confirmationAction} className="inline">
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="status" value={"IN_PROGRESS"} />
              <button
                type="submit"
                className="bg-blue-600 text-white border-2 border-neutral-700 px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center"
                title="Terima & Proses"
              >
                <Play className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </form>
          )}

          {item.complaintStatus === "IN_PROGRESS" && (
            <form action={confirmationAction} className="inline">
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="status" value={"RESOLVED"} />
              <button
                type="submit"
                className="bg-green-600 text-white border-2 border-neutral-700 px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center"
                title="Tandai Selesai"
              >
                <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </form>
          )}

          {item.complaintStatus === "RESOLVED" && (
            <form action={confirmationAction} className="inline">
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="status" value={"CLOSED"} />
              <button
                type="submit"
                className="bg-gray-600 text-white border-2 border-neutral-700 px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center"
                title="Tutup Keluhan"
              >
                <XCircle className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </form>
          )}

          {item.complaintStatus === "CLOSED" && (
            <form className="inline">
              <button
                type="submit"
                className="bg-red-600 text-white border-2 border-neutral-700 px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center"
                title="Hapus Keluhan"
                onClick={(e) => {
                  if (
                    !confirm("Apakah Anda yakin ingin menghapus keluhan ini?")
                  ) {
                    e.preventDefault();
                  }
                }}
              >
                <Trash2 className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </form>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black border-b-8 border-red-500 pb-2 text-black">
          Daftar Keluhan
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
          <Tabel columns={columns} data={complaints} />
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

      {/* <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <CustomerForm
          selectedComplain={selectedComplain}
          modal={modal}
          onClose={handleCloseModal}
        />
      </Modal> */}

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
