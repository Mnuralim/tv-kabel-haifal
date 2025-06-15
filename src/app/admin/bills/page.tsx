import { getAllBills } from "@/actions/bill";
import { BillList } from "./_components/bill-list";
import { getAllCustomers } from "@/actions/customer";
import type { PaymentStatus } from "@prisma/client";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function BillsPage({ searchParams }: Props) {
  const {
    modal,
    limit,
    skip,
    paymentStatus,
    month,
    year,
    customerId,
    sortBy,
    sortOrder,
    search,
  } = await searchParams;
  const [billResult, customerResult] = await Promise.all([
    getAllBills(
      limit || "10",
      skip || "0",
      paymentStatus as PaymentStatus,
      month,
      year,
      customerId,
      sortBy,
      sortOrder,
      search
    ),
    getAllCustomers("10000", "0"),
  ]);
  return (
    <main className="w-full px-3 sm:px-3 md:px-8 py-8 min-h-screen bg-neutral-50">
      <div className="mx-auto">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 rounded-none">
          <div className="mb-6 border-b-4 border-red-600 pb-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-neutral-800">
              Bills Management
            </h1>
            <p className="text-gray-700 font-bold mt-2">
              Kelola data tagihan pelanggan Anda di sini.
            </p>
          </div>
          <BillList
            pagination={{
              currentPage: billResult.currentPage,
              totalPages: billResult.totalPages,
              totalItems: billResult.totalCount,
              itemsPerPage: billResult.itemsPerPage,
              preserveParams: {
                limit,
                skip,
                paymentStatus,
                month,
                year,
                customerId,
                sortBy,
                sortOrder,
                search,
              },
            }}
            bills={billResult.bills}
            modal={modal as "add" | "edit"}
            customers={customerResult.customers}
          />
        </div>
      </div>
    </main>
  );
}
