"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { Search, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { SAMPLE_ID } from "./config";
import { Button, Container, SectionHeader } from "./ui";

function normalizeId(raw: string): string | null {
  const value = raw.trim().toUpperCase();
  if (/^\d+$/.test(value)) return `PR-${value}`;
  if (/^PR-\d+$/.test(value)) return value;
  return null;
}

export function SearchId() {
  const router = useRouter();
  const inputId = useId();
  const errorId = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = normalizeId(value);
    if (!id) {
      setError(`Enter a Professional ID in this format: ${SAMPLE_ID}.`);
      return;
    }
    setError(null);
    router.push(`/${encodeURIComponent(id)}`);
  }

  function handleQuickFill(sampleId: string) {
    setValue(sampleId);
    setError(null);
  }

  return (
    <section id="search-id" className="scroll-mt-20 border-b border-slate-200/80 bg-white py-20 sm:py-28">
      <Container>
        <div className="grid gap-10 rounded-[2.5rem] border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6 shadow-sm sm:p-10 lg:grid-cols-[1fr_420px] lg:p-12">
          <div>
            <SectionHeader
              eyebrow="Identity Discovery"
              title="Lookup a verified Professional ID."
              description="Access authentic professional profiles by looking up the unique identifier shared by individuals or certified organizations."
            />

            <form onSubmit={onSubmit} noValidate className="mt-8 max-w-xl">
              <label htmlFor={inputId} className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Enter Professional ID
              </label>

              <div className="mt-2.5 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <input
                    id={inputId}
                    name="professionalId"
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    spellCheck={false}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={`e.g. ${SAMPLE_ID}`}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 font-mono text-base font-bold text-slate-900 shadow-sm placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                <Button type="submit" className="shrink-0 rounded-2xl sm:min-w-[130px]">
                  <Search className="h-4 w-4" /> Search
                </Button>
              </div>

              {error && <p id={errorId} role="alert" className="mt-2 text-xs font-semibold text-red-600">{error}</p>}

              {/* Sample ID Quick Fill Chips */}
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span className="font-medium">Try sample:</span>
                <button
                  type="button"
                  onClick={() => handleQuickFill(SAMPLE_ID)}
                  className="rounded-lg border border-blue-200 bg-blue-50/80 px-2.5 py-1 font-mono font-bold text-blue-700 hover:bg-blue-100 transition"
                >
                  {SAMPLE_ID}
                </button>
              </div>
            </form>
          </div>

          {/* Right Card Panel */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-slate-950">Public Record Safety</p>
                  <p className="text-xs text-slate-500">Owner-controlled public access</p>
                </div>
              </div>

              <ul className="mt-5 space-y-3 text-xs font-medium text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> View verified education and experience
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Inspect institutional validation status
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Access attached project evidence files
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
              Only public, user-permissioned record information is displayed upon lookup.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
