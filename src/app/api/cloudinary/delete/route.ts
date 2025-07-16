import { NextResponse } from "next/server";
import z from "zod";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export const deleteFileSchema = z.object({
  publicId: z.string().min(1, { message: "Public ID không được để trống" }),
});

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const validation = deleteFileSchema.safeParse(body);

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

    const { publicId } = validation.data;

    // Xóa file từ Cloudinary
    await deleteFromCloudinary(publicId);

    return NextResponse.json({
      success: true,
      message: "Xóa file thành công",
    });
  } catch (error) {
    console.error("[CLOUDINARY_DELETE_ERROR]:", error);

    // Xử lý lỗi cụ thể từ Cloudinary
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: "File không tồn tại hoặc đã được xóa" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Lỗi khi xóa file từ Cloudinary" },
      { status: 500 }
    );
  }
}
