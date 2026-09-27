import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import OwnershipApplicationForm from "@/components/organization/OwnershipApplicationForm";

export const dynamic = "force-dynamic";

export default async function OrganizationClaimPage({ searchParams }: { searchParams: { slug?: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const slug = String(searchParams?.slug || "").trim();
  if (!slug) redirect("/organization");

  const organization = await prisma.organization.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, type: true, website: true, officialEmailDomain: true, country: true, status: true },
  });

  if (!organization) {
    return <main className="mx-auto max-w-2xl px-5 py-12"><div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Organization not found.</div></main>;
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <OwnershipApplicationForm organization={organization} />
    </main>
  );
}
