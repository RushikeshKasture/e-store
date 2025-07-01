"use client";
import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { cartItem } from "@/types";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const AddToCart = ({ item }: { item: cartItem }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);
    if (!res.success) {
      toast(res.message);
      return;
    }

    toast(`${item.name} added to cart`, {
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
  };

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <PlusIcon />
      Add to cart
    </Button>
  );
};

export default AddToCart;
