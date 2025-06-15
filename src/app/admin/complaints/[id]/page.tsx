import { getComplaintById } from "@/actions/complaint";
import { ComplaintDetail } from "./_components/complaint-detail";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function DetailComplaintPage({ params }: Props) {
  const { id } = await params;
  const complaint = await getComplaintById(id);
  if (!complaint) {
    return <div className="text-center text-red-600">Complaint not found</div>;
  }

  return (
    <div className="px-3 sm:px-3 md:px-8 py-8">
      <ComplaintDetail complaint={complaint} />
    </div>
  );
}
