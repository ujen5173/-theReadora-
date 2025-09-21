"use client";
import { useMemo, useState } from "react";
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";
import { api } from "~/trpc/react";
import { columns, type WorkRow } from "./columns";
import { DataTable } from "./data-table";

type Range = { min?: number; max?: number };

const numberOrUndefined = (v: string) => (v === "" ? undefined : Number(v));

const rangeControls = (
  label: string,
  value: Range,
  onChange: (r: Range) => void,
  maxVisual = 100000
) => {
  const min = value.min ?? 0;
  const max = value.max ?? maxVisual;
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-700">{label}</div>
        <div className="text-xs text-muted-foreground">
          {Intl.NumberFormat().format(min)} - {Intl.NumberFormat().format(max)}
        </div>
      </div>
      <Slider
        min={0}
        max={maxVisual}
        step={100}
        value={[min, max]}
        onValueChange={([a, b]) => onChange({ min: a, max: b })}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          placeholder="Min"
          value={value.min ?? ""}
          onChange={(e) =>
            onChange({ ...value, min: numberOrUndefined(e.target.value) })
          }
        />
        <Input
          type="number"
          placeholder="Max"
          value={value.max ?? ""}
          onChange={(e) =>
            onChange({ ...value, max: numberOrUndefined(e.target.value) })
          }
        />
      </div>
    </div>
  );
};

const privacyOptions = [
  { value: "ALL", label: "All privacy" },
  { value: "PUBLISHED", label: "Published" },
  { value: "PRIVATE", label: "Private" },
  { value: "DRAFT", label: "Draft" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "DELETED", label: "Deleted" },
] as const;

const Works = () => {
  const [filters, setFilters] = useState({
    query: "",
    views: null,
    likes: null,
    reviews: null,
    privacy: null,
  });

  const [finalFilters, setFinalFilters] = useState({
    query: "",
    views: null,
    likes: null,
    reviews: null,
    privacy: null,
  });

  const { data, isLoading, refetch, isFetching } =
    api.story.getAuthorWorks.useQuery(
      {
        limit: 200,
      },
      {
        refetchOnWindowFocus: false,
        staleTime: 15_000,
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
