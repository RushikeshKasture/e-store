import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convert prsima object to plain js object
export function convertPrismaObjectToPlainObject<T>(values: T): T {
  return JSON.parse(JSON.stringify(values));
}

export function formatNumberWithDecimal(num: number): string {
  const [integerPart, decimalPart] = num.toString().split(".");
  return decimalPart
    ? `${integerPart}.${decimalPart.padEnd(2, "0")}`
    : `${integerPart}.00`;
}
