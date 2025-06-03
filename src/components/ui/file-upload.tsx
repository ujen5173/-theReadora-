"use client";

import { Upload01Icon, UploadSquare02Icon } from "hugeicons-react";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import Dropzone, { type DropzoneProps } from "react-dropzone";
import { toast } from "sonner";
import { useControllableState } from "~/app/hooks/use-controllable-state";
import { cn } from "~/lib/utils";
import { formatBytes } from "~/utils/helpers";
import { Progress } from "./progress";
import { Skeleton } from "./skeleton";

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File;
  onValueChange?: (file: File) => void;
  onUpload?: (file: File) => Promise<void>;
  progresses: number;
  accept?: DropzoneProps["accept"];
  maxSize?: DropzoneProps["maxSize"];
  uploadedFile?: { url: string; public_id: string };
  preparingUpload: boolean;
  imageLoad: boolean;
  setImageLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setPreparingUpload: React.Dispatch<React.SetStateAction<boolean>>;
  onRemove?: () => void;
  disabled?: boolean;
}

export function FileUploader({
  uploadedFile,
  preparingUpload,
  imageLoad,
  setImageLoad,
  setPreparingUpload,
  onRemove,
  ...props
}: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept = { "image/*": [] },
    maxSize = 1024 * 1024 * 4,
    disabled = false,
    className,
    ...dropzoneProps
  } = props;

  const [file, setFile] = useControllableState({
    prop: valueProp,
    onChange: (file: File) => {
      onValueChange?.(file);
    },
  });

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setFile(file);

      if (onUpload) {
        try {
          setPreparingUpload(true);
          await onUpload(file);
        } catch (error) {
          console.error("Upload error:", error);
          toast.error("Upload failed");
        }
      }
    },
    [onUpload, setFile, setPreparingUpload]
  );

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!file) return;
      if (isFileWithPreview(file)) {
        URL.revokeObjectURL(file.preview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex h-full flex-col gap-6 overflow-hidden">
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={1}
        multiple={false}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              "overflow-hidden bg-white",
              !(!!uploadedFile && !!uploadedFile.url) &&
                "border-2 border-dashed border-slate-600 py-6",
              "group relative grid h-full w-full cursor-pointer place-items-center rounded-lg",
              "text-center transition hover:bg-secondary/5",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isDragActive && "border-muted-foreground/50 bg-primary/5",
              className
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />

            {isDragActive ? (
              <DragSection />
            ) : (
              <>
                {preparingUpload || (progresses > -1 && progresses < 100) ? (
                  <Uploading
                    preparingUpload={preparingUpload}
                    progresses={progresses}
                  />
                ) : (
                  <>
                    {uploadedFile?.url ? (
                      <FileUploaded
                        imageLoad={imageLoad}
                        setImageLoad={setImageLoad}
                        uploadedFile={uploadedFile}
                      />
                    ) : (
                      <NoFileUploaded maxSize={maxSize} />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </Dropzone>

      {uploadedFile && (
        <div className="absolute top-4 right-6 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="rounded-full bg-destructive/10 p-2 border border-destructive/40 text-destructive hover:bg-destructive/20 transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
            <span className="sr-only">Remove image</span>
          </button>
        </div>
      )}
    </div>
  );
}

const NoFileUploaded = ({ maxSize }: { maxSize: number }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
      <div className="rounded-full border border-dashed border-muted-foreground p-3">
        <Upload01Icon
          className="size-7 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      <div className="space-y-px">
        <p className="font-medium text-muted-foreground">
          Drag & drop file here, or click to select file
        </p>
        <p className="text-sm text-muted-foreground/70">
          You can upload files (up to {formatBytes(maxSize)})
        </p>
      </div>
    </div>
  );
};

const Uploading = ({
  preparingUpload,
  progresses,
}: {
  preparingUpload: boolean;
  progresses: number;
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 sm:px-5">
      <div className="rounded-full border border-dashed border-muted-foreground p-3">
        <UploadSquare02Icon className="size-7 text-muted-foreground" />
      </div>
      <div className="w-full space-y-px">
        <p className="mb-2 font-medium text-muted-foreground">
          {preparingUpload ? "Preparing upload" : "Uploading"}
          ...
        </p>
        <Progress value={progresses} />
      </div>
    </div>
  );
};

const FileUploaded = ({
  imageLoad,
  setImageLoad,
  uploadedFile,
}: {
  imageLoad: boolean;
  setImageLoad: React.Dispatch<React.SetStateAction<boolean>>;
  uploadedFile: { url: string; public_id: string };
}) => {
  return (
    <div className="relative w-full h-full min-h-[383px]">
      {imageLoad && (
        <div className="absolute inset-0">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      )}
      <Image
        onLoadingComplete={() => setImageLoad(false)}
        src={uploadedFile.url}
        alt="Uploaded book cover"
        draggable={false}
        fill
        className={cn(
          "object-cover rounded-xl transition-opacity duration-300",
          imageLoad ? "opacity-0" : "opacity-100"
        )}
        sizes="(max-width: 768px) 100vw, 800px"
        priority
      />
    </div>
  );
};

const DragSection = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
      <div className="rounded-full border border-dashed border-muted-foreground p-3">
        <Upload01Icon
          className="size-7 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      <p className="font-medium text-muted-foreground">Drop the files here</p>
    </div>
  );
};

function isFileWithPreview(file: File): file is File & { preview: string } {
  return "preview" in file && typeof file.preview === "string";
}
