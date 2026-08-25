// components/common/SectionLoader.tsx
export default function SectionLoader({ title }: { title: string }) {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
}