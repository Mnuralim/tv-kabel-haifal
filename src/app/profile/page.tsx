import { getSession } from "@/actions/session";
import { CustomerProfile } from "./_components/profile";
import { getCustomerById } from "@/actions/customer";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function ProfilePage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const session = await getSession();
  const customer = await getCustomerById(session!.userId);
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <CustomerProfile
        customer={customer!}
        currentTab={tab as "info" | "password"}
      />
    </div>
  );
}
