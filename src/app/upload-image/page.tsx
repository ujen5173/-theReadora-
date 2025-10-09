"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";
import { Progress } from "~/components/ui/progress";
import { uploadToCloudinary } from "~/utils/uploadToCloudinary";
import Header from "../_components/layouts/header";

type UploadedFile = {
  url: string;
  public_id: string;
};

type QueueItem = {
  id: string;
  file: File;
  preview: string;
  progress: number; // -1 idle, 0..100 uploading
  status: "idle" | "uploading" | "done" | "error";
  uploaded?: UploadedFile;
  error?: string;
  imageLoad: boolean;
};

const MAX_SIZE = 4 * 1024 * 1024;

// Small uid helper to avoid TS/DOM typing issues
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const UploadImage = () => {
  const [items, setItems] = useState<QueueItem[]>([]);

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((it) => URL.revokeObjectURL(it.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accept = useMemo(
    () => ({ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }),
    []
  );

  // Pass id and file, and always locate by id when updating state to avoid stale closures
  const startUpload = useCallback((id: string, file: File) => {
    // set status to uploading
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === id);
      if (idx === -1) return prev;
      const it = prev[idx];
      if (it?.status === "uploading" || it?.status === "done") return prev;
      const next = [...prev];
      next[idx] = {
        ...it!,
        status: "uploading",
        progress: 0,
        error: undefined,
      };
      return next;
    });

    uploadToCloudinary(file, (progress) => {
      setItems((prev) => {
        const idx = prev.findIndex((x) => x.id === id);
        if (idx === -1) return prev;
        const it = prev[idx];
        const next = [...prev];
        next[idx] = { ...it!, progress };
        return next;
      });
    })
      .then((res) => {
        setItems((prev) => {
          const idx = prev.findIndex((x) => x.id === id);
          if (idx === -1) return prev;
          const it = prev[idx];
          const next = [...prev];
          next[idx] = {
            ...it!,
            status: "done",
            progress: 100,
            uploaded: { url: res.secure_url, public_id: res.public_id },
          };
          return next;
        });
        toast.success("Image uploaded successfully!");
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Upload failed";
        setItems((prev) => {
          const idx = prev.findIndex((x) => x.id === id);
          if (idx === -1) return prev;
          const it = prev[idx];
          const next = [...prev];
          next[idx] = {
            ...it!,
            status: "error",
            progress: -1,
            error: message,
          };
          return next;
        });
        toast.error(message);
      });
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles?.length) return;

      const prepared: QueueItem[] = acceptedFiles.map((file) => ({
        id: uid(),
        file,
        preview: URL.createObjectURL(file),
        progress: -1,
        status: "idle",
        imageLoad: true,
      }));

      // Add to queue and immediately start uploads in parallel
      setItems((prev) => {
        const next = [...prev, ...prepared];
        // Start uploads with stable references (id + file)
        Promise.resolve().then(() => {
          for (const it of prepared) {
            startUpload(it.id, it.file);
          }
        });
        return next;
      });
    },
    [startUpload]
  );

  const handleRemove = (id: string) => {
    setItems((prev) => {
      const it = prev.find((x) => x.id === id);
      if (it) URL.revokeObjectURL(it.preview);
      return prev.filter((x) => x.id !== id);
    });
  };

  const copyLinks = () => {
    const links = items
      .filter((it) => it.status === "done" && it.uploaded)
      .map((it) => it.uploaded);
    if (!links.length) {
      toast.message("No completed uploads to copy");
      return;
    }
    navigator.clipboard
      .writeText(JSON.stringify(links))
      .then(() => toast.success("Links copied to clipboard"))
      .catch(() => toast.error("Failed to copy links"));
  };

  return (
    <>
      <Header />

      <div className="mx-auto mt-2 min-h-screen flex justify-center flex-col max-w-4xl space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-xl font-semibold">Upload Images</h1>
            <p className="text-sm text-muted-foreground">
              Drag and drop multiple images or click the area below to select.
            </p>
          </div>
          {!!items.length && (
            <button
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50"
              onClick={() => setItems([])}
            >
              Clear All
            </button>
          )}
        </div>

        <Dropzone onDrop={onDrop} accept={accept} maxSize={MAX_SIZE} multiple>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={[
                "w-full cursor-pointer rounded-lg border-2 border-dashed text-center transition",
                // Taller dropzone
                "p-6 min-h-56 md:min-h-64 grid place-content-center",
                isDragActive
                  ? "border-muted-foreground/50 bg-primary/5"
                  : "border-slate-600 hover:bg-secondary/5",
              ].join(" ")}
            >
              <input {...getInputProps()} />
              <p className="font-medium text-muted-foreground">
                Drag & drop images here, or click to select files
              </p>
              <p className="text-sm text-muted-foreground/70">
                Up to {Math.round(MAX_SIZE / (1024 * 1024))}MB per file
              </p>
            </div>
          )}
        </Dropzone>

        {!!items.length && (
          <>
            <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="relative overflow-hidden rounded-lg border"
                >
                  <div className="relative aspect-[1/1.6] w-full">
                    <Image
                      src={it.uploaded?.url ?? it.preview}
                      alt="Upload preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={[
                        "rounded-lg object-cover transition-opacity duration-300",
                        it.imageLoad ? "opacity-0" : "opacity-100",
                      ].join(" ")}
                      onLoadingComplete={() => {
                        setItems((prev) => {
                          const idx = prev.findIndex((x) => x.id === it.id);
                          if (idx === -1) return prev;
                          const cur = prev[idx];
                          const next = [...prev];
                          next[idx] = { ...cur!, imageLoad: false };
                          return next;
                        });
                      }}
                      draggable={false}
                      priority
                    />
                  </div>

                  {it.status === "uploading" && (
                    <div className="absolute inset-x-0 bottom-0 bg-white/80 p-3">
                      <p className="mb-2 text-sm text-muted-foreground">
                        Uploading...
                      </p>
                      <Progress value={it.progress < 0 ? 0 : it.progress} />
                    </div>
                  )}

                  {it.status === "error" && (
                    <div className="absolute inset-x-0 bottom-0 bg-destructive/10 p-3 text-destructive">
                      <p className="text-sm">{it.error ?? "Upload failed"}</p>
                    </div>
                  )}

                  <div className="absolute right-2 top-2 flex gap-2">
                    {it.status === "error" && (
                      <button
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50"
                        onClick={() => startUpload(it.id, it.file)}
                      >
                        Retry
                      </button>
                    )}
                    <button
                      className="rounded-full border border-destructive/40 bg-destructive/10 p-2 text-destructive transition-colors hover:bg-destructive/20"
                      onClick={() => handleRemove(it.id)}
                      aria-label="Remove image"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                className="rounded-md bg-black px-3 py-2 text-sm text-white hover:opacity-90"
                onClick={copyLinks}
              >
                Copy Links
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UploadImage;
