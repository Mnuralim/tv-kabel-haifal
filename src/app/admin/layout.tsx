import type { Metadata } from "next";
// import { getAdmin } from "@/actions/admin";
import { headers } from "next/headers";
import { getAdmin } from "@/actions/admin";
import { Sidebar } from "./_components/sidebar";
import { Navbar } from "./_components/navbar";
import { getAdminNotificationCount } from "@/actions/admin-notification";
import { getSettings } from "@/actions/settings";

export const metadata: Metadata = {
  title: "Admin - Dashboard",
  description: "Aplikasi Manajemen TV Kabel",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const path =
    (await headersList).get("x-pathname") || (await headersList).get("x-url");
  const isLoginPage = path?.includes("/admin/login");

  let admin = null;
  if (!isLoginPage) {
    admin = await getAdmin();
  }

  const [notificationCount, setting] = await Promise.all([
    getAdminNotificationCount(),
    getSettings(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 ">
      {!isLoginPage && (
        <Sidebar setting={setting!} username={admin?.username} />
      )}
      <div
        className={`min-h-screen flex-1 flex flex-col transition-all duration-300 ${
          !isLoginPage ? "lg:pl-72" : ""
        }`}
      >
        {!isLoginPage && (
          <Navbar
            notificationCount={notificationCount || 0}
            username={admin?.username}
          />
        )}
        <main className="p-4 md:p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
