"use server";

import { prisma } from "@/lib/db";
import { apiResponse } from "@/lib/type";
import { mapLevelToPrisma, mapStatusToPrisma } from "@/lib/utils";
import { courseSchema, CourseSchemaType } from "@/lib/zod-schemas";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createCourseAction(
  data: CourseSchemaType
): Promise<apiResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return {
        status: "error",
        message: "Bạn không có quyền tạo khóa học",
      };
    }

    const validation = courseSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    await prisma.course.create({
      data: {
        ...validation.data,
        level: mapLevelToPrisma(validation.data.level),
        status: mapStatusToPrisma(validation.data.status),
        userId: session?.user.id as string,
      },
    });

    return { status: "success", message: "Khóa học đã được tạo thành công" };
  } catch (error) {
    console.error("Lỗi khi tạo khóa học:", error);
    return { status: "error", message: "Có lỗi xảy ra khi tạo khóa học" };
  }
}
