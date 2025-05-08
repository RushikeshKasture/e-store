import React from "react";
import ProductCard from "./product-card";

const ProductList = ({
  data,
  title,
  limit,
}: {
  data: any;
  title?: string;
  limit?: number;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;
  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {limitedData.map((product: any) => (
            // <div
            //   key={product.id}
            //   className="p-4 border rounded-lg shadow-md m-2"
            // >
            //   {product.name}
            // </div>
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <h3 className="text-center text-2xl font-bold">No Products Found</h3>
          <p className="text-center text-gray-500">Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
