"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Globe2,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

type ProjectMember = {
  id: string;
  userId: string;
  role: string;
  responsibility?: string | null;
  status: string;
  user?: {
    profile?: {
      fullName: string;
      professionalId: string;
      headline?: string | null;
      isPublic?: boolean;
    } | null;
  };
};

type Project = {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  createdBy?: {
    profile?: { fullName: string; professionalId: string } | null;
  };
  members: ProjectMember[];
};

type CollaborationRequest = {
  id: string;
  type: string;
  proposedRole?: string | null;
  proposedResponsibility?: string | null;
  proposedName?: string | null;
  proposedEmail?: string | null;
  status: string;
  canReview?: boolean;
  targetAccepted?: boolean;
  targetRejected?: boolean;
  project: { id: string; name: string };
  requester?: {
    id: string;
    profile?: { fullName: string; professionalId: string } | null;
  };
  targetUser?: {
    id: string;
    profile?: { fullName: string; professionalId: string } | null;
  };
};

type UserResult = {
  id: string;
  profile?: {
    fullName: string;
    professionalId: string;
    headline?: string | null;
  } | null;
};

const roleOptions = [
  "Member",
  "Mechanical Designer",
  "Engineer",
  "Developer",
  "Researcher",
  "Analyst",
  "Project Manager",
  "Coordinator",
  "Faculty Advisor",
  "Other",
];

export default function CollaborationsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [form, setForm] = useState({ name: "", description: "", responsibility: "" });
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserResult[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [invite, setInvite] = useState({ role: "Member", responsibility: "" });
  const [advisor, setAdvisor] = useState({
    role: "Faculty Advisor",
    responsibility: "Project guidance and technical review",
  });
  const [external, setExternal] = useState({
    name: "",
    email: "",
    role: "Member",
    responsibility: "",
  });
  const [message, setMessage] = useState("");

  const load = async () => {
    const [p, r] = await Promise.all([
      fetch("/api/collaborations/projects"),
      fetch("/api/collaborations/requests"),
    ]);
    if (p.ok) setProjects((await p.json()).projects || []);
    if (r.ok) setRequests((await r.json()).requests || []);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search.trim().length < 2) {
        setUsers([]);
        return;
      }

      const res = await fetch(
        "/api/collaborations/users?q=" + encodeURIComponent(search)
      );
      if (res.ok) setUsers((await res.json()).users || []);
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  const createProject = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await fetch("/api/collaborations/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Unable to create project.");
      return;
    }

    setForm({ name: "", description: "", responsibility: "" });
    setShowCreate(false);
    setMessage("Project created. Your leadership is recorded as self-confirmed.");
    await load();
  };

  const sendRequest = async () => {
    if (!selectedProject || !selectedUser || !invite.responsibility.trim()) return;

    const res = await fetch("/api/collaborations/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: selectedProject.id,
        type: "ROLE_PROPOSAL",
        targetUserId: selectedUser.id,
        proposedRole: invite.role,
        proposedResponsibility: invite.responsibility.trim(),
      }),
    });

    const data = await res.json();

    setMessage(
      res.ok
        ? "Collaboration request sent. The person must accept the relationship."
        : data.error || "Unable to send request."
    );

    setSearch("");
    setUsers([]);
    setSelectedUser(null);
    setInvite({ role: "Member", responsibility: "" });
    await load();
  };

  const sendAdvisorRequest = async () => {
    if (!selectedProject || !selectedUser) return;

    const res = await fetch("/api/collaborations/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: selectedProject.id,
        type: "ADVISOR_ASSOCIATION",
        targetUserId: selectedUser.id,
        proposedRole: advisor.role,
        proposedResponsibility: advisor.responsibility.trim(),
      }),
    });

    const data = await res.json();

    setMessage(
      res.ok
        ? "Advisor request sent. All required participants must approve the association."
        : data.error || "Unable to send advisor request."
    );

    setSearch("");
    setUsers([]);
    setSelectedUser(null);
    await load();
  };

  const approve = async (id: string, decision: "APPROVE" | "REJECT") => {
    const res = await fetch("/api/collaborations/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: id, decision }),
    });

    const data = await res.json();

    setMessage(
      res.ok
        ? data.message || "Request updated."
        : data.error || "Unable to update request."
    );

    await load();
  };

  const sendExternal = async () => {
    if (!selectedProject || !external.name.trim()) return;

    const res = await fetch("/api/collaborations/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: selectedProject.id,
        type: "ROLE_PROPOSAL",
        proposedName: external.name,
        proposedEmail: external.email,
        proposedRole: external.role,
        proposedResponsibility: external.responsibility,
      }),
    });

    const data = await res.json();

    setMessage(
      res.ok
        ? "External collaborator recorded as a proposed relationship."
        : data.error || "Unable to record collaborator."
    );

    setExternal({ name: "", email: "", role: "Member", responsibility: "" });
    await load();
  };

  const isLeader = (project: Project) =>
    project.members.some(
      (member) =>
        member.role === "Team Leader" &&
        member.status === "CONFIRMED"
    );

  const selectedRequests = useMemo(
    () =>
      selectedProject
        ? requests.filter((request) => request.project.id === selectedProject.id)
        : [],
    [requests, selectedProject]
  );

  const confirmedMembers = selectedProject?.members.filter(
    (member) => member.status === "CONFIRMED"
  ) || [];

  const initials = (name?: string | null) =>
    (name || "X")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  return (
    <main className="min-h-screen bg-slate-50/80 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-blue-50 blur-3xl"
          />
          <div className="relative">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>

            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700">
                  New Feature
                </span>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Projects & Collaborations
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Connect professional profiles around real projects,
                  responsibilities and verified team relationships.
                </p>
              </div>

              <button
                onClick={() => setShowCreate(!showCreate)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                New Project
              </button>
            </div>
          </div>
        </section>

        {message && (
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
            <span>{message}</span>
            <button
              onClick={() => setMessage("")}
              className="shrink-0 text-blue-500 hover:text-blue-800"
              aria-label="Dismiss message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {showCreate && (
          <form
            onSubmit={createProject}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Create Project
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-900">
                  Start a new project team
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <input
                required
                placeholder="Project name"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              />
              <textarea
                placeholder="Project description"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                rows={3}
              />
              <input
                placeholder="Your responsibility (e.g. System Integration & Coordination)"
                value={form.responsibility}
                onChange={(event) =>
                  setForm({ ...form, responsibility: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
                Create Project
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Your work
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-900">
                My Projects
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {projects.length} project{projects.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {projects.length === 0 && (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center lg:col-span-2">
                <Users className="mx-auto h-10 w-10 text-slate-300" />
                <h2 className="mt-3 font-black text-slate-900">
                  No project collaborations yet
                </h2>
                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                  Create a project and start connecting the people who actually
                  worked on it.
                </p>
              </div>
            )}

            {projects.map((project) => {
              const leader =
                project.members.find(
                  (member) =>
                    member.role === "Team Leader" &&
                    member.status === "CONFIRMED"
                ) || project.members[0];

              return (
                <article
                  key={project.id}
                  className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={"/project/" + project.id}
                          className="text-lg font-black text-slate-950 hover:text-blue-700"
                        >
                          {project.name}
                        </Link>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          {project.status.replaceAll("_", " ")}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {project.description || "Project details and team collaboration."}
                      </p>
                    </div>

                    {project.status === "TEAM_CONFIRMED" ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    ) : (
                      <Clock3 className="h-5 w-5 shrink-0 text-amber-500" />
                    )}
                  </div>

                  {leader && (
                    <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">
                        {initials(leader.user?.profile?.fullName)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900">
                          {leader.user?.profile?.fullName || "Team Leader"}
                        </p>
                        <p className="text-xs text-slate-500">
                          Team Leader
                          {leader.responsibility
                            ? " · " + leader.responsibility
                            : ""}
                        </p>
                      </div>
                      <ShieldCheck className="ml-auto h-4 w-4 shrink-0 text-emerald-600" />
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.members
                      .filter((member) => member.status === "CONFIRMED")
                      .slice(0, 5)
                      .map((member) => (
                        <span
                          key={member.id}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
                        >
                          {member.user?.profile?.fullName || "Member"}
                        </span>
                      ))}
                  </div>

                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    {isLeader(project) && (
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                      >
                        <Users className="h-4 w-4" />
                        Manage Team & Responsibilities
                      </button>
                    )}
                    <Link
                      href={"/project/" + project.id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      Public Project
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {selectedProject && (
          <section className="scroll-mt-24 rounded-[2rem] border border-blue-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Project Details
                </span>
                <h2 className="mt-1 text-xl font-black text-slate-900">
                  {selectedProject.name}
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Build the team, assign responsibilities and keep every
                  professional relationship explicit.
                </p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-black text-slate-900">
                    Team Members
                  </h3>
                </div>

                <div className="mt-4 space-y-2">
                  {confirmedMembers.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No confirmed members yet.
                    </p>
                  )}

                  {confirmedMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-black text-blue-700">
                        {initials(member.user?.profile?.fullName)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {member.user?.profile?.fullName || "Professional"}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {member.role}
                          {member.responsibility
                            ? " · " + member.responsibility
                            : ""}
                        </p>
                      </div>
                      <ShieldCheck className="ml-auto h-4 w-4 shrink-0 text-emerald-600" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-black text-slate-900">
                    Add Team Member
                  </h3>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Search a Professional ID or name. The person must accept
                  before the project leader can confirm the relationship.
                </p>

                <div className="relative mt-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name or Professional ID"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  />

                  {users.length > 0 && (
                    <div className="absolute z-30 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                      {users.map((user) => (
                        <button
                          type="button"
                          key={user.id}
                          onClick={() => {
                            setSelectedUser(user);
                            setSearch(
                              user.profile?.fullName ||
                                user.profile?.professionalId ||
                                ""
                            );
                            setUsers([]);
                          }}
                          className="block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-50"
                        >
                          <p className="text-sm font-bold text-slate-800">
                            {user.profile?.fullName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {user.profile?.professionalId} ·{" "}
                            {user.profile?.headline || "Professional"}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedUser && (
                  <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                    <p className="text-sm font-bold text-slate-900">
                      Selected: {selectedUser.profile?.fullName || "Professional"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {selectedUser.profile?.professionalId}
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <select
                        value={invite.role}
                        onChange={(event) =>
                          setInvite({ ...invite, role: event.target.value })
                        }
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      >
                        {roleOptions.map((role) => (
                          <option key={role}>{role}</option>
                        ))}
                      </select>
                      <input
                        value={invite.responsibility}
                        onChange={(event) =>
                          setInvite({
                            ...invite,
                            responsibility: event.target.value,
                          })
                        }
                        placeholder="Responsibility *"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={!invite.responsibility.trim()}
                      onClick={sendRequest}
                      className="mt-3 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Send Collaboration Request
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-black text-slate-900">
                    Advisor / Professor Approval
                  </h3>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Add a mentor or professor. The association is confirmed only
                  after every required participant approves it.
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <select
                    value={advisor.role}
                    onChange={(event) =>
                      setAdvisor({ ...advisor, role: event.target.value })
                    }
                    className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  >
                    <option>Faculty Advisor</option>
                    <option>Project Mentor</option>
                    <option>Research Advisor</option>
                  </select>
                  <input
                    value={advisor.responsibility}
                    onChange={(event) =>
                      setAdvisor({
                        ...advisor,
                        responsibility: event.target.value,
                      })
                    }
                    className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                    placeholder="Advisor responsibility"
                  />
                </div>

                <button
                  type="button"
                  disabled={!selectedUser}
                  onClick={sendAdvisorRequest}
                  className="mt-3 w-full rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send Advisor Approval Request
                </button>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-black text-slate-900">
                    External Collaborator
                  </h3>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Record someone who is not on XROVIA without creating or
                  claiming an identity for them.
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input
                    value={external.name}
                    onChange={(event) =>
                      setExternal({ ...external, name: event.target.value })
                    }
                    placeholder="Full name"
                    className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  />
                  <input
                    value={external.email}
                    onChange={(event) =>
                      setExternal({ ...external, email: event.target.value })
                    }
                    placeholder="Email (optional)"
                    className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  />
                  <input
                    value={external.responsibility}
                    onChange={(event) =>
                      setExternal({
                        ...external,
                        responsibility: event.target.value,
                      })
                    }
                    placeholder="Responsibility"
                    className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  />
                  <button
                    type="button"
                    disabled={!external.name.trim()}
                    onClick={sendExternal}
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Record Proposed Member
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Public Project Preview
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Share the project and its confirmed team with the world.
                  </p>
                </div>
                <Link
                  href={"/project/" + selectedProject.id}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
                >
                  View Public Project
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-100 bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Team
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {confirmedMembers.length} confirmed
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {selectedProject.status.replaceAll("_", " ")}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Requests
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {selectedRequests.length} active
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Collaboration Requests
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-900">
                Build the team step by step
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Accept, reject and confirm professional relationships before
                they appear as confirmed project members.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {requests.length} active
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {requests.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-7 text-center text-sm text-slate-500">
                No active collaboration requests.
              </div>
            )}

            {requests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-black text-slate-900">
                      {request.type.replaceAll("_", " ")}
                    </p>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                      Pending
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {request.project.name} ·{" "}
                    {request.requester?.profile?.fullName || "Professional"}
                    {request.targetUser?.profile?.fullName
                      ? " → " + request.targetUser.profile.fullName
                      : ""}
                    {request.proposedRole
                      ? " · " + request.proposedRole
                      : ""}
                    {request.proposedResponsibility
                      ? " · " + request.proposedResponsibility
                      : ""}
                  </p>

                  {request.type === "ROLE_PROPOSAL" && (
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {request.targetAccepted
                        ? "Collaborator accepted — waiting for project leader confirmation."
                        : request.targetRejected
                          ? "Collaborator rejected the proposed relationship."
                          : "Waiting for collaborator to accept the request."}
                    </p>
                  )}
                </div>

                {request.status === "PENDING" && request.canReview && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      disabled={
                        request.type === "ROLE_PROPOSAL" &&
                        !request.targetAccepted &&
                        !!request.targetUser
                      }
                      onClick={() => approve(request.id, "APPROVE")}
                      className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {request.type === "ROLE_PROPOSAL"
                        ? request.targetAccepted
                          ? "Confirm Member"
                          : "Accept"
                        : "Approve"}
                    </button>
                    <button
                      onClick={() => approve(request.id, "REJECT")}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ShieldCheck,
              title: "Verified Profiles",
              text: "Work with real XROVIA members.",
            },
            {
              icon: Users,
              title: "Build Teams",
              text: "Find the right people for your projects.",
            },
            {
              icon: UserPlus,
              title: "Manage Roles",
              text: "Keep responsibilities explicit and organized.",
            },
            {
              icon: Globe2,
              title: "Go Public",
              text: "Showcase confirmed project work.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-black text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {item.text}
                </p>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
