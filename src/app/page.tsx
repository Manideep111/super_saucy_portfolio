import { HeroOffer } from "@/components/sections/HeroOffer";
import { Navigation } from "@/components/sections/Navigation";
import { Testimonials } from "@/components/sections/Testimonials";
import { VSLPlayer } from "@/components/sections/VSLPlayer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="flex flex-col">
        <HeroOffer />
        <VSLPlayer />
        <Testimonials />
      </main>
    </>
  );
}
