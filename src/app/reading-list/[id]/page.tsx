"use client";
import { Bookmark02Icon, Search01Icon } from "hugeicons-react";
import { ArrowLeftIcon, BookOpenIcon, UsersIcon } from "lucide-react";
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

      <main className="bg-gradient-to-b from-white to-slate-50 min-h-screen">
        <div className="max-w-[1540px] mx-auto px-4 py-8">
          {/* Back button and title section */}
          <div className="mb-8">
            <Link href="/reading-list">
              <Button
                variant="ghost"
                className="mb-4 flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Reading List Cover */}
                <div className="relative w-full md:w-48 h-64 rounded-xl overflow-hidden shadow-lg border border-slate-200">
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Bookmark02Icon className="w-12 h-12 text-slate-400" />
                  </div>
                </div>

                {/* Reading List Info */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-700">
                    {readingList?.title}
                  </h1>
                  <p className="mt-2 text-gray-600 max-w-2xl">
                    {readingList?.description || "No description provided"}
                  </p>

                  {/* Stats */}
                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <BookOpenIcon className="w-5 h-5" />
                      <span>{readingList?.stories.length || 0} Novels</span>
                    </div>
                    {readingList?.user && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <UsersIcon className="w-5 h-5" />
                        <span>Created by {readingList.user.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search and stats section */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder="Search novels in this list..."
                className="w-full pl-10 bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search01Icon}
                iconPlacement="left"
                iconStyle="size-4 text-slate-700"
              />
            </div>
          </div>

          <Separator className="my-6" />

          {/* Novels Grid */}
          <div className="space-y-6">
            <BookSection
              title="Novels in this Reading List"
              novels={filteredNovels || []}
              removeHeader={true}
              isAuthorViewer={false}
              multiple={false}
              customEmptyContainer={null}
            />

            {/* Empty state */}
            {filteredNovels?.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="rounded-full bg-slate-100 p-4">
                  <Search01Icon size={24} className="text-slate-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-700">
                  {searchTerm
                    ? "No matching novels found"
                    : "No novels in this list yet"}
                </h3>
                <p className="mt-2 text-slate-500 max-w-md">
                  {searchTerm
                    ? "Try changing your search terms or browse other novels"
                    : "Add novels to this list to get started. You can add novels from their detail pages."}
                </p>
                <Button variant="outline" className="mt-6" asChild>
                  <Link href="/explore">Browse Novels</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default ReadingListDetail;
