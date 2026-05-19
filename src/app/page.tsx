import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24">
      <Pill>Phase 1 — Design System Online</Pill>
      <h1 className="text-gradient text-center font-display text-5xl font-semibold tracking-tight md:text-7xl">
        Setup complete.
      </h1>
      <p className="max-w-xl text-center text-text-secondary">
        Tokens, fonts, and primitives are wired up. Page sections arrive in Phase 2.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <Card className="mt-8 max-w-md p-6">
        <p className="text-sm text-text-muted">
          Glass card — rounded-2xl, 1px border, backdrop-blur-xl, 40% surface.
        </p>
      </Card>
    </main>
  );
}
