import Link from "next/link";
import WebWrapper from "../Wrapper/webWrapper";
import Image from "next/image";

export default function PromoSection({offerList}:any) {
  return (
    <div className="text-center pt-20">
      <WebWrapper>
        <Link href="/sale">
          <div className="w-full relative h-80 rounded-2xl overflow-hidden group">
            <Image
              width={1920}
              height={600}
              alt=""
              src="/assets/images/banner9.webp"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-100 scale-105 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

            <div className="absolute left-10 bottom-10 text-white">
              <h3 className="text-3xl font-bold mb-2">Summer Sale</h3>
              <p className="mb-4">Up to 50% off selected items</p>

              <button className="bg-gradient-to-r from-[#800000] via-[#6b0000] to-[#4a0000] px-6 py-1.5 rounded-md text-white font-semibold flex items-center justify-center gap-2 hover:px-10 duration-300 cursor-pointer mx-auto">
            Shop Now
          </button>
            </div>
          </div>
        </Link>
      </WebWrapper>
    </div>
  );
}
