import slugify from "slugify";
import numeral from "numeral";

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
