"use client";

import { ArrowDown } from "lucide-react";
import ReadingListCard from "~/app/reading-list/components/reading-list-card";
import type { TgetUserReadingList } from "~/server/api/routers/readinglist";

const ReadingList = ({
  readinglists,
}: {
  readinglists: TgetUserReadingList;
}) => {
  return (
    <section className="w-full">
      <div className="flex mb-4 items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-primary">
          Your Reading Lists{" "}
        </h1>
        <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {readinglists?.map((list) => (
          <ReadingListCard
            key={list.id}
            readingList={list}
            showActions={false}
            onDelete={() => void 0} // Placeholder for delete function
          />
        ))}
      </div>
    </section>
  );
};

export default ReadingList;
