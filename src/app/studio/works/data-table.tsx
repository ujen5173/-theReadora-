"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { Book02Icon, QuillWrite02Icon, Upload05Icon } from "hugeicons-react";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  console.log({ data });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-2">
      <div className="w-full flex items-center justify-end py-2">
        <div className="max-w-sm w-full">
          <Input
            placeholder="Search for works..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-white"
            size="md"
            icon={Search}
            iconStyle="text-slate-600 size-4"
          />
        </div>
      </div>

      <div className="bg-white rounded-md overflow-hidden border">
        <ScrollArea className="h-[600px] min-w-[800px]">
          <Table className="w-full h-full">
            <TableHeader className="sticky z-50 top-0 bg-accent">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow className="w-full" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="py-2  text-slate-700 font-semibold px-4"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="h-full">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/20"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-4 align-middle">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="h-full">
                  <TableCell className="h-full" colSpan={columns.length}>
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia
                          className="border border-border"
                          variant="icon"
                        >
                          <Book02Icon />
                        </EmptyMedia>
                      </EmptyHeader>
                      <EmptyTitle>No Works Yet</EmptyTitle>
                      <EmptyDescription>
                        You haven't written anything yet. Get started by writing
                        your first work.
                      </EmptyDescription>
                      <EmptyContent>
                        <div className="flex gap-2">
                          <Button icon={QuillWrite02Icon}>Start Writing</Button>
                          <Button icon={Upload05Icon} variant="outline">
                            Import Work
                          </Button>
                        </div>
                      </EmptyContent>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
