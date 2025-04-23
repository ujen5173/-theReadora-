"use client";

import { Label } from "@radix-ui/react-label";
import Header from "../_components/layouts/header";
import { FileUploader } from "~/components/ui/file-upload";
import { useState } from "react";
import { toast } from "sonner";
import { uploadToCloudinary } from "~/utils/uploadToCloudinary";
import { GENRES, LANGUAGES } from "~/utils/constants";
import BookMetadata from "../_components/layouts/write/book-metadata";
import { api } from "~/trpc/react";
import { z } from "zod";
import { useRouter } from "next/navigation";

export interface BookMetadataType {
  title: string;
  synopsis: string;
  tags: string[];
  genre: (typeof GENRES)[number];
  isMature: boolean;
  hasAiContent: boolean;
  language: (typeof LANGUAGES)[number]["name"];
  isLGBTQContent: boolean;
}

const zodGenre = z.enum(GENRES);

const Write = () => {
  const router = useRouter();

  const [file, setFile] = useState<File | undefined>();
  const [preparingUpload, setPreparingUpload] = useState(false);
  const [imageLoad, setImageLoad] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(-1);
  const [uploadedFile, setUploadedFile] = useState<{
    url: string;
    public_id: string;
  }>();

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
        title: z.string().min(1),
        synopsis: z.string().min(1),
        tags: z.array(z.string()).min(1),
        genre: zodGenre,
        isMature: z.boolean(),
        hasAiContent: z.boolean(),
        language: z.enum(
          LANGUAGES.map((lang) => lang.name) as [string, ...string[]]
        ),
        isLGBTQContent: z.boolean().default(false),
        thumbnail: z.object({
          url: z.string().url(),
          public_id: z.string().min(1),
        }),
      })
      .safeParse({ ...storyDetails, thumbnail: uploadedFile });

    if (!zodResponse.success) {
      toast.error("Invalid story details");
      return;
    }

    try {
      const result = await createStory({
        ...storyDetails,
        thumbnail: uploadedFile,
      });

      if (result) {
        toast.success("Story created successfully!");
        router.push(`/write/story-editor/${result.id}`);
      }
    } catch (error) {
      console.error("Error creating story:", error);
      toast.error("Failed to create story");
    }
  };

  return (
    <>
      <Header />

      <div className="max-w-[1240px] border-b border-border mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-primary">
          Submit your story
        </h1>

        <div className="flex gap-12">
          {/* Thumbnail Uploader */}
          <div className="max-w-xs">
            <div className="space-y-2">
              <Label className="text-base text-slate-700 font-semibold inline-block">
                Book Cover
              </Label>
              <p className="text-sm text-muted-foreground">
                Upload a high-quality cover image for your book. Recommended
                size: <span className="font-semibold">800x1200 pixels.</span>
              </p>
            </div>

            <FileUploader
              value={file}
              onValueChange={setFile}
              onUpload={handleUpload}
              onRemove={handleRemove}
              className="max-h-[450px] mt-2"
              progresses={uploadProgress}
              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
              maxSize={4 * 1024 * 1024}
              uploadedFile={uploadedFile}
              preparingUpload={preparingUpload}
              setPreparingUpload={setPreparingUpload}
              imageLoad={imageLoad}
              setImageLoad={setImageLoad}
            />

            {uploadedFile && (
              <p className="mt-2 text-sm text-muted-foreground">
                Click the upload area or drag & drop to replace the current
                cover
              </p>
            )}
          </div>

          {/* Book Metadata */}
          <BookMetadata onSubmit={handleSubmit} status={status} />
        </div>
      </div>
    </>
  );
};

export default Write;
