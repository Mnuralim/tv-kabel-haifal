import { getInstallationRequest } from "@/actions/installation-request";
import { InstallationRequestList } from "./_components/installation-request-list";
import type { InstallationStatus } from "@prisma/client";

interface Props {
  searchParams: Promise<{
    modal?: "accept" | "reject";
    limit?: string;
    skip?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    status?: string;
  }>;
}

export default async function InstallationRequestPage({ searchParams }: Props) {
  const { modal, limit, skip, search, sortBy, sortOrder, status } =
    await searchParams;

  const result = await getInstallationRequest(
    limit || "10",
    skip || "0",
    status as InstallationStatus,
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
              Permintaan Instalasi
            </h1>
            <p className="text-gray-700 font-bold mt-2">
              Kelola permintaan instalasi pelanggan di sini.
            </p>
          </div>

          <InstallationRequestList
            pagination={{
              currentPage: result.currentPage,
              totalPages: result.totalPages,
              totalItems: result.totalCount,
              itemsPerPage: result.itemsPerPage,
              preserveParams: {
                modal,
                limit,
                skip,
                search,
                sortBy,
                sortOrder,
                status,
              },
            }}
            requests={result.requests}
            modal={modal}
          />
        </div>
      </div>
    </main>
  );
}
