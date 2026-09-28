"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, Plus, Search, Users, ShieldCheck } from "lucide-react";

type Project = {
  id: string; name: string; description?: string | null; status: string;
  createdBy?: { profile?: { fullName: string; professionalId: string } | null };
  members: { id: string; userId: string; role: string; responsibility?: string | null; status: string; user?: { profile?: { fullName: string; professionalId: string } | null } }[];
};

type CollaborationRequest = {
  id: string; type: string; proposedRole?: string | null; proposedResponsibility?: string | null;
  proposedName?: string | null; status: string; project: { id: string; name: string };
  requester?: { id: string; profile?: { fullName: string; professionalId: string } | null };
  targetUser?: { id: string; profile?: { fullName: string; professionalId: string } | null };
};

export default function CollaborationsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [form, setForm] = useState({ name: "", description: "", responsibility: "" });
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [invite, setInvite] = useState({ role: "Member", responsibility: "" });
  const [external, setExternal] = useState({ name: "", email: "", role: "Member", responsibility: "" });
  const [message, setMessage] = useState("");

  const load = async () => {
    const [p, r] = await Promise.all([fetch("/api/collaborations/projects"), fetch("/api/collaborations/requests")]);
    if (p.ok) setProjects((await p.json()).projects || []);
    if (r.ok) setRequests((await r.json()).requests || []);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (search.trim().length < 2) { setUsers([]); return; }
      const res = await fetch("/api/collaborations/users?q=" + encodeURIComponent(search));
      if (res.ok) setUsers((await res.json()).users || []);
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/collaborations/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "Unable to create project.");
    setForm({ name: "", description: "", responsibility: "" });
    setShowCreate(false);
    setMessage("Project created. Your leadership is recorded as self-confirmed.");
    await load();
  };

  const sendRequest = async () => {
    if (!selectedProject || !selectedUser || !invite.responsibility.trim()) return;
    const res = await fetch("/api/collaborations/requests", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: selectedProject.id,
        type: "ROLE_PROPOSAL",
        targetUserId: selectedUser.id,
        proposedRole: invite.role,
        proposedResponsibility: invite.responsibility.trim(),
      }),
    });
    const data = await res.json();
    setMessage(res.ok ? "Collaboration request sent. The person must accept the relationship." : (data.error || "Unable to send request."));
    setSearch("");
    setUsers([]);
    setSelectedUser(null);
    setInvite({ role: "Member", responsibility: "" });
    await load();
  };

  const approve = async (id: string, decision: "APPROVE" | "REJECT") => {
    const res = await fetch("/api/collaborations/requests", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ requestId: id, decision }) });
    const data = await res.json();
    setMessage(res.ok ? "Request updated." : (data.error || "Unable to update request."));
    await load();
  };

  const sendExternal = async () => {
    if (!selectedProject || !external.name.trim()) return;
    const res = await fetch("/api/collaborations/requests", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: selectedProject.id, type: "ROLE_PROPOSAL", proposedName: external.name, proposedEmail: external.email, proposedRole: external.role, proposedResponsibility: external.responsibility }),
    });
    const data = await res.json();
    setMessage(res.ok ? "External collaborator recorded as a proposed relationship. They are not treated as a confirmed XROVIA member until they join and the relationship is approved." : (data.error || "Unable to record collaborator."));
    setExternal({ name: "", email: "", role: "Member", responsibility: "" });
    await load();
  };

  const isLeader = (p: Project) => p.members.some(m => m.role === "Team Leader" && m.status === "CONFIRMED");

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"><ArrowLeft className="h-4 w-4" /> Dashboard</Link>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Projects & Collaborations</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Connect professional profiles around real projects, responsibilities and verified team relationships.</p>
          </div>
          <button onClick={() => setShowCreate(!showCreate)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700"><Plus className="h-4 w-4" /> New Project</button>
        </div>

        {message && <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">{message}</div>}

        {showCreate && (
          <form onSubmit={createProject} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900">Create a project team</h2>
            <input required placeholder="Project name" value={form.name} onChange={e => setForm({...form,name:e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <textarea placeholder="Project description" value={form.description} onChange={e => setForm({...form,description:e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" rows={3} />
            <input placeholder="Your responsibility (e.g. System Integration & Coordination)" value={form.responsibility} onChange={e => setForm({...form,responsibility:e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <div className="flex gap-2"><button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white">Create Project</button><button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700">Cancel</button></div>
          </form>
        )}

        <section className="grid gap-5 lg:grid-cols-2">
          {projects.length === 0 && <div className="lg:col-span-2 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><Users className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-3 font-black text-slate-900">No project collaborations yet</h2><p className="mt-1 text-sm text-slate-500">Create a project and start connecting the people who actually worked on it.</p></div>}
          {projects.map(p => (
            <article key={p.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div><Link href={"/project/" + p.id} className="text-lg font-black text-slate-900 hover:text-blue-700">{p.name}</Link><p className="mt-1 text-xs font-semibold text-slate-400">{p.status.replaceAll("_"," ")}</p></div>
                {p.status === "TEAM_CONFIRMED" ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <Clock3 className="h-5 w-5 text-amber-500" />}
              </div>
              {p.description && <p className="mt-4 text-sm leading-6 text-slate-600">{p.description}</p>}
              <div className="mt-5 space-y-2">
                {p.members.map(m => <div key={m.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5"><div><p className="text-sm font-bold text-slate-800">{m.user?.profile?.fullName || "Member"}</p><p className="text-xs text-slate-500">{m.role}{m.responsibility ? " · " + m.responsibility : ""}</p></div>{m.status === "CONFIRMED" && <ShieldCheck className="h-4 w-4 text-emerald-600" />}</div>)}
              </div>
              {isLeader(p) && <button onClick={() => setSelectedProject(p)} className="mt-4 w-full rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100">Manage Team & Responsibilities</button>}
            </article>
          ))}
        </section>

        {selectedProject && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-black text-slate-900">Manage {selectedProject.name}</h2><p className="text-sm text-slate-500">Invite a person or propose their responsibility. Team relationships become confirmed only through the approval flow.</p></div><button onClick={() => setSelectedProject(null)} className="text-sm font-bold text-slate-500">Close</button></div>
            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Existing XROVIA professional</p>
              <div className="mt-3 grid gap-4 md:grid-cols-[1fr_180px_1fr]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or Professional ID" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm" />
                {users.length>0 && <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-xl">{users.map(u=><button type="button" key={u.id} onClick={()=>{setSelectedUser(u);setSearch(u.profile?.fullName || u.profile?.professionalId || "");setUsers([])}} className="block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-50"><p className="text-sm font-bold text-slate-800">{u.profile?.fullName}</p><p className="text-xs text-slate-500">{u.profile?.professionalId} · {u.profile?.headline || "Professional"}</p></button>)}</div>}
              </div>
              <select value={invite.role} onChange={e=>setInvite({...invite,role:e.target.value})} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option>Member</option><option>Mechanical Designer</option><option>Engineer</option><option>Developer</option><option>Researcher</option><option>Analyst</option><option>Project Manager</option><option>Coordinator</option><option>Faculty Advisor</option><option>Other</option></select>
              <input required value={invite.responsibility} onChange={e=>setInvite({...invite,responsibility:e.target.value})} placeholder="Responsibility *" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
            {selectedUser && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5">
                <div>
                  <p className="text-sm font-bold text-slate-900">Selected: {selectedUser.profile?.fullName || "Professional"}</p>
                  <p className="text-xs text-slate-500">{selectedUser.profile?.professionalId || "Professional ID"}</p>
                </div>
                <button type="button" disabled={!invite.responsibility.trim()} onClick={sendRequest} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Send Collaboration Request</button>
              </div>
            )}
            <p className="mt-2 text-xs text-slate-500">Select a professional first, then enter their role and responsibility. No relationship is created until the request is accepted and confirmed.</p>
            </div>
            <div className="mt-5 border-t border-slate-200 pt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Person not on XROVIA yet</p>
              <p className="mt-1 text-xs text-slate-500">Record the proposed relationship without creating a profile or claiming their identity.</p>
              <div className="mt-3 grid gap-3 md:grid-cols-4">
                <input value={external.name} onChange={e=>setExternal({...external,name:e.target.value})} placeholder="Full name" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
                <input value={external.email} onChange={e=>setExternal({...external,email:e.target.value})} placeholder="Email (optional)" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
                <input value={external.responsibility} onChange={e=>setExternal({...external,responsibility:e.target.value})} placeholder="Responsibility" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
                <button onClick={sendExternal} className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white">Record Proposed Member</button>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">Collaboration Requests</h2>
          <div className="mt-4 space-y-3">
            {requests.length === 0 && <p className="text-sm text-slate-500">No collaboration requests.</p>}
            {requests.map(r => <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"><div><p className="text-sm font-bold text-slate-900">{r.type.replaceAll("_"," ")}</p><p className="text-xs text-slate-500">{r.project.name} · {r.requester?.profile?.fullName || "Professional"}{r.proposedRole ? " · " + r.proposedRole : ""}{r.proposedResponsibility ? " · " + r.proposedResponsibility : ""}</p></div>{r.status === "PENDING" && <div className="flex gap-2"><button onClick={()=>approve(r.id,"APPROVE")} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white">Approve</button><button onClick={()=>approve(r.id,"REJECT")} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">Reject</button></div>}</div>)}
          </div>
        </section>
      </div>
    </main>
  );
}
