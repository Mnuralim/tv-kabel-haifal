import { getAllCustomerNotifications } from "@/actions/customer-notification";
import { CustomerNotifications } from "./_components/notification-list";
import type { CustomerNotificationType } from "@prisma/client";
import { getSession } from "@/actions/session";
import { getCustomerById } from "@/actions/customer";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}
export default async function NotificationsPage({ searchParams }: Props) {
  const { limit, search, type, hideRead } = await searchParams;
  const session = await getSession();
  const customer = await getCustomerById(session!.userId);
  const notifications = await getAllCustomerNotifications(
    limit || "10",
    search,
    type as CustomerNotificationType,
    customer?.customerDetails?.id,
    hideRead as "true"
  );
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <CustomerNotifications
        currentLimit={Number(limit) || 10}
        notifications={notifications}
        hideRead={hideRead as "true"}
      />
    </div>
  );
}
