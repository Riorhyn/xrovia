import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3 } from "lucide-react";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.collaborationProject.findUnique({
    where: { id: params.id },
    include: {
      createdBy: { include: { profile: { select: { fullName: true, professionalId: true } } } },
      members: {
        where: { status: "CONFIRMED" },
        include: { user: { include: { profile: { select: { fullName: true, professionalId: true, headline: true, isPublic: true } } } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!project) notFound();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"><ArrowLeft className="h-4 w-4" /> XROVIA</Link>
        <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Professional Project</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{project.name}</h1>
              {project.description && <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{project.description}</p>}
            </div>
            <div className="shrink-0">
              {project.status === "TEAM_CONFIRMED" ? <CheckCircle2 className="h-6 w-6 text-emerald-600" aria-label="Team confirmed" /> : <Clock3 className="h-6 w-6 text-amber-500" aria-label="Self reported" />}
            </div>
          </div>
          <p className="mt-5 text-xs font-semibold text-slate-400">Status: {project.status.replaceAll("_", " ")}</p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <h2 className="text-lg font-black text-slate-900">Project Team</h2>
          <p className="mt-1 text-sm text-slate-500">Each person's contribution is recorded separately.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {project.members.map((member) => {
              const profile = member.user.profile;
              const content = (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-blue-100 hover:bg-blue-50/40">
                  <p className="text-sm font-black text-slate-900">{profile?.fullName || "Professional"}</p>
                  <p className="mt-1 text-xs font-bold text-blue-700">{member.role}</p>
                  {member.responsibility && <p className="mt-1.5 text-xs leading-5 text-slate-600">{member.responsibility}</p>}
                  {profile?.professionalId && <p className="mt-2 font-mono text-[10px] text-slate-400">{profile.professionalId}</p>}
                </div>
              );
              return profile?.isPublic && profile.professionalId ? (
                <Link key={member.id} href={"/" + profile.professionalId}>{content}</Link>
              ) : <div key={member.id}>{content}</div>;
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
