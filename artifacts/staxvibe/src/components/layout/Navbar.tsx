import { Link } from "wouter";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4">
        <div className="flex flex-1 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 font-mono font-bold text-xl tracking-tighter hover:text-primary transition-colors" data-testid="nav-logo">
            <Activity className="h-6 w-6 text-primary" />
            <span>STAX<span className="text-primary">VIBE</span></span>
          </Link>
          
          <div className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/products" className="transition-colors hover:text-primary" data-testid="nav-products">MARKETPLACE</Link>
            <Link href="/admin" className="transition-colors hover:text-primary" data-testid="nav-admin">TERMINAL</Link>
            <Button asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground font-mono" data-testid="nav-connect">
              <Link href="/products">ACCESS STORE</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
