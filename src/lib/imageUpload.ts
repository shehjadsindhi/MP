export interface UploadResult {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}

export interface ImageUploadOptions {
  folder?: string;
  maxSizeBytes?: number;
  allowedFormats?: string[];
  transform?: {
    width?: number;
    height?: number;
    crop?: "scale" | "fit" | "fill";
    quality?: number;
  };
}

const DEFAULT_OPTIONS: ImageUploadOptions = {
  folder: "galaxy-ai-hub",
  maxSizeBytes: 5 * 1024 * 1024,
  allowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
  transform: {
    width: 1200,
    height: 1200,
    crop: "fit",
    quality: 85,
  },
};

export class ImageUploadService {
  private cloudinaryConfigured: boolean;

  constructor() {
    this.cloudinaryConfigured = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );
  }

  async upload(file: Buffer | string, options: ImageUploadOptions = {}): Promise<UploadResult> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    if (this.cloudinaryConfigured) {
      return this.uploadToCloudinary(file, opts);
    }

    if (process.env.S3_BUCKET && process.env.AWS_ACCESS_KEY_ID) {
      return this.uploadToS3(file, opts);
    }

    throw new Error("No image upload provider configured. Set CLOUDINARY_* or S3_* environment variables.");
  }

  private async uploadToCloudinary(file: Buffer | string, options: ImageUploadOptions): Promise<UploadResult> {
    try {
      const FormData = require("form-data");
      const fs = require("fs");
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET || "unsigned_preset");
      form.append("folder", options.folder || "galaxy-ai-hub");

      if (options.transform?.width) {
        form.append("transformation", `w_${options.transform.width},h_${options.transform.height || options.transform.width},c_${options.transform.crop || "fit"},q_${options.transform.quality || 85}`);
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: form as any,
          headers: form.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Cloudinary upload failed: ${response.status}`);
      }

      const data = await response.json();

      return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        size: data.bytes,
      };
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  private async uploadToS3(file: Buffer | string, options: ImageUploadOptions): Promise<UploadResult> {
    let S3Client: any, PutObjectCommand: any;
    
    try {
      // @ts-ignore
      const s3Module = (await import("@aws-sdk/client-s3")) as any;
      S3Client = s3Module.S3Client;
      PutObjectCommand = s3Module.PutObjectCommand;
    } catch (error) {
      throw new Error("S3 SDK not installed. Install @aws-sdk/client-s3 to use S3 uploads.");
    }

    const s3 = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const key = `${options.folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const buffer = Buffer.isBuffer(file) ? file : Buffer.from(file);

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: "image/jpeg",
        ACL: "public-read",
      })
    );

    const url = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;

    return {
      url,
      publicId: key,
      width: undefined,
      height: undefined,
      format: "jpg",
      size: buffer.length,
    };
  }

  async delete(url: string): Promise<void> {
    if (!url) return;

    if (this.cloudinaryConfigured && url.includes("res.cloudinary.com")) {
      const publicId = url.split("/").slice(-2).join("/").split(".")[0];
      await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/destroy`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            public_id: publicId,
            invalidate: true,
          }),
        }
      );
    }
  }
}

export const imageUploadService = new ImageUploadService();
