import { getAllReports } from "@/actions/report";
import { ReportList } from "./_components/list-reports";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function ReportPage({ searchParams }: Props) {
  const { search, limit, skip, sortBy, sortOrder, startPeriod, endPeriod } =
    await searchParams;

  const result = await getAllReports(
    limit || "100000",
    skip || "0",
    search,
    startPeriod,
    endPeriod,
    sortBy,
    sortOrder
  );
  return (
    <main className="w-full px-3 sm:px-3 md:px-8 py-8 min-h-screen bg-neutral-50">
      <div className="mx-auto">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 rounded-none">
          <div className="mb-6 border-b-4 border-red-600 pb-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-neutral-800">
              Report Management
            </h1>
            <p className="text-gray-700 font-bold mt-2">
              Kelola data laporan transaksi di sini.
            </p>
          </div>
          <ReportList
            reports={result.reports}
            pagination={{
              currentPage: result.currentPage,
              totalPages: result.totalPages,
              totalItems: result.totalCount,
              itemsPerPage: result.itemsPerPage,
              preserveParams: {
                search,
                limit,
                skip,
                sortBy,
                sortOrder,
                startPeriod,
                endPeriod,
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
