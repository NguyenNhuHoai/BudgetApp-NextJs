"use client";
import { Frown } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <main
      className={`not-found`}
      style={{
        position: "absolute",
        top: `${(window.innerHeight * 30) / 100}px`,
        left: "0",
        right: "0",
      }}
    >
      <div className="flex justify-center items-center flex-col">
        <Frown className="text-slate-600" size={300}/>
        <h1 className="font-bold text-5xl">Sorry 😢 Page Not Found</h1>
        <p className="text-2xl mt-5">
          The page is not displayed Please visit{" "}
          <Link className="text-red-500" href={"/"}>
            https://budget-app-next-js.vercel.app
          </Link>{" "}
          again
        </p>
      </div>
    </main>
  );
}
