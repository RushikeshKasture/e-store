import { cn } from "@/lib/utils";
import React from "react";

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  const stringPriceValue = value.toFixed(2);
  const [integerPart, decimalPart] = stringPriceValue.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">₹</span>
      {integerPart}
      <span className="text-xs align-super">{decimalPart}</span>
    </p>
  );
};

export default ProductPrice;
