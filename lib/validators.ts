import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2}?$)/.test(formatNumberWithDecimal(Number(value))),
    "Price must be a valid number with two decimal places"
  );

// Schema for inserting products into the database
export const insertProductSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z
    .string()
    .min(3, { message: "Description is required with atleast 3 characters" }),
  price: currency,
  brand: z
    .string()
    .min(3, { message: "Brand is required with atleast 3 characters" }),
  stock: z
    .number()
    .min(0, { message: "Stock must be a positive number" })
    .max(1000, { message: "Stock must be less than 1000" }),
  category: z
    .string()
    .min(3, { message: "Category is required with atleast 3 characters" }),
  rating: z
    .string()
    .min(3, { message: "Rating is required with atleast 3 charactersr" }),
  slug: z
    .string()
    .min(3, { message: "Slug is required with atleast 3 characters" }),
  images: z.array(z.string()).min(1, "Image URL must be a valid URL"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// schema for signin users
export const signInFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

// schema for signup form
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });
