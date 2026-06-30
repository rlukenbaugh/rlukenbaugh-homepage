import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/30">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
              {siteConfig.name}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Live drone launch forecasting with protected accounts, recurring Pro billing, and
              operational weather checks in imperial units.
            </p>
          </div>
          <nav className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2 md:grid-cols-4">
            <Link className="hover:text-white" href="/support">
              Support
            </Link>
            <Link className="hover:text-white" href="/privacy">
              Privacy
            </Link>
            <Link className="hover:text-white" href="/terms">
              Terms
            </Link>
            <Link className="hover:text-white" href="/pricing">
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Support: {siteConfig.supportEmail}</p>
          <p>{siteConfig.domain.replace("https://", "")}</p>
        </div>
      </div>
    </footer>
  );
}
