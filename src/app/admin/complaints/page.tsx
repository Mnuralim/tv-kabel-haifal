import { getAllComplaints } from "@/actions/complaint";
import type { ComplaintCategory } from "@prisma/client";
import { ComplaintsList } from "./_components/complaints-list";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function ComplaintsPage({ searchParams }: Props) {
  const { search, limit, skip, status, sortBy, sortOrder, category } =
    await searchParams;

  const result = await getAllComplaints(
    limit || "10",
    skip || "0",
    search,
    sortBy,
    sortOrder,
    status as "OPEN | IN_PROGRESS | RESOLVED | CLOSED",
    undefined,
    category as ComplaintCategory
  );

  return (
    <main className="w-full px-3 sm:px-3 md:px-8 py-8 min-h-screen bg-neutral-50">
      <div className="mx-auto">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 rounded-none">
          <div className="mb-6 border-b-4 border-red-600 pb-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-neutral-800">
              Complaint Management
            </h1>
            <p className="text-gray-700 font-bold mt-2">
              Kelola data keluhan pelanggan di sini.
            </p>
          </div>
          <ComplaintsList
            complaints={result.complaints}
            pagination={{
              currentPage: result.currentPage,
              totalPages: result.totalPages,
              totalItems: result.totalCount,
              itemsPerPage: result.itemsPerPage,
              preserveParams: {
                search,
                limit,
                skip,
                status,
                sortBy,
                sortOrder,
                category,
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
