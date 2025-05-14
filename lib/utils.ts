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

// format Error funtion
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any) {
  if (error.name === "ZodError") {
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );
    return fieldErrors.join(". ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exist`;
  } else {
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}
