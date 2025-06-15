import { getBillById } from "@/actions/bill";
import { BillDetail } from "./_components/bill-detail";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function DetailBillPage({ params }: Props) {
  const { id } = await params;
  const bill = await getBillById(id);
  if (!bill) {
    return <div className="text-center text-red-600">Bill not found</div>;
  }
  return (
    <div>
      <BillDetail bill={bill} />
    </div>
  );
}
