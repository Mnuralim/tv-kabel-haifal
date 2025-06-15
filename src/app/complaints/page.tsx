import { Complaint } from "./_components/complaint";
import { getAllComplaints } from "@/actions/complaint";
import { getCustomerById } from "@/actions/customer";
import { getSession } from "@/actions/session";
import type { ComplaintCategory } from "@prisma/client";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function ComplaintsPage({ searchParams }: Props) {
  const { modal, status, category, sortBy, sortOrder } = await searchParams;
  const session = await getSession();
  const customer = await getCustomerById(session!.userId!);
  const result = await getAllComplaints(
    "100000",
    "0",
    undefined,
    sortBy,
    sortOrder,
    status as "OPEN | IN_PROGRESS | RESOLVED | CLOSED",
    customer?.customerDetails?.id,
    category as ComplaintCategory
  );
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <Complaint
        complaints={result.complaints}
        modal={modal as "add"}
        customerId={customer!.customerDetails!.id}
        currentSort={sortBy && sortOrder ? `${sortBy}-${sortOrder}` : undefined}
      />
    </div>
  );
}
