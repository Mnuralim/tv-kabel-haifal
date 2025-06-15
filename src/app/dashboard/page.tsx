import { Dashboard } from "./_components/dashboard";
import { getAllBills } from "@/actions/bill";
import { getCustomerById } from "@/actions/customer";
import { getSession } from "@/actions/session";
import { getSettings } from "@/actions/settings";

export default async function CustomerDashboard() {
  const session = await getSession();
  const customer = await getCustomerById(session!.userId);
  const [result, settings] = await Promise.all([
    getAllBills(
      "10000",
      "0",
      undefined,
      undefined,
      undefined,
      customer?.customerDetails?.id
    ),
    getSettings(),
  ]);

  const pendingBillAmount = result.bills.reduce((total, bill) => {
    if (bill.paymentStatus !== "PAID") {
      return total + bill.amount;
    }
    return total;
  }, 0);

  const totalPendingBill = result.bills.filter(
    (bill) => bill.paymentStatus !== "PAID"
  ).length;

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <Dashboard
        setting={settings!}
        customer={customer!}
        bill={result.bills.find((bill) => bill.paymentStatus !== "PAID")}
        pendingBillAmount={pendingBillAmount}
        totalPendingBill={totalPendingBill}
      />
    </div>
  );
}
