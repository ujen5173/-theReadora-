import { env } from "~/env";

export type UploadResponse = {
  secure_url: string;
  public_id: string;
};

/**
 * Generates a blur version of a Cloudinary image URL
 * @param originalUrl The original Cloudinary image URL
 * @returns A new URL with blur transformation applied
 */
export function getBlurUrl(originalUrl: string) {
  return originalUrl.replace("/upload/", "/upload/w_50,e_blur:100,q_10/");
}

/**
 * Uploads a file to Cloudinary
 * @param file The file to upload
 * @param onProgress Optional progress callback
 * @returns Promise with upload result
 */
export async function uploadToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      true
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          secure_url: response.secure_url,
          public_id: response.public_id,
        });
      } else {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Upload failed"));
    };

    xhr.send(formData);
  });
}
