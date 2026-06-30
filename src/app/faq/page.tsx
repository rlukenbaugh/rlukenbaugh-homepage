import type { Metadata } from "next";
import Link from "next/link";

const faqItems = [
  {
    question: "Is it safe to fly my drone today?",
    answer:
      "Check wind, gusts, visibility, precipitation risk, and the next few forecast windows together. Skies Ready helps with that weather review, but the pilot still makes the final decision and must confirm airspace and legal requirements separately.",
  },
  {
    question: "What wind speed is too high for a drone?",
    answer:
      "There is no single perfect number for every drone or pilot. Steady wind, gusts, aircraft type, experience, and mission all matter. Skies Ready helps you compare those weather signals with a simple launch rating.",
  },
  {
    question: "Are gusts worse than steady wind?",
    answer:
      "Often yes. Steady wind is usually easier to manage than sharp gust spikes that create sudden control corrections, battery drain, and unstable footage.",
  },
  {
    question: "Does Skies Ready check FAA airspace?",
    answer:
      "No. Skies Ready checks weather risk only. It does not replace B4UFLY, LAANC, TFR checks, or other FAA and local rule reviews.",
  },
  {
    question: "Do I still need B4UFLY?",
    answer:
      "Yes. Weather and airspace are separate parts of the preflight decision. Even a good weather window can still be a place or time where flight is restricted.",
  },
  {
    question: "What weather matters most for drone flying?",
    answer:
      "Wind and gusts are usually the first checks, but visibility, precipitation, and cloud trends matter too. The best decisions come from checking all of them together.",
  },
  {
    question: "Can I fly a drone in cloudy weather?",
    answer:
      "Sometimes, yes, if the rest of the weather and legal conditions still support safe flight. Cloud cover alone is not enough to judge the launch.",
  },
  {
    question: "Can I fly a drone in light rain?",
    answer:
      "That depends on the aircraft and the actual conditions, but many pilots treat rain as a strong caution. Moisture can affect electronics, visibility, and safe operation quickly.",
  },
  {
    question: "What does risky mean in Skies Ready?",
    answer:
      "It means one or more forecast factors, such as wind, gusts, visibility, or precipitation potential, has moved into the higher-risk range used by the app.",
  },
  {
    question: "Can I set my own wind limits?",
    answer:
      "Not yet. Right now Skies Ready uses built-in launch thresholds. Custom pilot or aircraft thresholds are a strong future upgrade area.",
  },
];

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Read the Skies Ready drone weather FAQ covering wind, gusts, visibility, rain risk, FAA airspace questions, and how to use the forecast checker.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Skies Ready FAQ",
    description:
      "Answers to common drone weather and preflight questions about wind, gusts, visibility, rain, airspace checks, and launch risk.",
    url: "https://skiesready.com/faq",
  },
};

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="app-shell">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link className="text-sm font-semibold text-cyan-200 hover:text-cyan-100" href="/">
            {"<- Back to home"}
          </Link>
          <Link
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/[0.04]"
            href="/pricing"
          >
            View Pro
          </Link>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
            Frequently asked questions
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Drone weather and launch-planning FAQ
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            These are the common questions pilots ask before they fly. Each answer is short on
            fluff and built to point you back toward a real weather check.
          </p>
        </section>

        <section className="mt-8 grid gap-4">
          {faqItems.map((item) => (
            <article
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur"
              key={item.question}
            >
              <h2 className="text-xl font-semibold text-white">{item.question}</h2>
              <p className="mt-3 max-w-4xl text-sm leading-8 text-slate-300">{item.answer}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
          <h2 className="text-2xl font-semibold text-white">Ready to check your launch conditions?</h2>
          <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-300">
            Open the live forecast checker for wind, gusts, visibility, cloud cover, and rain risk
            before you decide whether today looks flyable.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              href="/?query=Enid%2C%20Oklahoma%2073701"
            >
              Check your launch conditions now
            </Link>
            <Link
              className="rounded-2xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/[0.04]"
              href="/drone-weather-vs-airspace"
            >
              Read weather vs airspace
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
