import WebWrapper from "../Wrapper/webWrapper";

export default function SubHeader() {
  return (
    <>
      <div className="bg-gradient-to-r from-[#800000] via-[#6b0000] to-[#4a0000] py-2 text-xs text-white">
        <WebWrapper>
          <div className=" flex justify-center md:justify-between items-center gap-5">
            <p className="hidden md:flex">Help & Advice</p>
            <div className="text-sm">✨ Free Shipping on Orders Over $50</div>
            <p className="hidden md:flex">Welcome (Login)</p>
          </div>
        </WebWrapper>
      </div>
    </>
  );
}
