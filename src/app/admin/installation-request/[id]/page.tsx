import { getInstallationRequestById } from "@/actions/installation-request";
import { InstallationRequestDetail } from "./_components/request-detail";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function DetailCustomerPage({ params }: Props) {
  const { id } = await params;
  const request = await getInstallationRequestById(id);
  if (!request) {
    return <div className="text-center text-red-600">Request not found</div>;
  }

  return (
    <div className="px-3 sm:px-3 md:px-8 py-8">
      <InstallationRequestDetail request={request} />
    </div>
  );
}
