"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { SAMPLE_ID } from "./config";
import { Container } from "./ui";

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
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Try the concept</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              A Professional ID should lead to a record—not a dead-end number.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              If you have someone's XROVIA Professional ID, you can look up the public profile they chose to share.
            </p>

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
                <button type="submit" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-base font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700">
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
              {error && <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-red-700">{error}</p>}
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
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
          </div>
        </div>
      </Container>
    </section>
  );
}
