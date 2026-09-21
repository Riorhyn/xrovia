import { Check } from "lucide-react";
import { IdCardPreview } from "./id-card-preview";
import { Container } from "./ui";

const CARD_FIELDS = [
  { term: "Professional ID", detail: "The permanent number that identifies you, such as PR-159481." },
  { term: "Name and headline", detail: "Who you are and what you do, at a glance." },
  { term: "Primary focus", detail: "The main area your work centers on." },
  { term: "Core competencies", detail: "The skills you most want people to notice." },
  { term: "Career record highlights", detail: "Short keywords from your education, experience, skills and projects, with a count for each." },
  { term: "Public profile address", detail: "Where anyone with your ID can find your full profile." },
  { term: "QR area", detail: "Reserved for QR code sharing, which is coming soon." },
];

export function CardShowcase() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            A digital ID card for your professional identity
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-700">
            Your Professional ID sits at the center of a card that summarizes who you are
            professionally. Here is a preview of what a card can show.
          </p>
          <ul className="mt-8 space-y-4">
            {CARD_FIELDS.map((field) => (
              <li key={field.term} className="flex gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-800">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
                <p className="text-slate-700">
                  <span className="font-semibold text-slate-900">{field.term}.</span>{" "}
                  {field.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-lg">
          <IdCardPreview variant="full" />
        </div>
      </Container>
    </section>
  );
}