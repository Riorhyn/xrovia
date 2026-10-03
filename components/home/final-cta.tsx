import { ROUTES } from "./config";
import { ButtonLink, Container } from "./ui";

export function FinalCta({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="relative overflow-hidden border-t border-slate-800 bg-slate-950 py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
      <Container className="relative text-center">
        <p className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-blue-300">Your professional identity starts here</p>
        <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">Build your professional record once. Keep it with you as you grow.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">Create one Professional ID, add the work that matters, verify important details and share your record when you need it.</p>
        <div className="mt-9 flex justify-center"><ButtonLink href={isAuthenticated ? ROUTES.dashboard : ROUTES.register} variant="inverse"> {isAuthenticated ? "Open your Professional ID" : "Create your Professional ID"}</ButtonLink></div>
      </Container>
    </section>
  );
}