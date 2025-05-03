export const cardWidth = 230.5;
export const cardHeight = 310;

export const bookWidth = cardWidth / 1.5;
export const bookHeight = cardHeight / 1.4;

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
] as const;

export const GENRES = [
  "Romance",
  "Fanfiction",
  "LGBTQ+",
  "Werewolf",
  "Contemporary Lit",
  "New Adult",
  "Fantasy",
  "Short Story",
  "Teen Fiction",
  "Historical Fiction",
  "Paranormal",
  "Editor's Picks",
  "Humor",
  "Horror",
] as const;

export const cuidRegex = /^c[a-z0-9]{24}$/;

export const chapterCollectionName = "Chapters";
export const chunkCollectionName = "Chunks";
