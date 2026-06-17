import { ClientLogos } from "@/components/sections/ClientLogos";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";
import { HeroOffer } from "@/components/sections/HeroOffer";
import { Navigation } from "@/components/sections/Navigation";
import { Testimonials } from "@/components/sections/Testimonials";
import { VideoExamples } from "@/components/sections/VideoExamples";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="flex flex-col">
        <HeroOffer />
        <ClientLogos />
        <Testimonials />
        <VideoExamples />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
