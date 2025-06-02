"use client";
import { Search01Icon } from "hugeicons-react";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import BookSection from "~/app/_components/shared/books-section";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import Header from "../../_components/layouts/header";

const ReadingListDetail = () => {
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: readingList,
    isLoading,
    refetch,
  } = api.list.getReadingListByid.useQuery(
    {
      id: params.id as string,
    },
    {
      enabled: !!params.id,
    }
  );

  // Filter novels based on search term
  const filteredNovels = readingList?.stories.filter((novel) =>
    novel.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header removeBackground />

      <main className="bg-white min-h-screen">
        <div className="max-w-[1540px] mx-auto px-4 py-8">
          {/* Back button and title section */}
          <div className="mb-8">
            <Link href="/reading-list">
              <Button
                variant="ghost"
                className="mb-4 flex items-center gap-2 text-slate-600 hover:text-slate-900"
              >
                <ArrowLeftIcon size={20} />
                Back to Reading Lists
              </Button>
            </Link>

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-slate-700">
                  {readingList?.title}
                </h1>
                <p className="mt-2 text-gray-600">
                  {readingList?.description || "No description provided"}
                </p>
              </div>
            )}
          </div>

          {/* Search and stats section */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Input
              placeholder="Search novels in this list..."
              className="max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search01Icon}
              iconPlacement="left"
              iconStyle="size-4 text-slate-700"
            />
          </div>

          <Separator className="my-6" />

          <BookSection
            title="Novels in this Reading List"
            novels={filteredNovels || []}
            removeHeader={true}
            isAuthorViewer={false}
            multiple
            customEmptyContainer={null}
          />

          {/* Empty state */}
          {filteredNovels?.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-100 border border-border p-4">
                <Search01Icon size={24} className="text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchTerm
                  ? "No matching novels found"
                  : "No novels in this list yet"}
              </h3>
              <p className="mt-2 text-gray-600">
                {searchTerm
                  ? "Try changing your search terms"
                  : "Add novels to this list to get started"}
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ReadingListDetail;
