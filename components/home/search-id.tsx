"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { SAMPLE_ID } from "./config";
import { Container } from "./ui";

/** "pr-159481" -> "PR-159481", "159481" -> "PR-159481". Returns null if it doesn't look like an ID. */
function normalizeId(raw: string): string | null {
  const value = raw.trim().toUpperCase();
  if (/^\d+$/.test(value)) return `PR-${value}`;
  if (/^PR-\d+$/.test(value)) return value;
  return null;
}

/**
 * Sends the visitor to the real public profile route (/PR-xxxxxx).
 * If the ID does not exist, the profile route handles showing a 404.
 */
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
    <section id="search-id" className="scroll-mt-20 bg-slate-50 py-16 sm:py-24">
      <Container>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 lg:p-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Look up a public profile
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              Have someone&apos;s Professional ID? Enter it to open their public profile.
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate className="mt-8 max-w-xl">
            <label htmlFor={inputId} className="block text-sm font-medium text-slate-900">
              Professional ID
            </label>
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
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base tabular-nums text-slate-900 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-700"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <Search className="h-4 w-4" aria-hidden />
                Search
              </button>
            </div>
            {error && (
              <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-red-700">
                {error}
              </p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}