import {
  cartItemSchema,
  insertCartSchema,
  insertProductSchema,
} from "@/lib/validators";
import { z } from "zod";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type cartItem = z.infer<typeof cartItemSchema>;
