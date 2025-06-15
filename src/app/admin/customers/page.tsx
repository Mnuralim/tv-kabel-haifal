import { getAllCustomers } from "@/actions/customer/index";
import { CustomerList } from "./_components/customer-list";
import type { CustomerStatus } from "@prisma/client";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function CustomersPage({ searchParams }: Props) {
  const { modal, search, limit, skip, status, sortBy, sortOrder } =
    await searchParams;
  const result = await getAllCustomers(
    limit || "10",
    skip || "0",
    status as CustomerStatus,
    search,
    sortBy,
    sortOrder
  );

  return (
    <main className="w-full px-3 sm:px-3 md:px-8 py-8 min-h-screen bg-neutral-50">
      <div className="mx-auto">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 rounded-none">
          <div className="mb-6 border-b-4 border-red-600 pb-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-neutral-800">
              Customer Management
            </h1>
            <p className="text-gray-700 font-bold mt-2">
              Kelola data pelanggan Anda di sini.
            </p>
          </div>
          <CustomerList
            pagination={{
              currentPage: result.currentPage,
              totalPages: result.totalPages,
              totalItems: result.totalCount,
              itemsPerPage: result.itemsPerPage,
              preserveParams: {
                limit,
                skip,
                status,
                search,
                sortBy,
                sortOrder,
              },
            }}
            customers={result.customers}
            modal={modal as "add" | "edit"}
          />
        </div>
      </div>
    </main>
  );
}
