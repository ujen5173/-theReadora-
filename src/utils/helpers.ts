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
