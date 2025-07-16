import { NextResponse } from "next/server";
import z from "zod";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "Tên file không được để trống" }),
  contentType: z.string().min(1, { message: "Loại file không được để trống" }),
  size: z.number().min(1, { message: "Kích thước file không được để trống" }),
  isImage: z.boolean(),
  fileData: z.string().min(1, { message: "Dữ liệu file không được để trống" }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Dữ liệu không hợp lệ",
          details: validation.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { fileName, contentType, size, isImage, fileData } = validation.data;

    // Kiểm tra kích thước file (5MB)
    if (size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File quá lớn, vui lòng tải lên file nhỏ hơn 5MB" },
        { status: 400 }
      );
    }

    // Kiểm tra loại file
    const allowedTypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/gif",
      "image/svg+xml",
    ];
    if (isImage && !allowedTypes.includes(contentType)) {
      return NextResponse.json(
        {
          error:
            "Loại file không được hỗ trợ. Chỉ chấp nhận PNG, JPG, JPEG, GIF, SVG",
        },
        { status: 400 }
      );
    }

    // Tạo tên file unique
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const publicId = `${timestamp}_${cleanFileName}`;

    // Upload lên Cloudinary
    const result = await uploadToCloudinary(fileData, {
      public_id: publicId,
      resource_type: isImage ? "image" : "raw",
      folder: "lms-uploads",
    });

    // Trả về thông tin file đã upload
    return NextResponse.json({
      success: true,
      data: {
        publicId: result.public_id,
        url: result.secure_url,
        originalUrl: result.url,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
        resourceType: result.resource_type,
        createdAt: result.created_at,
      },
    });
  } catch (error) {
    console.error("[CLOUDINARY_UPLOAD_ERROR]:", error);
    return NextResponse.json(
      { error: "Lỗi khi tải lên Cloudinary" },
      { status: 500 }
    );
  }
}
