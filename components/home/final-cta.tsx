import { ROUTES } from "./config";
import { ButtonLink, Container } from "./ui";

export function FinalCta({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="bg-slate-900 py-16 sm:py-24">
      <Container className="text-center">
        <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-white [text-wrap:balance] sm:text-4xl lg:text-5xl">
          Start Building Your Professional Record Today.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-200">
          Get one Professional ID and keep your career information in one place.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {isAuthenticated ? (
            <>
              <ButtonLink href={ROUTES.dashboard} variant="inverse">
                Go to your dashboard
              </ButtonLink>
              <ButtonLink href={ROUTES.search} variant="outlineInverse">
                Search a Professional ID
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href={ROUTES.register} variant="inverse">
                Create Professional ID
              </ButtonLink>
              <ButtonLink href={ROUTES.login} variant="outlineInverse">
                Sign in
              </ButtonLink>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
