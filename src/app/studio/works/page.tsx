"use client";

import { useMemo } from "react";
import { api } from "~/trpc/react";
import { columns, type WorkRow } from "./columns";
import { DataTable } from "./data-table";

const Works = () => {
  const { data, isLoading } = api.story.getAuthorWorks.useQuery(
    {
      limit: 50,
    },
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  );

  const works: WorkRow[] = useMemo(() => data ?? [], [data]);

  return (
    <main className="p-4 sm:p-6">
      {isLoading ? (
        <div className="bg-white/60 border border-border rounded-md h-40 animate-pulse" />
      ) : (
        <DataTable columns={columns} data={works} />
      )}
    </main>
  );
};

export default Works;
