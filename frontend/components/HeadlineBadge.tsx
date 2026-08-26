export default function HeadlineBadge({ text }: { text: string }) {
  return (
    <p className="bg-gradient-to-r from-[#eeb1b1] via-[#e2b9b9] to-[#f7c5c5] text-amber-950 rounded-full px-5 py-1.5 w-fit mx-auto text-[10px] font-medium mb-1">
      {text}
    </p>
  );
}
