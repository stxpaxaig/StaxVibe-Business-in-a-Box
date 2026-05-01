import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Activity className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left font-mono">
            STAXVIBE &copy; 2026. High-fidelity financial assets.
          </p>
        </div>
      </div>
    </footer>
  );
}
