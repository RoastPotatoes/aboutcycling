import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(date);
}

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).length;
  const readingTimeMinutes = ((wordCount / 200) + 1).toFixed();
  return `${readingTimeMinutes} min read`;
}

// src/lib/utils.ts

export function dateRange(dateStart?: string, dateEnd?: string): string {
  const start = dateStart ? new Date(dateStart).toLocaleString() : 'Unknown start date';
  const end = dateEnd ? new Date(dateEnd).toLocaleString() : 'Present';

  // If both dates are available
  if (dateStart && dateEnd) {
    return `${start} - ${end}`;
  }

  // If only the start date is available
  if (dateStart) {
    return `${start} - ${end}`;
  }

  // If neither date is available
  return 'No date information available';
}
