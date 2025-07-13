import z from "zod";

export const CourseLevel = ["Cơ bản", "Trung cấp", "Nâng cao"] as const;
export const CourseStatus = ["Bản nháp", "Công khai", "Lưu trữ"] as const;
export const CourseCategory = [
  "Font-end",
  "Back-end",
  "DevOps",
  "AI",
  "Khác",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề khóa học là bắt buộc")
    .max(100, "Tiêu đề khóa học không được vượt quá 100 ký tự"),
  description: z.string().min(1, "Mô tả khóa học là bắt buộc"),
  fileKey: z.string().min(1, "File khóa học là bắt buộc"),
  slug: z.string().min(1, "Slug khóa học là bắt buộc"),
  category: z.enum(CourseCategory, {
    message: "Danh mục khóa học không hợp lệ",
  }),
  smallDescription: z
    .string()
    .min(1, "Mô tả ngắn khóa học là bắt buộc")
    .max(200, "Mô tả ngắn khóa học không được vượt quá 200 ký tự"),
  price: z.coerce
    .number()
    .int()
    .min(1, "Giá khóa học phải là số nguyên không âm")
    .nonnegative("Giá khóa học phải là số nguyên không âm"),
  duration: z.coerce
    .number()
    .int()
    .positive("Thời lượng khóa học phải là số nguyên dương"),
  level: z.enum(CourseLevel, { message: "Cấp độ khóa học không hợp lệ" }),
  status: z.enum(CourseStatus, {
    message: "Trạng thái khóa học không hợp lệ",
  }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
