import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { getSeoLandingPage, seoLandingPages } from "@/lib/seo-pages";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return seoLandingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoLandingPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${page.slug}`,
    },
    openGraph: {
      title: `Skies Ready | ${page.title}`,
      description: page.description,
      url: `https://skiesready.com/${page.slug}`,
    },
  };
}

export default async function SeoLandingPageRoute({ params }: Props) {
  const { slug } = await params;
  const page = getSeoLandingPage(slug);

  if (!page) {
    notFound();
  }

  const relatedPages = page.relatedSlugs
    .map((relatedSlug) => getSeoLandingPage(relatedSlug))
    .filter((value): value is NonNullable<typeof value> => Boolean(value));
  const forecastHref = `/?query=${encodeURIComponent(page.primaryQuery)}`;

  return (
    <main className="app-shell">
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
              Skies Ready guide
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {page.heroTitle}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{page.heroIntro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
                href={forecastHref}
              >
                {page.primaryCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/[0.04]"
                href="/pricing"
              >
                View Pro features
              </Link>
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
              Weather-only guidance
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Before you fly</h2>
            <ul className="mt-5 space-y-3">
              <li className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-slate-300">
                Check FAA airspace and LAANC requirements.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-slate-300">
                Review Temporary Flight Restrictions and local rules.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-slate-300">
                Compare weather with your aircraft limits and pilot comfort range.
              </li>
            </ul>
            <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm leading-7 text-amber-50">
              Skies Ready provides weather-based flight guidance only. It does not authorize drone
              flights or replace FAA airspace checks.
            </div>
          </aside>
        </section>

        <section className="grid gap-6 pb-14 pt-10 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
              {page.checklistTitle}
            </p>
            <ul className="mt-5 space-y-4">
              {page.checklist.map((item) => (
                <li className="flex gap-3 text-sm leading-7 text-slate-300" key={item}>
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
              {page.valueTitle}
            </p>
            <div className="mt-5 space-y-4">
              {page.valuePoints.map((item) => (
                <div
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 pb-14 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
              Common question
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {page.faqTitle}
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300">{page.faqAnswer}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/[0.04]"
                href={forecastHref}
              >
                Open the live forecast
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/[0.04]"
                href="/support"
              >
                Read support and contact info
              </Link>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <div className="inline-flex rounded-2xl bg-cyan-400/12 p-3 text-cyan-200">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">Why this page exists</h2>
            <p className="mt-4 text-sm leading-8 text-slate-300">
              Search traffic usually starts with one specific question: wind, gusts, visibility,
              local conditions, or whether today looks flyable at all. These pages give each of
              those questions a dedicated answer while still leading back into the live Skies Ready
              forecast experience.
            </p>
          </article>
        </section>

        <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
                Related drone weather guides
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                Keep exploring launch questions pilots actually search for
              </h2>
            </div>
            <Link
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/[0.04]"
              href="/"
            >
              Back to Skies Ready home
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {relatedPages.map((relatedPage) => (
              <Link
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyan-300/30 hover:bg-white/[0.05]"
                href={`/${relatedPage.slug}`}
                key={relatedPage.slug}
              >
                <h3 className="text-lg font-semibold text-white">{relatedPage.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{relatedPage.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
