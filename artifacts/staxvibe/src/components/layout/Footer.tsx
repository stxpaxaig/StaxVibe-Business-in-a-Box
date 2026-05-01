import { Activity } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:h-20 md:flex-row md:py-0 px-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <p className="text-sm leading-loose text-muted-foreground font-mono">
            STAXVIBE &copy; 2026. High-fidelity financial assets.
          </p>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/orders/lookup"
            className="text-xs font-mono tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            FIND MY ORDERS
          </Link>
          <Link
            href="/setup"
            className="text-xs font-mono tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            SETUP GUIDE
          </Link>
          <Link
            href="/admin"
            className="text-xs font-mono tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            ADMIN
          </Link>
        </nav>
      </div>
    </footer>
  );
}
