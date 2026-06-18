import { Navbar } from "@/layouts/navbar";
import { Footer } from "@/layouts/footer";
import { ApiKeyBanner } from "@/layouts/api-key-banner";

export const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-[#09090B]">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <ApiKeyBanner />
  </div>
);
