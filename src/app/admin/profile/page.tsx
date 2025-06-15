import { AdminProfile } from "./_components/profile";
import { getAdmin } from "@/actions/admin";

export default async function SettingsPage() {
  const admin = await getAdmin();

  if (!admin) {
    return <div className="text-center text-red-600">Admin not found</div>;
  }
  return (
    <div className="w-full px-3 sm:px-3 md:px-8 py-8 min-h-screen bg-neutral-50">
      <AdminProfile admin={admin} />
    </div>
  );
}
