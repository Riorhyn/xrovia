import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { AdminUserActions } from "@/components/admin/AdminUserActions";

export const metadata = {
  title: "Users | XROVIA Admin",
};

export default async function AdminUsersPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      emailVerifiedAt: true,
      profile: {
        select: {
          professionalId: true,
          fullName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <Link href="/admin" className="text-sm font-semibold text-blue-600 hover:underline">
            ← Admin Console
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">XROVIA Users</h1>
          <p className="text-sm text-slate-500 mt-1">
            Registered accounts and account management.
          </p>
        </div>
        <div className="text-sm font-semibold text-slate-600">
          {users.length} registered user{users.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.4fr_1.4fr_1fr_1fr_120px] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wide">
          <div>Name</div>
          <div>Email</div>
          <div>XROVIA ID</div>
          <div>Joined</div>
          <div>Action</div>
        </div>

        {users.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            No registered users.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-1 md:grid-cols-[1.4fr_1.4fr_1fr_1fr_120px] gap-3 md:gap-4 px-6 py-5 items-center"
              >
                <div>
                  <div className="font-semibold text-slate-900">
                    {user.profile?.fullName || "No profile"}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {user.role === "ADMIN" ? "Administrator" : "Professional"}
                  </div>
                </div>
                <div className="text-sm text-slate-600 break-all">{user.email}</div>
                <div className="font-mono text-xs text-blue-600">
                  {user.profile?.professionalId || "—"}
                </div>
                <div>
                  <div className="text-sm text-slate-700">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs mt-1">
                    {user.emailVerifiedAt ? (
                      <span className="text-emerald-600 font-semibold">Email verified</span>
                    ) : (
                      <span className="text-amber-600 font-semibold">Email unverified</span>
                    )}
                  </div>
                </div>
                <AdminUserActions
                  userId={user.id}
                  isCurrentAdmin={user.id === session.userId}
                  isAdmin={user.role === "ADMIN"}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
