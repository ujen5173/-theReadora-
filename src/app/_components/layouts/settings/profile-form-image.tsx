"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import { buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { useProfileStore } from "~/store/profile-store";
import { uploadToCloudinary } from "~/utils/uploadToCloudinary";

const ProfileFormImage = () => {
  const { image, name, username, updateProfileImage } = useProfileStore();
  const [uploadProgress, setUploadProgress] = useState(-1);
  const [preparingUpload, setPreparingUpload] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setPreparingUpload(true);
        setUploadProgress(0);

        const result = await uploadToCloudinary(file, (progress) => {
          setUploadProgress(progress);
        });

        updateProfileImage(result.secure_url);
        toast.success("Profile image updated successfully");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update profile image"
        );
      } finally {
        setPreparingUpload(false);
        setUploadProgress(-1);
      }
    }
  };

  return (
    <div className="md:col-span-1">
      <div className="rounded-lg border border-primary/20 bg-white p-6">
        <div className="relative mb-4">
          <div className="size-32 mx-auto rounded-full bg-muted overflow-hidden">
            <Image
              src={image ?? "/default-profile.avif"}
              alt="Profile"
              width={128}
              height={128}
              className="size-full object-cover"
            />
            <Label htmlFor="profile-image">
              <Input
                id={"profile-image"}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                disabled={preparingUpload || uploadProgress > -1}
              />
            </Label>
          </div>
        </div>
        <h4 className="text-lg text-center font-semibold mb-1">{name}</h4>
        <p className="text-sm text-center text-muted-foreground mb-4">
          @{username}
        </p>
        <Label
          htmlFor="profile-image"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "w-full cursor-pointer"
          )}
        >
          {preparingUpload || uploadProgress > -1 ? (
            <Loader2 className="size-4 animate-spin" />
          ) : null}
          Change Avatar
        </Label>
      </div>
    </div>
  );
};

export default ProfileFormImage;
