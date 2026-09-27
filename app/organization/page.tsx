import { redirect } from "next/navigation";
import { getOrganizationAccess } from "@/lib/organization/access";
import OrganizationDashboard from "@/components/organization/OrganizationDashboard";

export const dynamic = "force-dynamic";

export default async function OrganizationPage() {
  const access = await getOrganizationAccess();
  if (!access) redirect("/organization/login");
  return (
    <main className="min-h-screen bg-slate-50/80 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <OrganizationDashboard />
      </div>
    </main>
  );
}
