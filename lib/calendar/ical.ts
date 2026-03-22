import ical from "node-ical";
import { eachDayOfInterval } from "date-fns";

export async function importICalDates(url: string) {
  const calendar = await ical.async.fromURL(url);
  const dates = new Set<string>();

  Object.values(calendar).forEach((event) => {
    if (!("start" in event) || !("end" in event) || event.type !== "VEVENT") {
      return;
    }

    eachDayOfInterval({
      start: new Date(event.start),
      end: new Date(event.end),
    }).forEach((date) => {
      dates.add(date.toISOString().slice(0, 10));
    });
  });

  return Array.from(dates);
}
