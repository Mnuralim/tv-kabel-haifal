import { getCustomerInstallationRequest } from "@/actions/installation-request";
import { InstallationRequest } from "./_components/installation";
import { getSession } from "@/actions/session";
import { getCustomerById } from "@/actions/customer";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function InstallationsPage({ searchParams }: Props) {
  const { modal } = await searchParams;
  const session = await getSession();

  const [request, customer] = await Promise.all([
    getCustomerInstallationRequest(session!.userId),
    getCustomerById(session!.userId),
  ]);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <InstallationRequest
        request={request}
        modal={modal as "add"}
        customer={customer!}
      />
    </div>
  );
}
