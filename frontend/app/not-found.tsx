import WebWrapper from "@/components/Wrapper/webWrapper";
import Link from "next/link";

export default function NotFound() {
  return (
    <WebWrapper>
      <div className="flex min-h-screen flex-col items-center justify-center text-center px-6">
        <div>
          {/* Big 404 */}
          <h1 className="text-7xl md:text-9xl font-extrabold text-[#7b1e2b]">
            404
          </h1>

          {/* Title */}
          <h2 className="mt-4 text-2xl md:text-3xl font-semibold">
            Oops! Page not found
          </h2>

          {/* Description */}
          <p className="mt-2 text-gray-500 max-w-md">
            The page you're looking for doesn't exist or may have been moved.
            Let’s get you back to shopping.
          </p>
          <div className="mt-8 opacity-20 text-8xl ">🛍️</div>

          {/* Buttons */}
          <div className="mt-8 flex justify-center flex-wrap gap-4">
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-[#7b1e2b] text-white font-medium hover:opacity-90 transition"
            >
              Go Home
            </Link>

            <Link
              href="/shop"
              className="px-6 py-3 rounded-full border border-[#7b1e2b] text-[#7b1e2b] font-medium hover:bg-[#7b1e2b] hover:text-white transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </WebWrapper>
  );
}
