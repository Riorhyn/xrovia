import {
  Briefcase,
  FolderOpen,
  Globe,
  GraduationCap,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { SAMPLE_ID } from "./config";
import { QrVisual } from "./qr-visual";

type Variant = "compact" | "full";

/** Example data for illustration only. Not a real person or a verified record. */
const SAMPLE = {
  name: "Alex Morgan",
  initials: "AM",
  headline: "Structural engineer",
  location: "Toronto, Canada",
  focus: "Bridge and building design",
  competencies: ["Structural analysis", "AutoCAD", "Project planning", "Report writing"],
  /** Short highlight keywords for each record type, plus how many records exist. */
  record: [
    { label: "Education", highlight: "B.Eng, Civil Engineering", count: 2, icon: GraduationCap },
    { label: "Experience", highlight: "Design engineer, Site lead", count: 3, icon: Briefcase },
    { label: "Skills", highlight: "Analysis, drafting", count: 8, icon: Wrench },
    { label: "Projects", highlight: "Footbridge, Car park", count: 4, icon: FolderOpen },
  ] as { label: string; highlight: string; count: number; icon: LucideIcon }[],
};

/**
 * Visual preview of a digital ID card.
 * If your project already has a Digital ID Card component, use it instead
 * and delete this file.
 */
export function IdCardPreview({ variant = "full" }: { variant?: Variant }) {
  return (
    <figure className="w-full">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
        {/* Header strip with lanyard slot */}
        <div className="relative flex items-center justify-between bg-slate-900 px-5 pb-3 pt-5 text-white">
          <span
            aria-hidden
            className="absolute left-1/2 top-2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-slate-700"
          />
          <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span
              aria-hidden
              className="grid h-6 w-6 place-items-center rounded-md bg-blue-600 text-xs font-bold"
            >
              X
            </span>
            XROVIA
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium">
            Sample preview
          </span>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {/* Identity (left) and QR (right), like a physical ID badge */}
          <div className="flex items-center gap-4">
            <div
              aria-hidden
              className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-blue-100 text-lg font-semibold text-blue-800"
            >
              {SAMPLE.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-semibold text-slate-900">{SAMPLE.name}</p>
              <p className="truncate text-sm text-slate-700">{SAMPLE.headline}</p>
              <p className="truncate text-sm text-slate-600">{SAMPLE.location}</p>
            </div>
            <QrVisual className="h-16 w-16 shrink-0 rounded-md border border-slate-200 sm:h-20 sm:w-20" />
          </div>

          {/* Professional ID */}
          <div className="rounded-xl bg-blue-50 px-4 py-3">
            <p className="text-sm text-blue-900">Professional ID</p>
            <p className="text-3xl font-semibold tabular-nums tracking-wider text-blue-700">
              {SAMPLE_ID}
            </p>
          </div>

          {variant === "full" && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Primary focus</p>
                <p className="text-sm text-slate-700">{SAMPLE.focus}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Core competencies</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {SAMPLE.competencies.map((c) => (
                    <li
                      key={c}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Career record: a highlight keyword and a count for each record type */}
          <ul className="grid grid-cols-2 gap-3">
            {SAMPLE.record.map(({ label, highlight, count, icon: Icon }) => (
              <li
                key={label}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <Icon className="h-3.5 w-3.5 text-blue-700" aria-hidden />
                    {label}
                  </span>
                  <span className="text-lg font-semibold tabular-nums text-blue-700">
                    {count}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium leading-snug text-slate-900">
                  {highlight}
                </p>
              </li>
            ))}
          </ul>

          {/* Public profile address */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
            <span className="flex items-center gap-2 text-sm text-slate-700">
              <Globe className="h-4 w-4 text-blue-700" aria-hidden />
              Public profile
            </span>
            <span className="truncate text-sm font-semibold text-blue-700">/{SAMPLE_ID}</span>
          </div>

          {variant === "full" && (
            <p className="text-xs text-slate-600">QR sharing is coming soon.</p>
          )}
        </div>
      </div>
      <figcaption className="mt-3 text-center text-sm text-slate-600">
        Sample profile with example data.
      </figcaption>
    </figure>
  );
}