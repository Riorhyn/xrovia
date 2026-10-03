import { ROUTES } from "./config";
import { ButtonLink, Container } from "./ui";

export function FinalCta({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="bg-slate-950 py-16 sm:py-24">
      <Container className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Start with your history</p>
        <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
          Build your professional record once. Keep building it for years.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          XROVIA gives that record one identity, one place to grow, and a way to share what you choose to make public.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={isAuthenticated ? ROUTES.dashboard : ROUTES.register} variant="inverse">
            {isAuthenticated ? "Open your XROVIA" : "Create your Professional ID"}
          </ButtonLink>
          {!isAuthenticated && (
            <ButtonLink href={ROUTES.login} variant="outlineInverse">
              Sign in
            </ButtonLink>
          )}
        </div>
      </Container>
    </section>
  );
}
