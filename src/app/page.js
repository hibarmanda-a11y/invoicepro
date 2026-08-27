import Image from "next/image";

import Templates from "../app/templates/page";
import HeroSection from "./components/Herosection";
import TemplateShowcase from "./components/TemplatesShowcase";
import Whyus from "./components/Whyus";


export default function Home() {
  return (
    <div className="mx-10">
      <HeroSection />
      <TemplateShowcase />
     <Whyus />
    </div>
  )
}
