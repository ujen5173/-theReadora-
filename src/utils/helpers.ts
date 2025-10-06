import type { JsonValue } from "@prisma/client/runtime/library";
import { format } from "date-fns";
import numeral from "numeral";
import type { ChapterMetrics } from "prisma/types";
import slugify from "slugify";
import { METRICS_DEFAULT_VALUES } from "./constants";

export const makeSlug = (str: string) =>
  slugify(str, {
    lower: true,
    strict: true,
    replacement: "-",
    trim: true,
    locale: "en",
    remove: /[*+~.()'"!:@]/g, // removes special characters
  });

export const formatNumber = (num: number) => {
  return numeral(num).format("0.[0]a");
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
  });
};

export const formatSmartDate = (date: Date) => {
  const currentYear = new Date().getFullYear();
  const targetYear = date.getFullYear();

  if (targetYear === currentYear) {
    // Format without the year if it's the current year
    return format(date, "MMMM do, h:mm a"); // e.g., "September 17"
  } else {
    // Format with the year if it's a different year
    return format(date, "MMMM do yyyy, h:mm a"); // e.g., "September 17, 2024"
  }
};

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];

  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export const mongoObjectId = () => {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  return (
    timestamp +
    "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, function () {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase()
  );
};

export const getReadingTimeText = (readingTime: number) => {
  const totalSeconds = Math.floor(readingTime / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return `${hours ? `${hours}h` : ""} ${minutes ? `${minutes}m` : "1m"} read`;
};

export const parseMetrics = (
  metrics: JsonValue = METRICS_DEFAULT_VALUES
): ChapterMetrics => {
  try {
    if (typeof metrics === "string") {
      return JSON.parse(metrics);
    }
    if (typeof metrics === "object" && metrics !== null) {
      return metrics as ChapterMetrics;
    }
    return METRICS_DEFAULT_VALUES;
  } catch (error) {
    console.error("Error parsing metrics:", error);
    return METRICS_DEFAULT_VALUES;
  }
};

export const isChapterScheduled = (
  scheduledFor: Date | null | undefined
): boolean => {
  if (!scheduledFor) return false;
  return new Date() >= new Date(scheduledFor);
};
