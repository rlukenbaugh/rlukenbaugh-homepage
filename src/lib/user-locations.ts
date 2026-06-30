import { isClerkConfigured } from "@/lib/site";

export type LocationEntry = {
  query: string;
  label: string;
  lastViewedAt: string;
  savedAt: string | null;
};

export type LocationLibrary = {
  saved: LocationEntry[];
  history: LocationEntry[];
};

const MAX_SAVED_LOCATIONS = 6;
const MAX_LOCATION_HISTORY = 8;

function normalizeEntry(raw: unknown): LocationEntry | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const candidate = raw as Partial<LocationEntry>;
  const query = candidate.query?.trim();
  const label = candidate.label?.trim();
  const lastViewedAt = candidate.lastViewedAt?.trim();

  if (!query || !label || !lastViewedAt) {
    return null;
  }

  return {
    query,
    label,
    lastViewedAt,
    savedAt: candidate.savedAt?.trim() || null,
  };
}

function sortNewestFirst(entries: LocationEntry[]) {
  return entries.sort(
    (left, right) =>
      new Date(right.lastViewedAt).getTime() - new Date(left.lastViewedAt).getTime(),
  );
}

function normalizeLibrary(raw: unknown): LocationLibrary {
  const value = typeof raw === "object" && raw ? (raw as Partial<LocationLibrary>) : {};

  const saved = Array.isArray(value.saved)
    ? sortNewestFirst(value.saved.map(normalizeEntry).filter(Boolean) as LocationEntry[]).slice(
        0,
        MAX_SAVED_LOCATIONS,
      )
    : [];

  const history = Array.isArray(value.history)
    ? sortNewestFirst(value.history.map(normalizeEntry).filter(Boolean) as LocationEntry[]).slice(
        0,
        MAX_LOCATION_HISTORY,
      )
    : [];

  return { saved, history };
}

function upsertEntry(entries: LocationEntry[], input: LocationEntry, limit: number) {
  const key = input.query.toLowerCase();
  const next = entries.filter((entry) => entry.query.toLowerCase() !== key);
  next.unshift(input);
  return next.slice(0, limit);
}

async function getUserForMutation(userId: string) {
  const { clerkClient } = await import("@clerk/nextjs/server");
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  return { client, user };
}

export async function getViewerLocationLibrary() {
  if (!isClerkConfigured()) {
    return null;
  }

  const { currentUser } = await import("@clerk/nextjs/server");
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const root = user.privateMetadata as Record<string, unknown>;
  return normalizeLibrary(root.locationLibrary);
}

async function updateLocationLibrary(
  userId: string,
  updater: (current: LocationLibrary) => LocationLibrary,
) {
  if (!isClerkConfigured()) {
    throw new Error("Clerk is not configured");
  }

  const { client, user } = await getUserForMutation(userId);
  const privateMetadata = user.privateMetadata as Record<string, unknown>;
  const current = normalizeLibrary(privateMetadata.locationLibrary);
  const next = updater(current);

  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      ...privateMetadata,
      locationLibrary: next,
    },
  });

  return next;
}

export async function recordLocationHistory(
  userId: string,
  input: {
    query: string;
    label: string;
  },
) {
  const now = new Date().toISOString();

  return updateLocationLibrary(userId, (current) => {
    const historyEntry: LocationEntry = {
      query: input.query.trim(),
      label: input.label.trim(),
      lastViewedAt: now,
      savedAt: null,
    };

    const savedMatch = current.saved.find(
      (entry) => entry.query.toLowerCase() === historyEntry.query.toLowerCase(),
    );

    const history = upsertEntry(
      current.history,
      {
        ...historyEntry,
        savedAt: savedMatch?.savedAt || null,
      },
      MAX_LOCATION_HISTORY,
    );

    const saved = savedMatch
      ? upsertEntry(
          current.saved,
          {
            ...savedMatch,
            label: historyEntry.label,
            lastViewedAt: now,
          },
          MAX_SAVED_LOCATIONS,
        )
      : current.saved;

    return { saved, history };
  });
}

export async function saveLocation(
  userId: string,
  input: {
    query: string;
    label: string;
  },
) {
  const now = new Date().toISOString();

  return updateLocationLibrary(userId, (current) => {
    const entry: LocationEntry = {
      query: input.query.trim(),
      label: input.label.trim(),
      lastViewedAt: now,
      savedAt: now,
    };

    return {
      saved: upsertEntry(current.saved, entry, MAX_SAVED_LOCATIONS),
      history: upsertEntry(current.history, entry, MAX_LOCATION_HISTORY),
    };
  });
}

export async function removeSavedLocation(userId: string, query: string) {
  return updateLocationLibrary(userId, (current) => ({
    saved: current.saved.filter(
      (entry) => entry.query.toLowerCase() !== query.trim().toLowerCase(),
    ),
    history: current.history.map((entry) =>
      entry.query.toLowerCase() === query.trim().toLowerCase()
        ? { ...entry, savedAt: null }
        : entry,
    ),
  }));
}
