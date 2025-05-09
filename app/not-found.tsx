"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src={"/images/logo.svg"}
        alt=""
        height={100}
        width={100}
        priority={true}
      />
      <div className="p-6 w-1/3 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive">Page not found</p>
        <Button
          variant="outline"
          className="mt-4 ml-2"
          onClick={() => (window.location.href = "/")}
        >
          {" "}
          Back to Homepage
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
