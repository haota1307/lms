import { CourseLevel, CourseStatus } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const avatarFallback = (name: string) => {
  if (!name) {
    return "U";
  }

  const initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return initials.length > 2 ? initials.slice(0, 2) : initials;
};

export function mapLevelToPrisma(level: string): CourseLevel {
  switch (level) {
    case "Cơ bản":
      return CourseLevel.BEGINNER;
    case "Trung cấp":
      return CourseLevel.INTERMEDIATE;
    case "Nâng cao":
      return CourseLevel.ADVANCED;
    default:
      return CourseLevel.BEGINNER;
  }
}

export function mapStatusToPrisma(status: string): CourseStatus {
  switch (status) {
    case "Bản nháp":
      return CourseStatus.Draft;
    case "Công khai":
      return CourseStatus.Published;
    case "Lưu trữ":
      return CourseStatus.ARCHIVED;
    default:
      return CourseStatus.Draft;
  }
}
