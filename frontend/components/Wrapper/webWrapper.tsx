// components/WebWrapper.tsx

export default function WebWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="px-5 md:px-10 lg:px-15 2xl:px-20">{children}</div>;
}
