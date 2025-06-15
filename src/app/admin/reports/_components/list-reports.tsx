"use client";

import type { Prisma } from "@prisma/client";
import { Printer } from "lucide-react";
import React, { useRef } from "react";
import { Tabel, type TabelColumn } from "../../_components/tabel";
import { formatCurrency, getMonthName } from "@/lib/utils";
import { Pagination } from "../../_components/pagination";
import { FilterControl1 } from "./filter-control";
import { useReactToPrint } from "react-to-print";
import { PrintableReport } from "./pdf-report";

type TransactionReportReportInfo = Prisma.TransactionReportGetPayload<{
  include: {
    admin: true;
  };
}>;

interface Props {
  reports: TransactionReportReportInfo[];
  pagination: PaginationProps;
}

export const ReportList = ({ reports, pagination }: Props) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Laporan-Penjualan",
  });
  const columns: TabelColumn<TransactionReportReportInfo>[] = [
    {
      header: "No",
      accessor: "id",
      render: (_, index) => (index as number) + 1,
    },
    {
      header: "Periode",
      accessor: (item) => `${getMonthName(item.month)} ${item.year}` || "-",
    },
    {
      header: "Pendapatan",
      accessor: (item) => formatCurrency(item.totalRevenue) || "-",
    },
    {
      header: "Total Transaksi",
      accessor: (item) => item.transactionCount || 0,
    },
    {
      header: "Catatan",
      accessor: (item) => item.notes || "-",
    },
    {
      header: "PJ",
      accessor: (item) => item.admin.adminName || "-",
    },
  ];

  return (
    <div className="w-full">
      <div style={{ display: "none" }}>
        <PrintableReport ref={printRef} reports={reports} />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black border-b-8 border-red-500 pb-2 text-black">
          Daftar Laporan Transaksi
        </h1>
        <button
          onClick={handlePrint}
          className="bg-red-600 text-white border-4 border-neutral-700 px-6 py-3 font-bold shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all w-full sm:w-auto flex items-center justify-center"
        >
          <Printer className="mr-2 w-5 h-5" strokeWidth={2.5} />
          Cetak
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
          <Tabel columns={columns} data={reports} />
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
