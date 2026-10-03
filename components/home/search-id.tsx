"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { SAMPLE_ID } from "./config";
import { Button, Container, IconBox, SectionHeader, Surface } from "./ui";

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

  return (
    <section id="search-id" className="scroll-mt-20 border-t border-slate-200 bg-slate-50 py-16 sm:py-24">
      <Container>
        <div className="grid gap-10 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 lg:grid-cols-[1fr_420px] lg:p-12">
          <div>
            <SectionHeader eyebrow="Try the concept" title="A Professional ID should lead to a record—not a dead-end number." description="If you have someone's XROVIA Professional ID, you can look up the public profile they chose to share." />

            <form onSubmit={onSubmit} noValidate className="mt-8 max-w-xl">
              <label htmlFor={inputId} className="block text-sm font-semibold text-slate-900">Professional ID</label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
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
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base tabular-nums text-slate-900 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
                />
                <Button type="submit" className="shrink-0">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>
              {error && <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-red-700">{error}</p>}
            </form>
          </div>

          <Surface className="bg-slate-50 shadow-none">
            <div className="flex items-center gap-3">
              <IconBox>
                <ShieldCheck className="h-5 w-5" />
              </IconBox>
              <div>
                <p className="text-sm font-bold text-slate-950">What the ID is for</p>
                <p className="text-xs text-slate-500">A stable way to find a shared professional record.</p>
              </div>
            </div>
            <div className="mt-5 space-y-2 text-sm text-slate-600">
              <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">Open the public profile</div>
              <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">See which information is self-added</div>
              <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">See available verification status</div>
            </div>
          </Surface>
        </div>
      </Container>
    </section>
  );
}
