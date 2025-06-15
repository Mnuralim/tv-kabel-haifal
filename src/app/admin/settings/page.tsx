import { getSettings } from "@/actions/settings";
import { CompanySettings } from "./_components/company-settings";

export default async function SettingsPage() {
  const setting = await getSettings();
  if (!setting) {
    return <div className="text-center text-red-600">Settings not found</div>;
  }
  return (
    <div className="w-full px-3 sm:px-3 md:px-8 py-8 min-h-screen bg-neutral-50">
      <CompanySettings setting={setting} />
    </div>
  );
}
