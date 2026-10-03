import { ROUTES } from "./config";
import { ButtonLink, Container } from "./ui";

export function FinalCta({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="bg-slate-950 py-16 sm:py-24">
      <Container className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Your professional identity starts here</p>
        <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">Build your professional record once. Keep it with you as you grow.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">Create one Professional ID, add the work that matters, verify important details and share your record when you need it.</p>
        <div className="mt-8 flex justify-center"><ButtonLink href={isAuthenticated ? ROUTES.dashboard : ROUTES.register} variant="inverse" size="md">{isAuthenticated ? "Open your Professional ID" : "Create your Professional ID"}</ButtonLink></div>
      </Container>
    </section>
  );
}
