import { getCustomerById } from "@/actions/customer/index";
import { CustomerDetail } from "./_components/customer-detail";
import { getSettings } from "@/actions/settings";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function DetailCustomerPage({ params }: Props) {
  const { id } = await params;
  const [customer, setting] = await Promise.all([
    getCustomerById(id),
    getSettings(),
  ]);
  if (!customer) {
    return <div className="text-center text-red-600">Customer not found</div>;
  }
  return (
    <div className="px-3 sm:px-3 md:px-8 py-8">
      <CustomerDetail customer={customer} monthlyRate={setting?.montyhlyRate} />
    </div>
  );
}
