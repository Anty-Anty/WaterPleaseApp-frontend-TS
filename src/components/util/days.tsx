// --- Helper: safely format YYYY-MM-DD into "Mon 10" ---

export function formatDisplayDate(dateStr: string, locale: string = "en-US") {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d); // SAFE → no timezone shift
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
}

// --- Helper: add days and return Date of Next watering ---
// input: last watering date and number of days to next watering

export function addDays(dateStr: string | number, days: number) {
  if (!dateStr) return "";
  const [y, m, d] = String(dateStr).split("-").map(Number);
  const base = new Date(y, m - 1, d); // safe construction, no TZ issues
  base.setDate(base.getDate() + Number(days));

  // Format as "Sep 15"
  return base.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// --- Helper: days until next watering (negative = overdue) ---
// input: last watering date and number of days to next watering
// uses today's date
export function daysUntilNextWatering(
  lastWateredDate: string,
  daysToNextWatering: number
): number | null {
  if (!lastWateredDate || daysToNextWatering == null) return null;

  // parse last watered date safely
  const [y, m, d] = lastWateredDate.split("-").map(Number);
  const nextWateringDate = new Date(y, m - 1, d);
  nextWateringDate.setDate(
    nextWateringDate.getDate() + Number(daysToNextWatering)
  );
  nextWateringDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round(
    (nextWateringDate.getTime() - today.getTime()) / MS_PER_DAY
  );
}
