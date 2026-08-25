import Image from "next/image";

export default function Loading() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-amber-900 rounded-full animate-spin"></div>

      <Image
        src="/assets/logo/logoh.png"
        width={317}
        height={74}
        alt=""
        className="w-37"
      />
    </div>
  );
}
