import { ArrowRight } from "lucide-react";
import { ROUTES } from "./config";
import { ButtonLink, Container } from "./ui";

export function FinalCta({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      <Container className="relative text-center">
        <p className="text-xs font-black uppercase tracking-[.2em] text-blue-300">Start your record</p>
        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-[-.045em] text-white sm:text-5xl lg:text-6xl">Build it once. Keep it as you grow.</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">Create your Professional ID and start building the professional record you can carry forward.</p>
        <div className="mt-9 flex justify-center">
          <ButtonLink href={isAuthenticated ? ROUTES.dashboard : ROUTES.register} variant="inverse">
            Create your Professional ID <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}