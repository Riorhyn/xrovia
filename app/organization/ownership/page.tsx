import { redirect } from "next/navigation";
import { getOrganizationAccess } from "@/lib/organization/access";
import OwnershipApplicationForm from "@/components/organization/OwnershipApplicationForm";

export const dynamic = "force-dynamic";

export default async function OrganizationOwnershipPage() {
  const access = await getOrganizationAccess();
  if (!access) redirect("/organization/login");

  const organization = {
    id: access.organization.id,
    name: access.organization.name,
    slug: access.organization.slug,
    type: access.organization.type,
    website: access.organization.website,
    officialEmailDomain: access.organization.officialEmailDomain,
    country: access.organization.country,
    status: access.organization.status,
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <OwnershipApplicationForm organization={organization} />
    </main>
  );
}
