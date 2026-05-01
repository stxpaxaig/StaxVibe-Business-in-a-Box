import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, ExternalLink } from "lucide-react";

export default function CheckoutSuccess() {
  // Try to get session info if returned in URL, or just show general success
  const searchParams = new URLSearchParams(window.location.search);
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full border border-primary/30 bg-card/30 backdrop-blur-sm p-8 rounded-2xl shadow-[0_0_50px_-12px_rgba(0,255,136,0.15)] text-center relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 ring-1 ring-primary/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tighter mb-2">TRANSACTION_COMPLETE</h1>
        <p className="text-muted-foreground font-mono text-sm mb-8">
          Payment verified. Your secure access token has been generated.
        </p>

        {orderId && (
          <div className="bg-background/50 border border-border/50 rounded-lg p-4 mb-8 flex flex-col items-center">
            <span className="text-xs text-muted-foreground font-mono mb-1">ORDER_REF</span>
            <span className="font-mono font-bold tracking-widest text-primary">{orderId}</span>
          </div>
        )}

        <div className="space-y-4 relative z-10">
          {orderId ? (
            <Button asChild size="lg" className="w-full font-mono font-bold bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href={`/download/${orderId}`} data-testid="btn-go-to-download">
                <Download className="mr-2 h-4 w-4" /> ACCESS_FILES
              </Link>
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground font-mono border border-dashed border-border p-4 rounded-md">
              Please check your email for the secure download link.
            </p>
          )}
          
          <Button asChild variant="outline" className="w-full font-mono border-border/50 hover:bg-muted">
            <Link href="/products" data-testid="btn-continue-shopping">
              <ExternalLink className="mr-2 h-4 w-4" /> CONTINUE_BROWSING
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
