import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import ScrollToTop from "@/components/ScrollToTop";

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="w-full min-h-[70vh] bg-white capitalize">
        {children}
      </div>
      <ScrollToTop />
      <Footer />
    </>
  );
}
