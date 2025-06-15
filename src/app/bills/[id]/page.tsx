import { getBillById } from "@/actions/bill";
import { BillDetail } from "./_components/bill-detail";
import { getSettings } from "@/actions/settings";

interface Props {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function DetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { modal } = await searchParams;
  const [bill, setting] = await Promise.all([getBillById(id), getSettings()]);
  if (!bill) {
    return <div className="text-center text-red-600">Bill not found</div>;
  }
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-3 lg:px-8 mt-10">
      <BillDetail setting={setting!} bill={bill} modal={modal as "add"} />
    </div>
  );
}
