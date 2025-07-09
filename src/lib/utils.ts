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
