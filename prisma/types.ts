declare global {
  namespace PrismaJson {
    type ChapterMatrics = {
      wordCount: number;
      readingTime: number;
      commentsCount: number;
      ratingCount: number;
      ratingValue: number;
      averageRating: number;
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

declare global {
  namespace PrismaJson {
    type EmailNotifications = {
      chapterUpdates: boolean;
      storyCompletion: boolean;
      readingReminders: boolean;
      storyRecommendations: boolean;
      authorUpdates: boolean;
      premiumBenefits: boolean;
      coinsAndTransactions: boolean;
      emailNotifications: boolean;
      marketingEmails: boolean;
    };
  }
}

export type ReadershipAnalytics = PrismaJson.ReadershipAnalytics;
