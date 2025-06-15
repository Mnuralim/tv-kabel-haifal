import { getAllBills } from "@/actions/bill";
import { Bills } from "./_components/bills";
import type { PaymentStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/session";
import { getCustomerById } from "@/actions/customer";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function CustomerBills({ searchParams }: Props) {
  const { modal, paymentStatus, month, year, sortBy, sortOrder, search } =
    await searchParams;
  const session = await getSession();
  const customer = await getCustomerById(session!.userId);
  const result = await getAllBills(
    "100000",
    "0",
    paymentStatus as PaymentStatus,
    month,
    year,
    customer?.customerDetails?.id,
    sortBy,
    sortOrder,
    search
  );

  if (!customer?.customerDetails?.subscriptionStartDate) {
    redirect("/installations");
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <Bills bills={result.bills} modal={modal as "add"} />
    </div>
  );
}
