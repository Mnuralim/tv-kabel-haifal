import {
  getCableBillingStats,
  getMonthlyBillingStats,
  getMonthlyPayments,
} from "@/actions/stats";
import { CableBillingDashboard } from "./_components/dashboard";

export default async function AdminDashboardPage() {
  const [stats, monthlyPayments, monthlyStats] = await Promise.all([
    getCableBillingStats(),
    getMonthlyPayments(),
    getMonthlyBillingStats(),
  ]);

  return (
    <div className="w-full px-3 sm:px-3 md:px-8 py-8 min-h-screen bg-neutral-50">
      <CableBillingDashboard
        stats={stats}
        monthlyPayments={monthlyPayments}
        monthlyStats={monthlyStats}
      />
    </div>
  );
}
