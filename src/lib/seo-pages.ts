export type SeoLandingPage = {
  slug: string;
  title: string;
  description: string;
  heroTitle: string;
  heroIntro: string;
  primaryQuery: string;
  primaryCtaLabel: string;
  checklistTitle: string;
  checklist: string[];
  valueTitle: string;
  valuePoints: string[];
  faqTitle: string;
  faqAnswer: string;
  relatedSlugs: string[];
};

export const seoLandingPages: SeoLandingPage[] = [
  {
    slug: "drone-wind-forecast",
    title: "Drone Wind Forecast",
    description:
      "Check a drone wind forecast before takeoff with launch-ready wind, gust, visibility, and rain guidance in Skies Ready.",
    heroTitle: "Check your drone wind forecast before you leave the ground.",
    heroIntro:
      "Wind is one of the fastest ways a routine flight turns into a rough launch, unstable hover, or stressful return-to-home. This page helps drone pilots understand what to watch before they fly and how Skies Ready turns that forecast into a quick launch rating.",
    primaryQuery: "Enid, Oklahoma 73701",
    primaryCtaLabel: "Check live wind conditions",
    checklistTitle: "What to review in a drone wind forecast",
    checklist: [
      "Steady surface wind, because even moderate wind can feel stronger once you climb.",
      "Gust speed, which often matters more than the average wind shown in a normal weather app.",
      "Visibility and precipitation, since clear air and dry conditions still matter when wind looks acceptable.",
      "The next few forecast windows, so you can decide whether waiting an hour gives you a safer launch.",
    ],
    valueTitle: "How Skies Ready makes wind easier to judge",
    valuePoints: [
      "Compares wind and gusts in imperial units with a simple good, caution, or risky rating.",
      "Highlights the strongest risk factor so you know why a launch window is flagged.",
      "Lets you move from current conditions to the next 5 days without jumping between apps.",
    ],
    faqTitle: "What wind speed is too high for a drone?",
    faqAnswer:
      "That depends on the aircraft, your experience, and the mission. In general, lower wind is always easier, while higher gusts can create sudden stability and battery drain issues. Skies Ready helps you spot those risky windows quickly, but the pilot still needs to compare the forecast with FAA rules, manufacturer guidance, and real conditions on site.",
    relatedSlugs: [
      "drone-gust-forecast",
      "drone-weather-checker",
      "before-you-fly-drone-checklist",
    ],
  },
  {
    slug: "drone-weather-checker",
    title: "Drone Weather Checker",
    description:
      "Use a drone weather checker built for pilots to review wind, gusts, visibility, rain risk, cloud cover, and launch guidance before you fly.",
    heroTitle: "Use a drone weather checker that is built for takeoff decisions.",
    heroIntro:
      "Most weather apps tell you what the day feels like. Drone pilots need more than that. They need a fast way to check wind, gusts, visibility, clouds, and rain risk together before they drive out, unpack, and launch.",
    primaryQuery: "Enid, Oklahoma 73701",
    primaryCtaLabel: "Open the weather checker",
    checklistTitle: "What a useful drone weather checker should show",
    checklist: [
      "Current conditions for the launch area, not just broad regional weather.",
      "A plain-English risk rating that explains whether the window looks good, caution, or risky.",
      "Upcoming forecast windows so you can see whether waiting improves the flight.",
      "A quick reminder that weather is only part of the preflight decision and FAA airspace still matters.",
    ],
    valueTitle: "Why pilots use Skies Ready instead of a general weather app",
    valuePoints: [
      "The forecast is organized around launch decisions rather than generic daily weather.",
      "Wind, gust, visibility, and rain signals stay on one screen for faster preflight checks.",
      "Pro users can save launch locations and build a more repeatable workflow.",
    ],
    faqTitle: "Can a drone weather checker tell me if it is legal to fly?",
    faqAnswer:
      "No. Weather guidance is helpful, but it does not replace checking FAA airspace, LAANC authorization, Temporary Flight Restrictions, local rules, or Remote ID requirements. Skies Ready is designed to support the weather side of your preflight process, not replace legal flight checks.",
    relatedSlugs: [
      "is-it-safe-to-fly-my-drone-today",
      "drone-visibility-forecast",
      "before-you-fly-drone-checklist",
    ],
  },
  {
    slug: "is-it-safe-to-fly-my-drone-today",
    title: "Is It Safe to Fly My Drone Today?",
    description:
      "Find out if it is safe to fly your drone today by checking wind, gusts, rain risk, visibility, and simple launch guidance in Skies Ready.",
    heroTitle: "Wondering if it is safe to fly your drone today?",
    heroIntro:
      "That is one of the most common questions a drone pilot asks before leaving the house. Safe flights start with simple checks: how hard the wind is blowing, how sharp the gusts are, whether visibility is strong enough, and whether rain or storms could change the picture fast.",
    primaryQuery: "Enid, Oklahoma 73701",
    primaryCtaLabel: "Check today’s flight conditions",
    checklistTitle: "Questions to ask before you launch today",
    checklist: [
      "Is the current wind inside your comfort range for this aircraft and mission?",
      "Are gusts strong enough to affect stability, camera control, or return-to-home accuracy?",
      "Does visibility support safe line-of-sight flying and the kind of imagery you want?",
      "Could waiting for a later forecast window give you calmer or cleaner conditions?",
    ],
    valueTitle: "How Skies Ready helps answer the question faster",
    valuePoints: [
      "Shows a live launch rating instead of forcing you to interpret scattered weather numbers.",
      "Explains why a forecast is risky so the decision feels grounded and not random.",
      "Adds a five-day view for planning flights ahead of time, not just reacting in the moment.",
    ],
    faqTitle: "If the app says conditions look good, am I cleared to fly?",
    faqAnswer:
      "No. A favorable weather window does not mean you are cleared to fly. You still need to confirm airspace, authorizations, local restrictions, and the aircraft’s own operating limits. The pilot in command always keeps final responsibility.",
    relatedSlugs: [
      "drone-weather-checker",
      "drone-wind-forecast",
      "before-you-fly-drone-checklist",
    ],
  },
  {
    slug: "drone-gust-forecast",
    title: "Drone Gust Forecast",
    description:
      "Review a drone gust forecast before takeoff so sudden wind spikes do not catch you off guard during launch, hover, or return-to-home.",
    heroTitle: "A drone gust forecast can matter more than steady wind.",
    heroIntro:
      "Many pilots can handle a modest steady breeze, but gusts are what often make a flight feel unpredictable. A strong gust can change stability, braking, battery use, and camera smoothness even when the average wind looks manageable on paper.",
    primaryQuery: "Enid, Oklahoma 73701",
    primaryCtaLabel: "Check gust risk now",
    checklistTitle: "Why gusts deserve their own forecast check",
    checklist: [
      "Gusts can exceed the average wind by a wide margin and create sudden control changes.",
      "Return-to-home and exposed climbs often feel gusts more than sheltered low-altitude hover checks.",
      "High gust spreads can make safe launch timing much narrower than the hourly average suggests.",
      "Watching the next few forecast windows can reveal calmer gaps worth waiting for.",
    ],
    valueTitle: "What Skies Ready does with gust data",
    valuePoints: [
      "Surfaces gust speed right next to wind speed so you can compare both without extra taps.",
      "Uses gust thresholds inside the launch rating so windy windows are easier to spot.",
      "Keeps gust risk visible in both current conditions and the five-day planning section.",
    ],
    faqTitle: "Why do gusts feel worse than steady wind?",
    faqAnswer:
      "Steady wind is easier for both the pilot and the aircraft to compensate for. Gusts hit in bursts, which can create sharper control corrections, more battery draw, and less predictable footage. That is why gust forecasts are one of the most useful preflight checks for drone pilots.",
    relatedSlugs: [
      "drone-wind-forecast",
      "drone-weather-checker",
      "dji-air-3s-weather-limits",
    ],
  },
  {
    slug: "drone-visibility-forecast",
    title: "Drone Visibility Forecast",
    description:
      "Use a drone visibility forecast to check line-of-sight conditions, haze, and broader flight readability before you launch.",
    heroTitle: "Visibility matters when you need a clean and controlled drone flight.",
    heroIntro:
      "Good visibility supports safe line-of-sight flying, better orientation, and cleaner camera work. Even when wind looks acceptable, haze, low visibility, or incoming moisture can make a launch less comfortable and less professional than it first appears.",
    primaryQuery: "Enid, Oklahoma 73701",
    primaryCtaLabel: "Check visibility now",
    checklistTitle: "What to look for in a visibility forecast",
    checklist: [
      "A clear visibility number that helps you judge line-of-sight comfort.",
      "Rain chance and cloud cues that may explain changing visibility later in the day.",
      "Wind and gust context, because even clear air can still be a rough launch.",
      "A quick look at upcoming windows to see if a later flight will be clearer.",
    ],
    valueTitle: "How Skies Ready helps with visibility planning",
    valuePoints: [
      "Keeps visibility beside the other launch-critical signals instead of hiding it in a secondary screen.",
      "Shows whether the forecast still looks risky for another reason such as gusts or rain.",
      "Supports both quick checks before leaving home and deeper planning for weekend flights.",
    ],
    faqTitle: "Does strong visibility automatically mean good drone weather?",
    faqAnswer:
      "No. Visibility is only one part of the picture. A clear sky can still have high wind or strong gusts, and a legal flight area can still have weather that feels uncomfortable. The strongest decisions come from checking several weather factors together.",
    relatedSlugs: [
      "drone-weather-checker",
      "is-it-safe-to-fly-my-drone-today",
      "drone-gust-forecast",
    ],
  },
  {
    slug: "dji-air-3s-weather-limits",
    title: "DJI Air 3S Weather Limits",
    description:
      "Review DJI Air 3S weather limits with a practical preflight approach to wind, gust, visibility, and launch timing before you fly.",
    heroTitle: "Check DJI Air 3S weather limits before you launch.",
    heroIntro:
      "A capable drone still needs a smart pilot. If you fly a DJI Air 3S, weather checks should focus on the practical limits that affect stability, image quality, and confidence in the air, especially when wind and gusts change throughout the afternoon.",
    primaryQuery: "Enid, Oklahoma 73701",
    primaryCtaLabel: "Check Air 3S conditions",
    checklistTitle: "Useful weather checks for DJI Air 3S flights",
    checklist: [
      "Review both steady wind and gusts instead of relying on a single headline weather number.",
      "Check visibility and precipitation if you are planning camera work or a longer session.",
      "Watch the next few forecast windows because a slightly later launch can often feel much better.",
      "Always compare the forecast with DJI guidance, FAA rules, and your own flight experience.",
    ],
    valueTitle: "Why Skies Ready fits aircraft-specific planning",
    valuePoints: [
      "Makes it easy to compare the current window with the rest of the day for the same launch area.",
      "Helps experienced pilots add their own comfort range on top of a clear launch rating.",
      "Creates a stronger planning routine before battery charging, travel, and setup time.",
    ],
    faqTitle: "Does Skies Ready replace DJI operating guidance?",
    faqAnswer:
      "No. Skies Ready is weather-based guidance only. It does not replace DJI documentation, FAA rules, or pilot judgment. Use it to spot risky windows faster, then compare those signals with your aircraft’s recommendations and your own experience.",
    relatedSlugs: [
      "drone-wind-forecast",
      "drone-gust-forecast",
      "is-it-safe-to-fly-my-drone-today",
    ],
  },
  {
    slug: "drone-weather-enid-ok",
    title: "Drone Weather Enid OK",
    description:
      "Check drone weather in Enid, Oklahoma with wind, gust, visibility, and rain guidance built for preflight decisions in Skies Ready.",
    heroTitle: "Check drone weather in Enid, Oklahoma before you launch.",
    heroIntro:
      "Enid is already the default Skies Ready test and launch planning area, which makes it a natural place to start a local drone weather page. If you fly around Enid, Oklahoma 73701, this page points you straight to the forecast workflow built for that area.",
    primaryQuery: "Enid, Oklahoma 73701",
    primaryCtaLabel: "Check Enid forecast",
    checklistTitle: "What local Enid pilots can review quickly",
    checklist: [
      "Current wind, gust, visibility, and temperature for Enid, Oklahoma 73701.",
      "Upcoming forecast windows that may give you a better time to fly later today.",
      "A five-day outlook for planning shoots, recreational flights, and practice sessions.",
      "Weather-only launch guidance that should still be paired with FAA and local checks.",
    ],
    valueTitle: "Why a local landing page helps",
    valuePoints: [
      "Lets nearby pilots jump straight into a relevant forecast without retyping the same area.",
      "Creates a better search path for people looking for drone weather near Enid.",
      "Keeps the default launch workflow aligned with the site’s real starting location.",
    ],
    faqTitle: "Can I use this forecast if I fly outside Enid?",
    faqAnswer:
      "Yes. Skies Ready supports other cities, ZIP codes, and launch areas through the live search field. This page is simply the local entry point for Enid, Oklahoma and nearby users who want a faster way in.",
    relatedSlugs: [
      "drone-weather-checker",
      "before-you-fly-drone-checklist",
      "drone-wind-forecast",
    ],
  },
  {
    slug: "before-you-fly-drone-checklist",
    title: "Before You Fly Drone Checklist",
    description:
      "Use a before-you-fly drone checklist that covers weather, FAA checks, visibility, gusts, and launch readiness before every session.",
    heroTitle: "Use a before-you-fly drone checklist every time you launch.",
    heroIntro:
      "A quick checklist makes drone flying safer and more repeatable. Weather is a big part of that routine, but so are legal airspace checks, equipment readiness, and clear thinking about the flight you plan to make.",
    primaryQuery: "Enid, Oklahoma 73701",
    primaryCtaLabel: "Start the checklist with weather",
    checklistTitle: "Before-you-fly checklist for drone pilots",
    checklist: [
      "Check wind, gusts, visibility, temperature, and rain risk for the launch area.",
      "Review FAA airspace, LAANC authorization needs, TFRs, local rules, and Remote ID requirements.",
      "Confirm battery condition, firmware readiness, SD card space, and return-to-home settings.",
      "Decide whether the current window is good, caution, or risky and whether waiting will improve it.",
    ],
    valueTitle: "How Skies Ready fits into the checklist",
    valuePoints: [
      "It handles the weather decision fast so you can move into legal and equipment checks with confidence.",
      "The launch rating and why-risky explanation help you avoid second-guessing on site.",
      "Saved locations and longer-range planning give Pro users a more repeatable flight routine.",
    ],
    faqTitle: "Why use a checklist if I already know how to fly?",
    faqAnswer:
      "Even experienced pilots benefit from a consistent routine. Checklists reduce rushed decisions, missed airspace checks, and launch choices based on a single weather number. They are one of the simplest ways to make each flight more professional.",
    relatedSlugs: [
      "is-it-safe-to-fly-my-drone-today",
      "drone-weather-checker",
      "drone-weather-enid-ok",
    ],
  },
  {
    slug: "what-wind-speed-is-too-high-to-fly-a-drone",
    title: "What Wind Speed Is Too High to Fly a Drone?",
    description:
      "Learn how drone pilots should think about wind speed, gusts, comfort range, and launch timing before deciding whether to fly.",
    heroTitle: "What wind speed is too high to fly a drone?",
    heroIntro:
      "There is no one perfect number for every aircraft, pilot, and mission, but the question is still important. Wind speed affects stability, battery use, footage quality, and return-to-home performance, which is why many pilots check wind before they charge batteries and head out.",
    primaryQuery: "Enid, Oklahoma 73701",
    primaryCtaLabel: "Check your launch conditions now",
    checklistTitle: "How to judge wind more realistically",
    checklist: [
      "Start with steady wind, then check gusts because gusts often create the most stressful moments.",
      "Consider the aircraft, payload, flight altitude, and how exposed the launch site is.",
      "Compare current wind with the next few forecast windows, because waiting can change the decision.",
      "Treat the forecast as guidance only and compare it with FAA rules, manufacturer guidance, and the real conditions you see on site.",
    ],
    valueTitle: "Why Skies Ready helps with this question",
    valuePoints: [
      "Shows wind and gusts in the same launch workflow instead of making you compare separate weather screens.",
      "Adds a plain-English good, caution, or risky rating so the forecast feels easier to interpret.",
      "Helps you turn weather into a repeatable preflight habit instead of a last-minute guess.",
    ],
    faqTitle: "Should I only care about the average wind speed?",
    faqAnswer:
      "No. Average wind matters, but gusts often determine how stable the flight actually feels. A day with modest steady wind and sharp gust spikes can be harder than a day with slightly higher but more consistent airflow.",
    relatedSlugs: [
      "drone-wind-forecast",
      "drone-gust-forecast",
      "how-to-check-weather-before-flying-a-drone",
    ],
  },
  {
    slug: "drone-gusts-vs-wind-which-one-matters-more",
    title: "Drone Gusts vs Wind: Which One Matters More?",
    description:
      "Compare drone gusts vs steady wind and learn why gust spikes can affect stability, footage, and return-to-home more than the average breeze.",
    heroTitle: "Drone gusts vs wind: which one matters more?",
    heroIntro:
      "Both matter, but gusts often create the moments that feel hardest to manage. A steady breeze is usually easier for an aircraft to compensate for, while gusts can hit in bursts that change control feel, battery draw, and how smooth your footage looks.",
    primaryQuery: "Enid, Oklahoma 73701",
    primaryCtaLabel: "Check wind and gust risk",
    checklistTitle: "Why many pilots watch gusts closely",
    checklist: [
      "Gust spikes can exceed the average wind by a wide margin and create sudden corrections.",
      "Launch, climb, and return-to-home can all feel different when gusts are sharp and irregular.",
      "Even if the average wind looks acceptable, gusts can still turn a flight into a caution or risky window.",
      "Looking at multiple forecast windows can reveal calmer periods that are better for takeoff.",
    ],
    valueTitle: "How Skies Ready helps you compare both",
    valuePoints: [
      "Puts gust speed right beside wind speed so the difference is obvious.",
      "Uses launch thresholds that factor gusts into the overall rating.",
      "Keeps gust signals visible in current conditions and the five-day outlook.",
    ],
    faqTitle: "Can gusts matter even if the sky looks clear?",
    faqAnswer:
      "Yes. Clear skies do not guarantee calm flying. Some of the roughest-feeling sessions happen under bright skies with invisible gusty wind patterns, especially in open areas or around structures that disturb airflow.",
    relatedSlugs: [
      "drone-gust-forecast",
      "drone-wind-forecast",
      "is-it-safe-to-fly-my-drone-today",
    ],
  },
  {
    slug: "how-to-check-weather-before-flying-a-drone",
    title: "How to Check Weather Before Flying a Drone",
    description:
      "Learn how to check weather before flying a drone by reviewing wind, gusts, visibility, rain risk, clouds, and launch timing together.",
    heroTitle: "How to check weather before flying a drone",
    heroIntro:
      "A fast, repeatable weather check can save wasted trips and rough flights. The goal is not to stare at numbers forever. It is to review the conditions that matter most, decide whether the window looks good, caution, or risky, and then confirm the legal airspace side before launch.",
    primaryQuery: "Enid, Oklahoma 73701",
    primaryCtaLabel: "Check your launch conditions now",
    checklistTitle: "Simple preflight weather routine",
    checklist: [
      "Check steady wind and gusts first because they often drive the launch decision.",
      "Review visibility, clouds, and rain risk so you understand how readable the air really is.",
      "Look at the next few forecast windows instead of making the entire day ride on one snapshot.",
      "After weather, confirm FAA airspace, LAANC needs, TFRs, local rules, and Remote ID requirements.",
    ],
    valueTitle: "How Skies Ready shortens the process",
    valuePoints: [
      "Puts the most useful drone weather signals on one screen with a launch rating.",
      "Explains why a window is risky instead of leaving you to decode raw numbers alone.",
      "Helps you move from forecast review to real preflight decisions faster.",
    ],
    faqTitle: "What weather matters most for drone flying?",
    faqAnswer:
      "Wind and gusts are usually the first things pilots check, but visibility, precipitation, and cloud trends matter too. The best decisions come from reviewing them together instead of overreacting to one number in isolation.",
    relatedSlugs: [
      "drone-weather-checker",
      "before-you-fly-drone-checklist",
      "drone-weather-vs-airspace",
    ],
  },
  {
    slug: "drone-weather-vs-airspace",
    title: "Drone Weather vs Airspace: What Skies Ready Checks and What It Does Not",
    description:
      "Understand the difference between weather checks, B4UFLY airspace awareness, LAANC authorization, TFRs, and the pilot’s final responsibility.",
    heroTitle: "Drone weather vs airspace: what Skies Ready checks and what it does not.",
    heroIntro:
      "This is one of the most important trust questions on the site. Skies Ready checks weather risk. It does not authorize flight, replace FAA airspace tools, or guarantee that a location is legal to fly just because the weather looks good.",
    primaryQuery: "Enid, Oklahoma 73701",
    primaryCtaLabel: "Check weather risk now",
    checklistTitle: "How the responsibilities split",
    checklist: [
      "Skies Ready checks weather signals like wind, gusts, visibility, clouds, and rain risk.",
      "B4UFLY supports airspace awareness and helps pilots understand where extra care is needed.",
      "LAANC may be required near controlled airports when authorization applies.",
      "TFRs, local rules, and the pilot’s own judgment still need to be checked before launch.",
    ],
    valueTitle: "Why this distinction matters",
    valuePoints: [
      "It makes the product more honest and more useful because users know exactly what they are getting.",
      "It keeps weather planning in its lane instead of pretending to replace FAA compliance tools.",
      "It reinforces that the pilot remains responsible for the final decision.",
    ],
    faqTitle: "Do I still need B4UFLY if I use Skies Ready?",
    faqAnswer:
      "Yes. Skies Ready handles the weather side of preflight planning. B4UFLY, LAANC, TFR checks, local restrictions, and FAA compliance still need to be reviewed separately before every launch.",
    relatedSlugs: [
      "before-you-fly-drone-checklist",
      "how-to-check-weather-before-flying-a-drone",
      "drone-weather-checker",
    ],
  },
];

export function getSeoLandingPage(slug: string) {
  return seoLandingPages.find((page) => page.slug === slug);
}
