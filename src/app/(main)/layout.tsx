import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/BackToTop";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
