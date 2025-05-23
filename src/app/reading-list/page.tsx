"use client";
import { PlusSignIcon, Search01Icon } from "hugeicons-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { useReadinglistStore } from "~/store/useReadinglist";
import { useUserStore } from "~/store/userStore";
import { api } from "~/trpc/react";
import Header from "../_components/layouts/header";
import ReadingListDialog from "../_components/shared/reading-list-dialog";
import ReadingListCard from "./components/reading-list-card";

const ReadingList = () => {
  const { user } = useUserStore();
  const { lists, setLists, isLoading } = useReadinglistStore();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data,
    isLoading: apiLoading,
    refetch,
  } = api.list.getUserReadingList.useQuery(
    {
      userId: user?.id!,
    },
    {
      enabled: !!user?.id,
      refetchOnWindowFocus: false,
    }
  );

  // Filter lists based on search term
  const filteredLists = lists?.filter(
    (list) =>
      list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (list.description &&
        list.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Trigger API call when component mounts and listen for store changes
  useEffect(() => {
    if (!isLoading && !apiLoading && user?.id) {
      refetch();
    }
  }, [apiLoading, user?.id]);

  // Update store when API data changes
  useEffect(() => {
    if (data) {
      setLists(data);
    }
  }, [data, setLists]);

  return (
    <>
      <Header removeBackground />

      <main className="bg-white border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 py-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-700">
                Reading Lists
              </h1>
              <p className="mt-2 text-gray-600">
                Organize and manage your reading collections
              </p>
            </div>
            <ReadingListDialog onSuccess={() => refetch()} />
          </div>

          <div className="mb-6">
            <Input
              placeholder="Search reading lists..."
              className="max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search01Icon}
              iconPlacement="left"
              iconStyle="size-4 text-slate-700"
            />
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading || apiLoading
              ? // Loading skeletons
                [...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))
              : filteredLists?.map((list) => (
                  <ReadingListCard
                    key={list.id}
                    readingList={list}
                    showActions={true}
                    onDelete={() => refetch()}
                  />
                ))}
          </div>

          {filteredLists?.length === 0 && !isLoading && !apiLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-100 border border-border p-4">
                <PlusSignIcon size={24} className="text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchTerm
                  ? "No matching reading lists"
                  : "No reading lists yet"}
              </h3>
              <p className="mt-2 text-gray-600">
                {searchTerm
                  ? "Try changing your search terms or create a new list"
                  : "Create your first reading list to get started"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => useReadinglistStore.getState().setOpen(true)}
                  icon={PlusSignIcon}
                  className="mt-4"
                >
                  Create Reading List
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ReadingList;
