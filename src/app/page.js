import HeroSection from "./components/Herosection";
import TemplateShowcase from "./components/TemplatesShowcase";
import Whyus from "./components/Whyus";

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <TemplateShowcase />
      <Whyus />
    </main>
  );
}
