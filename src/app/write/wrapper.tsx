"use client";

import { Label } from "@radix-ui/react-label";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { FileUploader } from "~/components/ui/file-upload";
import { api } from "~/trpc/react";
import { LANGUAGES } from "~/utils/constants";
import { GENRES } from "~/utils/genre";
import { uploadToCloudinary } from "~/utils/uploadToCloudinary";
import Header from "../_components/layouts/header";
import BookMetadata from "../_components/layouts/write/book-metadata";

export interface BookMetadataType {
  title: string;
  synopsis: string;
  tags: string[];
  genre: (typeof GENRES)[number]["slug"];
  isMature: boolean;
  hasAiContent: boolean;
  language: (typeof LANGUAGES)[number]["name"];
  isLGBTQContent: boolean;
}

const zodGenre = z.enum(
  GENRES.map((genre) => genre.slug) as [string, ...string[]],
  {
    message: "Please select a genre",
  }
);

const Write = ({
  editData,
}: {
  editData:
    | (BookMetadataType & {
        thumbnail: string;
        thumbnailId: string;
        storyStatus: string;
      })
    | null;
}) => {
  const router = useRouter();
  const editId = useSearchParams().get("editId") ?? null;

  const [file, setFile] = useState<File | undefined>();
  const [preparingUpload, setPreparingUpload] = useState(false);
  const [imageLoad, setImageLoad] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(-1);
  const [uploadedFile, setUploadedFile] = useState<
    | {
        url: string;
        public_id: string;
      }
    | undefined
  >(
    editData
      ? {
          url: editData.thumbnail,
          public_id: editData.thumbnailId,
        }
      : undefined
  );

  const { mutateAsync: createStory, status } = api.story.create.useMutation();

  const handleUpload = async (file: File) => {
    try {
      setUploadProgress(0);
      const result = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(progress);
      });

      setUploadedFile({
        url: result.secure_url,
        public_id: result.public_id,
      });

      setUploadProgress(100);
      toast.success("Book cover uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload book cover"
      );
      setUploadProgress(-1);
    } finally {
      setPreparingUpload(false);
    }
  };

  const handleRemove = () => {
    setFile(undefined);
    setUploadedFile(undefined);
    setUploadProgress(-1);
    setImageLoad(true);
  };

  const handleSubmit = async (storyDetails: BookMetadataType) => {
    if (!uploadedFile) {
      toast.error("Please upload a book cover");
      return;
    }

    // zod validations
    const zodResponse = z
      .object({
        title: z.string().min(1, "Title is required"),
        synopsis: z.string().min(1, "Synopsis is required"),
        tags: z.array(z.string()).min(1, "At least one tag is required"),
        genre: zodGenre.refine((val) => val !== undefined && val !== "", {
          message: "Please select a genre for your story",
        }),
        isMature: z.boolean(),
        hasAiContent: z.boolean(),
        language: z.enum(
          LANGUAGES.map((lang) => lang.name) as [string, ...string[]],
          { required_error: "Language is required" }
        ),
        isLGBTQContent: z.boolean().default(false),
        thumbnail: z.object({
          url: z.string().url(),
          public_id: z.string().min(1),
        }),
      })
      .safeParse({ ...storyDetails, thumbnail: uploadedFile });

    if (!zodResponse.success) {
      const errorMessage =
        zodResponse.error.issues[0]?.message ||
        "Please check your story details";
      toast.error(errorMessage);
      return;
    }

    try {
      const result = await createStory({
        ...storyDetails,
        thumbnail: uploadedFile,
        genre: storyDetails.genre,
        edit: editId,
      });

      if (result) {
        toast.success("Story uploaded successfully!");
        router.push(`/write/story-editor/${result.id}`);
      }
    } catch (error) {
      console.error("Error updating story:", error);
      toast.error("Failed to update story");
    }
  };

  return (
    <>
      <Header />

      <div className="max-w-[1240px] mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6 text-primary">
          Submit your story
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          {/* Thumbnail Uploader */}
          <div className="w-full lg:max-w-xs">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm sm:text-base text-slate-700 font-semibold inline-block">
                Book Cover
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Upload a high-quality cover image for your book. Recommended
                size: <span className="font-semibold">800x1200 pixels.</span>
              </p>
            </div>

            <div>
              <FileUploader
                value={file}
                onValueChange={setFile}
                onUpload={handleUpload}
                onRemove={handleRemove}
                className="w-8/12 xs:w-3/6 md:w-full mx-auto max-w-[288px] h-auto aspect-[1/1.6] mt-2"
                progresses={uploadProgress}
                accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                maxSize={4 * 1024 * 1024}
                uploadedFile={uploadedFile}
                preparingUpload={preparingUpload}
                setPreparingUpload={setPreparingUpload}
                imageLoad={imageLoad}
                setImageLoad={setImageLoad}
              />
            </div>

            {uploadedFile && (
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                Click the upload area or drag & drop to replace the current
                cover
              </p>
            )}
          </div>

          {/* Book Metadata */}
          <BookMetadata
            editData={
              editData
                ? {
                    title: editData.title,
                    synopsis: editData.synopsis,
                    tags: editData.tags,
                    genre: editData.genre,
                    isMature: editData.isMature,
                    hasAiContent: editData.hasAiContent,
                    language: editData.language,
                    isLGBTQContent: editData.isLGBTQContent,
                  }
                : null
            }
            onSubmit={handleSubmit}
            status={status}
          />
        </div>
      </div>
    </>
  );
};

export default Write;
