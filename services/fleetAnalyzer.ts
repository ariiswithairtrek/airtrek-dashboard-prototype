import { TowLog } from "../types";

const parseMinutes = (duration: string): number => parseInt(duration, 10) || 0;
const parseNumber = (value: string): number => parseFloat(value) || 0;

const formatMinutes = (total: number): string => {
  const m = Math.floor(total);
  const s = Math.round((total - m) * 60);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
};

const countBy = (logs: TowLog[], key: (log: TowLog) => string): Record<string, number> =>
  logs.reduce((acc, log) => {
    const k = key(log);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

const topEntry = (counts: Record<string, number>): [string, number] | null => {
  const entries = Object.entries(counts);
  if (entries.length === 0) return null;
  return entries.sort((a, b) => b[1] - a[1])[0];
};

// Lightweight, offline "fleet analyst". Answers common questions directly
// from the in-memory logs — no external API or key required.
export const analyzeFleetPerformance = async (logs: TowLog[], query: string): Promise<string> => {
  // Simulate a brief "thinking" delay so the typing indicator shows.
  await new Promise((resolve) => setTimeout(resolve, 500));

  const q = query.toLowerCase();

  if (logs.length === 0) {
    return "There are no tow logs to analyze right now.";
  }

  const durations = logs.map((l) => parseMinutes(l.duration));
  const totalMinutes = durations.reduce((a, b) => a + b, 0);
  const avgMinutes = totalMinutes / logs.length;

  // Total / count
  if (/(how many|number of|total|count)/.test(q) && /(tow|log|trip|operation)/.test(q)) {
    return `There are ${logs.length} tows in the current log set, totaling about ${formatMinutes(totalMinutes)} of towing time.`;
  }

  // Average duration
  if (/(average|avg|mean|typical)/.test(q) && /(time|duration|long)/.test(q)) {
    return `The average tow duration is ${formatMinutes(avgMinutes)} across ${logs.length} tows.`;
  }

  // Longest / shortest
  if (/(longest|slowest|max).*(tow|time|duration)|longest tow/.test(q)) {
    const longest = [...logs].sort((a, b) => parseMinutes(b.duration) - parseMinutes(a.duration))[0];
    return `The longest tow was ${longest.tailNumber} at ${longest.duration} (${longest.operator}, ${longest.dateTime}).`;
  }
  if (/(shortest|fastest|quickest|min).*(tow|time|duration)/.test(q)) {
    const shortest = [...logs].sort((a, b) => parseMinutes(a.duration) - parseMinutes(b.duration))[0];
    return `The shortest tow was ${shortest.tailNumber} at ${shortest.duration} (${shortest.operator}, ${shortest.dateTime}).`;
  }

  // Busiest / most active operator
  if (/(busiest|most active|top|best).*(operator|person|pilot)|who.*(most|busiest)/.test(q)) {
    const top = topEntry(countBy(logs, (l) => l.operator));
    return top
      ? `${top[0]} handled the most tows — ${top[1]} of ${logs.length}.`
      : "No operator data available.";
  }

  // List operators
  if (/(list|which|what|all).*(operator|crew|team)|operators?\??$/.test(q)) {
    const counts = countBy(logs, (l) => l.operator);
    const list = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, n]) => `${name} (${n})`)
      .join(", ");
    return `Operators on record: ${list}.`;
  }

  // Battery
  if (/(battery|charge|power)/.test(q)) {
    const withBattery = logs.filter((l) => l.details);
    if (withBattery.length === 0) return "No battery data is available in these logs.";
    const avgBattery =
      withBattery.reduce((a, l) => a + parseNumber(l.details!.batteryEnd), 0) / withBattery.length;
    const lowest = [...withBattery].sort(
      (a, b) => parseNumber(a.details!.batteryEnd) - parseNumber(b.details!.batteryEnd)
    )[0];
    return `Average end-of-tow battery is ${Math.round(avgBattery)}%. Lowest was ${lowest.tailNumber} at ${lowest.details!.batteryEnd}.`;
  }

  // Events / incidents
  if (/(event|incident|alert|warning|issue|safety)/.test(q)) {
    const totalEvents = logs.reduce((a, l) => a + (l.details?.events || 0), 0);
    const worst = [...logs]
      .filter((l) => l.details)
      .sort((a, b) => (b.details!.events || 0) - (a.details!.events || 0))[0];
    return `There were ${totalEvents} logged events in total. The most flagged tow was ${worst.tailNumber} with ${worst.details!.events} event(s).`;
  }

  // Distance
  if (/(distance|far|feet|ft|mileage|traveled|travelled)/.test(q)) {
    const withDistance = logs.filter((l) => l.details);
    const totalDistance = withDistance.reduce((a, l) => a + parseNumber(l.details!.distance), 0);
    return `Total distance towed is about ${totalDistance.toLocaleString()} ft across ${withDistance.length} tows.`;
  }

  // Tail-number lookup (e.g. "N412EF")
  const tailMatch = query.toUpperCase().match(/N\d{3}[A-Z]{2}/);
  if (tailMatch) {
    const log = logs.find((l) => l.tailNumber.toUpperCase() === tailMatch[0]);
    if (!log) return `I don't have a record for ${tailMatch[0]} in the current logs.`;
    const d = log.details;
    return d
      ? `${log.tailNumber}: ${log.duration} tow by ${log.operator} on ${log.dateTime}. Path ${d.path}, ${d.distance} at up to ${d.maxSpeed}, ${d.events} event(s), battery ended at ${d.batteryEnd}.`
      : `${log.tailNumber}: ${log.duration} tow by ${log.operator} on ${log.dateTime}.`;
  }

  // Operator-specific lookup (match a surname or initial from the query)
  const operatorMatch = logs.find((l) => {
    const last = l.operator.split(".").pop()?.trim().toLowerCase() || "";
    return last.length > 1 && q.includes(last);
  });
  if (operatorMatch) {
    const theirs = logs.filter((l) => l.operator === operatorMatch.operator);
    const mins = theirs.reduce((a, l) => a + parseMinutes(l.duration), 0);
    return `${operatorMatch.operator} ran ${theirs.length} tow(s), totaling ${formatMinutes(mins)}.`;
  }

  // Fallback: a quick summary plus guidance.
  const top = topEntry(countBy(logs, (l) => l.operator));
  return [
    `Here's a quick snapshot: ${logs.length} tows, average ${formatMinutes(avgMinutes)} each${top ? `, busiest operator ${top[0]} (${top[1]})` : ""}.`,
    `Try asking about average tow time, the busiest operator, battery levels, events, distance, or a specific tail number (e.g. ${logs[0].tailNumber}).`,
  ].join(" ");
};
