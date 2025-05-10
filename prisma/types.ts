declare global {
  namespace PrismaJson {
    type ChapterMatrics = {
      wordCount: number;
      readingTime: number;
      commentsCount: number;
      ratingCount: number;
      ratingValue: number;
      ratingAvg: number;
    };
  }
}

export type ChapterMetrics = PrismaJson.ChapterMatrics;

declare global {
  namespace PrismaJson {
    type ReadershipAnalytics = {
      total: number;
      unique: number;
    };
  }
}

export type ReadershipAnalytics = PrismaJson.ReadershipAnalytics;
