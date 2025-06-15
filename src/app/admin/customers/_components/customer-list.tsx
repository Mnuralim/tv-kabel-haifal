"use client";

import type { Prisma } from "@prisma/client";
import { Edit, Plus, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Tabel, type TabelColumn } from "../../_components/tabel";
import {
  formatDate,
  getCustomerStatusColor,
  getCustomerStatusText,
} from "@/lib/utils";
import { CustomerForm } from "./form";
import { Modal } from "../../_components/modal";
import { FilterControl1 } from "./filter-control";
import Link from "next/link";
import { Pagination } from "../../_components/pagination";
import { deleteCustomer } from "@/actions/customer/index";
import { Alert } from "../../_components/alert";

export type CustomerInfo = Prisma.UserGetPayload<{
  include: {
    customerDetails: {
      include: {
        bills: true;
        complaints: true;
      };
    };
  };
}>;

interface Props {
  customers: CustomerInfo[];
  modal?: "add" | "edit";
  pagination: PaginationProps;
}

export const CustomerList = ({ customers, modal, pagination }: Props) => {
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning";
    onConfirm: (() => void) | null;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    onConfirm: null,
  });

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInfo | null>(
    null
  );
  const router = useRouter();
  const isModalOpen = modal === "add" || modal === "edit";

  const handleAddClick = () => {
    router.push("/admin/customers?modal=add", {
      scroll: false,
    });
  };

  const handleEditCustomer = (customer: CustomerInfo) => {
    setSelectedCustomer(customer);
    router.push(`/admin/customers?modal=edit`, {
      scroll: false,
    });
  };

  const handleCloseModal = () => {
    router.push("/admin/customers");
    setSelectedCustomer(null);
  };

  const handleDelete = (id: string) => {
    setAlert({
      isOpen: true,
      title: "Hapus Pelanggan",
      message: "Apakah anda yakin ingin menghapus pelanggan ini?",
      type: "warning",
      onConfirm: () => deleteCustomer(id),
    });
  };

  const columns: TabelColumn<CustomerInfo>[] = [
    {
      header: "No",
      accessor: "id",
      render: (_, index) => (index as number) + 1,
    },
    {
      header: "Nama Lengkap",
      accessor: (item) => item.customerDetails?.fullName || "-",
    },
    {
      header: "Alamat",
      accessor: (item) => item.customerDetails?.address || "-",
    },
    {
      header: "Nomor HP",
      accessor: (item) => item.customerDetails?.phoneNumber || "-",
    },
    {
      header: "Status",
      accessor: (item) => item.customerDetails?.status || "-",
      render: (item) => (
        <div
          className={`px-3 w-full py-1 text-sm font-bold border-2 text-center ${getCustomerStatusColor(
            item.customerDetails?.status || "ACTIVE"
          )}`}
        >
          {getCustomerStatusText(item.customerDetails?.status || "ACTIVE")}
        </div>
      ),
    },
    {
      header: "Mulai Berlangganan",
      accessor: (item) =>
        item.customerDetails?.subscriptionStartDate
          ? formatDate(item.customerDetails.subscriptionStartDate.toString())
          : "-",
    },
    {
      header: "Tagihan Aktif",
      accessor: (item) => item.customerDetails?.bills.length || 0,
      render: (item) => (
        <div className="flex items-center">
          {item.customerDetails?.bills.length || 0} Tagihan
        </div>
      ),
    },

    {
      header: "Aksi",
      accessor: (item) => item.id,
      render: (item) => (
        <div className="flex gap-2">
          <Link
            href={`/admin/customers/${item.id}`}
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
          <form
            action={() => handleDelete(item.id)}
            className="bg-red-600 text-white border-2 border-neutral-700 px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center disabled:opacity-50"
          >
            <button type="submit" className="w-full h-full">
              <Trash2 className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black border-b-8 border-red-500 pb-2 text-black">
          Daftar Pelanggan
        </h1>
        <button
          onClick={handleAddClick}
          className="bg-red-600 text-white border-4 border-neutral-700 px-6 py-3 font-bold shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all w-full sm:w-auto flex items-center justify-center"
        >
          <Plus className="mr-2 w-5 h-5" strokeWidth={2.5} /> Tambah Pelanggan
        </button>
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
          <Tabel columns={columns} data={customers} />
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
        <CustomerForm
          selectedCustomer={selectedCustomer}
          modal={modal}
          onClose={handleCloseModal}
        />
      </Modal>

      <Alert
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onConfirm={alert.onConfirm}
      />
    </div>
  );
};
