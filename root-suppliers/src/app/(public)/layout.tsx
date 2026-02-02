import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ContactFloat from "@/components/ui/ContactFloat";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="min-h-screen pb-16 md:pb-0">{children}</main>
      <Footer />
      <ContactFloat />
    </div>
  );
}
