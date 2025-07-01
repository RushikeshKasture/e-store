"use server";

import { cartItem } from "@/types";
import { cookies } from "next/headers";
import {
  convertPrismaObjectToPlainObject,
  formatError,
  roundToTwoDecimalPlaces,
} from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";

// calculate cart prices
const calPrice = (items: cartItem[]) => {
  const itemsPrice = roundToTwoDecimalPlaces(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = roundToTwoDecimalPlaces(itemsPrice > 100 ? 0 : 10),
    taxPrice = roundToTwoDecimalPlaces(itemsPrice * 0.15),
    totalPrice = roundToTwoDecimalPlaces(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: cartItem) {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) {
      throw new Error("No cart session found");
    }
    // get session and user ID
    const session = await auth();
    const userId = session?.user?.id
      ? (session?.user?.id as string)
      : undefined;

    // get cart
    const cart = await getMyCart();

    // parse & validate item
    const item = cartItemSchema.parse(data);

    // find product in db

    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (!cart) {
      // create new cart
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calPrice([item]),
      });

      // Add to cart to db
      await prisma.cart.create({
        data: newCart,
      });

      // revialdate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name}Item added to cart`,
      };
    } else {
      // check if item is already in cart
      const existItem = cart.items.find(
        (cartItem) => cartItem.productId === item.productId
      );

      if (existItem) {
        // check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }

        // Increase quantity if item already exists
        cart.items.find(
          (cartItem) => cartItem.productId === item.productId
        )!.qty = existItem.qty + 1;
      } else {
        // if item does not exist in cart
        // check stock
        if (product.stock < 1) {
          throw new Error("Not enough stock");
        }
        cart.items.push(item);
      }
      // save to db the update qty
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items,
          ...calPrice(cart.items as cartItem[]),
        },
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} ${
          existItem ? "quantity updated" : "added to"
        } cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  // check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) {
    throw new Error("No cart session found");
  }
  // get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session?.user?.id as string) : undefined;

  // get user cart from db
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) {
    return undefined;
  }

  return convertPrismaObjectToPlainObject({
    ...cart,
    items: cart.items as cartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) {
      throw new Error("No cart session found");
    }

    // get product from db
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // get cart
    const cart = await getMyCart();

    if (!cart) {
      throw new Error("Cart not found");
    }

    // check item exists in cart

    const existItem = cart.items.find(
      (cartItem) => cartItem.productId === productId
    );
    if (!existItem) {
      throw new Error("Item not found in cart");
    }

    // check if only ne item is in cart
    if (existItem.qty === 1) {
      // remove item from cart
      cart.items = cart.items.filter(
        (item) => item.productId !== existItem.productId
      );
    } else {
      // if more than one item, decrease quantity
      cart.items.find((item) => item.productId === productId)!.qty =
        existItem.qty - 1;
    }

    // update cart in db
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items,
        ...calPrice(cart.items),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} is removed from cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
