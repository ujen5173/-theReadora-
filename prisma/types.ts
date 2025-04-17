declare global {
  namespace PrismaJson {
    type ChapterMatrics = {
      wordCount: number;
      readingTime: number;
      likesCount: number;
      commentsCount: number;
      viewsCount: number;
      sharesCount: number;
      ratingCount: number;
      ratingValue: number;
      ratingAvg: number;
    };
  }
}
