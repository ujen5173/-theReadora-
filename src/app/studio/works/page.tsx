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
    }
  );

  const works: WorkRow[] = useMemo(() => data ?? [], [data]);

  return (
    <main className="p-6">
      {isLoading ? (
        <div className="h-40 rounded-md border border-border bg-white/60 animate-pulse" />
      ) : (
        <DataTable columns={columns} data={works} />
      )}
    </main>
  );
};

export default Works;
