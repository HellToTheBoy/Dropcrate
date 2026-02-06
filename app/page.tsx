import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { StepsSection } from "@/components/steps-section";
import { SkinsSection } from "@/components/skins-section";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <StepsSection />
      <SkinsSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
