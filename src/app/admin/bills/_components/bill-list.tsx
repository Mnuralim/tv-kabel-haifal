"use client";

import type { Prisma } from "@prisma/client";
import { Edit, Plus, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Tabel, type TabelColumn } from "../../_components/tabel";
import {
  formatCurrency,
  formatDate,
  getMonthName,
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from "@/lib/utils";
import { Modal } from "../../_components/modal";
import { BillForm } from "./form";
import type { CustomerInfo } from "../../customers/_components/customer-list";
import { BillFilterControl } from "./filter-control";
import Link from "next/link";
import { Pagination } from "../../_components/pagination";

export type BillInfo = Prisma.BillGetPayload<{
  include: {
    customer: {
      select: {
        fullName: true;
        address: true;
        phoneNumber: true;
        idCardNumber: true;
      };
    };
    payment: {
      include: {
        admin: {
          select: {
            adminName: true;
          };
        };
      };
    };
  };
}>;

interface Props {
  bills: BillInfo[];
  modal?: "add" | "edit";
  customers: CustomerInfo[];
  pagination: PaginationProps;
}

export const BillList = ({ bills, modal, customers, pagination }: Props) => {
  const [selectedBill, setSelectedBill] = useState<BillInfo | null>(null);
  const router = useRouter();
  const isModalOpen = modal === "add" || modal === "edit";

  const handleAddClick = () => {
    router.push("/admin/bills?modal=add");
  };

  const handleEditCustomer = (bill: BillInfo) => {
    setSelectedBill(bill);
    router.push(`/admin/bills?modal=edit`);
  };

  const handleCloseModal = () => {
    router.push("/admin/bills");
    setSelectedBill(null);
  };

  const columns: TabelColumn<BillInfo>[] = [
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
      header: "Periode",
      accessor: (item) => `${getMonthName(item.month)} ${item.year}`,
    },

    {
      header: "Jumlah Tagihan",
      accessor: (item) => formatCurrency(item.amount) || "-",
    },
    {
      header: "Status Pembayaran",
      accessor: (item) => item.paymentStatus || "-",
      render: (item) => (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-bold border-2 ${getStatusColor(
            item.paymentStatus
          )}`}
        >
          {getStatusIcon(item.paymentStatus)}
          {getStatusText(item.paymentStatus)}
        </div>
      ),
    },
    {
      header: "Jatuh Tempo",
      accessor: (item) => formatDate(item.dueDate.toString()),
    },

    {
      header: "Aksi",
      accessor: (item) => item.id,
      render: (item) => (
        <div className="flex gap-2">
          <Link
            href={`/admin/bills/${item.id}`}
            className="bg-indigo-600 text-white border-2 border-neutral-700 px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center disabled:opacity-50"
          >
            <Eye className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <button
            onClick={() => handleEditCustomer(item)}
            className="bg-yellow-600 text-white border-2 border-neutral-700 px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center disabled:opacity-50"
          >
            <Edit className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black border-b-8 border-red-500 pb-2 text-black">
          Daftar Tagihan
        </h1>
        <button
          onClick={handleAddClick}
          className="bg-red-600 text-white border-4 border-neutral-700 px-6 py-3 font-bold shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all w-full sm:w-auto flex items-center justify-center"
        >
          <Plus className="mr-2 w-5 h-5" strokeWidth={2.5} /> Tambah Tagihan
        </button>
      </div>

      <BillFilterControl
        currentSortOrder={pagination.preserveParams!.sortOrder as string}
        customers={customers}
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
          <Tabel columns={columns} data={bills} />
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
        <BillForm
          selectedBill={selectedBill}
          modal={modal}
          customers={customers}
          onClose={handleCloseModal}
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
