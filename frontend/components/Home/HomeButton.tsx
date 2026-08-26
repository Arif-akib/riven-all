import Link from "next/link";
import { ArrowUpRight  } from "lucide-react";

export default function HomeButton({ text, link }: any) {
  return (
    <button className="bg-linear-to-r from-[#800000] via-[#6b0000] to-[#4a0000] px-6 py-1.5 rounded-full text-white font-semibold flex items-center justify-center gap-2 transition-transform duration-300 cursor-pointer mx-auto text-xs lg:text-sm">
      <Link href={link} className="flex gap-2 items-center">{text}<ArrowUpRight className="size-4"/></Link>
    </button>
  );
}
