import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCcw, ArrowLeft } from "lucide-react";

export default function CheckoutCancel() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full border border-destructive/30 bg-card/30 backdrop-blur-sm p-8 rounded-2xl shadow-[0_0_50px_-12px_rgba(255,51,102,0.1)] text-center relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-destructive/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="mx-auto w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6 ring-1 ring-destructive/30">
          <XCircle className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tighter mb-2">TRANSACTION_ABORTED</h1>
        <p className="text-muted-foreground font-mono text-sm mb-8">
          Secure payment process was cancelled or failed to complete. No charges were made.
        </p>

        <div className="space-y-4 relative z-10">
          <Button onClick={() => window.history.back()} size="lg" className="w-full font-mono font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90" data-testid="btn-retry-checkout">
            <RefreshCcw className="mr-2 h-4 w-4" /> RETRY_CONNECTION
          </Button>
          
          <Button asChild variant="outline" className="w-full font-mono border-border/50 hover:bg-muted">
            <Link href="/products" data-testid="btn-return-store">
              <ArrowLeft className="mr-2 h-4 w-4" /> RETURN_TO_MARKET
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
