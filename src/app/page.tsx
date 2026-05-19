import { CaseStudy } from "@/components/sections/CaseStudy";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";
import { HeroOffer } from "@/components/sections/HeroOffer";
import { Navigation } from "@/components/sections/Navigation";
import { Testimonials } from "@/components/sections/Testimonials";
import { VideoExamples } from "@/components/sections/VideoExamples";
import { VSLPlayer } from "@/components/sections/VSLPlayer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="flex flex-col">
        <HeroOffer />
        <VSLPlayer />
        <Testimonials />
        <CaseStudy />
        <VideoExamples />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
