export function parseWhen(date: string, time: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const d = new Date(`${date}T${/^\d{2}:\d{2}$/.test(time) ? time : "00:00"}:00`);
  return isNaN(d.getTime()) ? null : d;
}

export function dateParts(date: string) {
  const d = parseWhen(date, "12:00");
  if (!d) return null;
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
    day: d.getDate(),
    month: d.toLocaleDateString("en-US", { month: "long" }),
    year: d.getFullYear(),
    long: d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    short: d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    dots: `${String(d.getDate()).padStart(2, "0")} . ${String(d.getMonth() + 1).padStart(2, "0")} . ${String(d.getFullYear()).slice(2)}`,
  };
}

export function fmtTime(t: string) {
  if (!/^\d{2}:\d{2}$/.test(t)) return t;
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return m ? `${hh}:${String(m).padStart(2, "0")} ${ap}` : `${hh} ${ap}`;
}

/** .ics calendar file for "Add to calendar". Floating local time (no timezone) on purpose. */
export function icsFile(o: { title: string; date: string; time: string; location: string; description: string; url: string }) {
  const start = parseWhen(o.date, o.time);
  if (!start) return "";
  const end = new Date(start.getTime() + 6 * 3600 * 1000);
  const f = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;
  const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ever After Invites//EN", "BEGIN:VEVENT",
    `UID:${f(start)}-${Math.random().toString(36).slice(2)}@everafter`,
    `DTSTAMP:${f(new Date())}`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`,
    `SUMMARY:${esc(o.title)}`, `LOCATION:${esc(o.location)}`, `DESCRIPTION:${esc(o.description)}`, `URL:${o.url}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}
