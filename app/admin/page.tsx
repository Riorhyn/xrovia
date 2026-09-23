import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Users, FileWarning, Shield, CheckCircle } from "lucide-react";
import { AdminReportActions } from "@/components/admin/AdminReportActions";

export const metadata = {
  title: "Admin Console | PROVIA",
};

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const [userCount, profileCount, reports, benefits] = await Promise.all([
    prisma.user.count(),
    prisma.profile.count(),
    prisma.report.findMany({
      include: { profile: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.benefit.findMany({ take: 10 }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Authorized Administration</span>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">PROVIA Management Console</h1>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{userCount}</div>
            <div className="text-xs text-slate-500 font-medium">Registered Users</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{profileCount}</div>
            <div className="text-xs text-slate-500 font-medium">Professional Profiles</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <FileWarning className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{reports.length}</div>
            <div className="text-xs text-slate-500 font-medium">Reports Filed</div>
          </div>
        </div>
      </div>

      {/* Profile Reports Table */}
      <div className="flex flex-wrap gap-3">\n        <a href="/admin/users" className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Manage Users</a>\n      </div>\n\n      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900">Flagged Profiles & Reports</h2>
          <span className="text-xs text-slate-400">Server-Side Authorization Enforced</span>
        </div>

        {reports.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">No profile reports on file.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reports.map((r) => (
              <div key={r.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {r.profile.professionalId}
                    </span>
                    <span className="font-semibold text-sm text-slate-800">{r.profile.fullName}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-medium border border-rose-200">
                      {r.reason}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{r.details || "No additional comments"}</p>
                  <div className="text-[10px] text-slate-400 mt-1">Status: {r.status}</div>
                </div>

                <AdminReportActions reportId={r.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}