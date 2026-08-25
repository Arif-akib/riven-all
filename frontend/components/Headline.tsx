export default function Headline({
  mainText,
  subText,
}: {
  mainText: string;
  subText: string;
}) {
  return (
    <>
      <h1 className="bg-gradient-to-r from-[#800000] via-[#6b0000] to-[#4a0000] bg-clip-text text-transparent text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold capitalize leading-snug tracking-wider">
        {mainText}
      </h1>
      <p className="text-gray-600 italic">{subText}</p>
    </>
  );
}
