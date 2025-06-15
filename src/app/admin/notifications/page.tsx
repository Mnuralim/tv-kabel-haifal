import { getAllAdminNotifications } from "@/actions/admin-notification";
import { AdminNotifications } from "./_components/notification-list";
import type { AdminNotificationType } from "@prisma/client";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function NotificationsPage({ searchParams }: Props) {
  const { limit, search, type, hideRead } = await searchParams;
  const notifications = await getAllAdminNotifications(
    limit || "10",
    search,
    type as AdminNotificationType,
    hideRead as "true"
  );
  return (
    <main className="w-full px-3 sm:px-3 md:px-8 py-8 min-h-screen bg-neutral-50">
      <AdminNotifications
        notifications={notifications}
        currentLimit={Number(limit) || 10}
        hideRead={hideRead as "true"}
      />
    </main>
  );
}
