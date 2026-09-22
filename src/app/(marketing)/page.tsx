import HeroClient from "@/components/HeroClient";
import Background from "@/components/Background";
import FeaturesSection from "@/components/FeaturesSection";
import HumanSideSection from "@/components/HumanSideSection";
import PortfolioSection from "@/components/PortfolioSection";
import FinalCTASection from "@/components/FinalCTASection";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Background />
      <HeroClient />
      <FeaturesSection />
      <HumanSideSection />
      <PortfolioSection />
      <FinalCTASection />
    </main>
  );
}
