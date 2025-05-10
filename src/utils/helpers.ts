import type { JsonValue } from "@prisma/client/runtime/library";
import numeral from "numeral";
import type { ChapterMetrics, ReadershipAnalytics } from "prisma/types";
import slugify from "slugify";
import {
  METRICS_DEFAULT_VALUES,
  READERSHIP_ANALYTICS_DEFAULT_VALUES,
} from "./constants";
import { GENRES } from "./genre";

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

  return `${hours ? `${hours}h` : ""} ${minutes ? `${minutes}m` : ""} read`;
};

export const getValidGenre = (genre: string) =>
  GENRES.find((g) => makeSlug(g.name) === makeSlug(genre))?.name ?? "";

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

export const parseReadershipAnalytics = (
  analytics: JsonValue = READERSHIP_ANALYTICS_DEFAULT_VALUES
): ReadershipAnalytics => {
  try {
    if (typeof analytics === "string") {
      return JSON.parse(analytics);
    }
    if (typeof analytics === "object" && analytics !== null) {
      return analytics as ReadershipAnalytics;
    }
    return READERSHIP_ANALYTICS_DEFAULT_VALUES;
  } catch (error) {
    console.error("Error parsing metrics:", error);
    return READERSHIP_ANALYTICS_DEFAULT_VALUES;
  }
};
