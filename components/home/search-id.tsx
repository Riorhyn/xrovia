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
    <section id="search-id" className="scroll-mt-20 border-b border-slate-200 bg-white py-20 sm:py-28">
      <Container>
        <div className="grid gap-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-10 lg:grid-cols-[1fr_420px] lg:p-12">
          <div>
            <SectionHeader
              eyebrow="Professional ID"
              title="An ID should lead to a record—not a dead-end number."
              description="Look up a public XROVIA profile using the Professional ID someone has chosen to share."
            />
            <form onSubmit={onSubmit} noValidate className="mt-9 max-w-xl">
              <label htmlFor={inputId} className="block text-sm font-bold text-slate-900">Professional ID</label>
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
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base tabular-nums text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                />
                <Button type="submit" className="shrink-0 sm:min-w-[125px]"><Search className="h-4 w-4" />Search</Button>
              </div>
              {error && <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-red-700">{error}</p>}
            </form>
          </div>

          <Surface className="bg-white">
            <div className="flex items-center gap-3">
              <IconBox><ShieldCheck className="h-5 w-5" /></IconBox>
              <div>
                <p className="text-sm font-bold text-slate-950">What you can see</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Only information the profile owner has made public.</p>
              </div>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              {["Open the public profile","See which information is self-added","See available verification status"].map(item => (
                <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 font-medium">{item}</div>
              ))}
            </div>
          </Surface>
        </div>
      </Container>
    </section>
  );
}