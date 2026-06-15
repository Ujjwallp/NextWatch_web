import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ApiKeyBanner } from "@/components/layout/api-key-banner";

export const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-[#09090B]">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <ApiKeyBanner />
  </div>
);
