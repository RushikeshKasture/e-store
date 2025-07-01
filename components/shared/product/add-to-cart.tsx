"use client";
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, cartItem } from "@/types";
import { Loader, Minus, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { toast } from "sonner";

const AddToCart = ({ cart, item }: { cart?: Cart; item: cartItem }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast(res.message);
        return;
      }

      toast(res?.message, {
        action: (
          <Button
            variant="default"
            className="text-sm"
            onClick={() => router.push("/cart")}
          >
            Go to cart
          </Button>
        ),
      });
    });
  };

  // handle remove item from cart
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      toast(res?.message);
      return;
    });
  };

  // check if item already exists in cart
  const itemExists =
    cart &&
    cart?.items.find((cartItem) => cartItem.productId === item.productId);

  return itemExists ? (
    <div>
      <Button variant={"outline"} type="button" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{itemExists?.qty}</span>
      <Button variant={"outline"} type="button" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <PlusIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <PlusIcon className="h-4 w-4" />
      )}
      Add to cart
    </Button>
  );
};

export default AddToCart;
