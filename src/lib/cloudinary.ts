import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Interface cho response từ Cloudinary
export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
  created_at: string;
}

// Function upload file lên Cloudinary
export async function uploadToCloudinary(
  file: Buffer | string,
  options: {
    folder?: string;
    public_id?: string;
    resource_type?: "image" | "video" | "raw" | "auto";
    transformation?: any;
  } = {}
): Promise<CloudinaryUploadResult> {
  try {
    // Chuyển Buffer thành base64 string nếu cần
    const fileToUpload = Buffer.isBuffer(file)
      ? `data:image/jpeg;base64,${file.toString("base64")}`
      : file;

    const result = await cloudinary.uploader.upload(fileToUpload, {
      folder: options.folder || "lms-uploads",
      public_id: options.public_id,
      resource_type: options.resource_type || "auto",
      transformation: options.transformation,
    });

    return result as CloudinaryUploadResult;
  } catch (error) {
    console.error("Lỗi khi upload lên Cloudinary:", error);
    throw new Error("Không thể upload file lên Cloudinary");
  }
}

// Function xóa file từ Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Lỗi khi xóa file từ Cloudinary:", error);
    throw new Error("Không thể xóa file từ Cloudinary");
  }
}
