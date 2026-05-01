import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, ArrowRight, Loader2, Clock, Mail } from "lucide-react";

interface OrderData {
  id: number;
  productName: string;
  amountPaid: number;
  customerEmail: string | null;
  status: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function fetchOrderBySession(sessionId: string): Promise<OrderData | null> {
  const res = await fetch(`${BASE}/api/orders/by-session/${encodeURIComponent(sessionId)}`);
  if (!res.ok) return null;
  return res.json() as Promise<OrderData>;
}

async function fetchOrderById(id: string): Promise<OrderData | null> {
  const res = await fetch(`${BASE}/api/orders`);
  if (!res.ok) return null;
  const orders: OrderData[] = await res.json();
  return orders.find((o) => String(o.id) === id) ?? null;
}

export default function CheckoutSuccess() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");
  const orderId = params.get("order");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      if (cancelled) return;

      let result: OrderData | null = null;

      if (sessionId) {
        result = await fetchOrderBySession(sessionId);
      } else if (orderId) {
        result = await fetchOrderById(orderId);
      }

      if (result) {
        if (!cancelled) {
          setOrder(result);
          setLoading(false);
        }
        return;
      }

      setAttempts((n) => {
        const next = n + 1;
        if (next < 10 && !cancelled) {
          timer = setTimeout(poll, 1500);
        } else if (!cancelled) {
          setLoading(false);
        }
        return next;
      });
    }

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sessionId, orderId]);

  const displayOrderId = order?.id ?? orderId;

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-4">

        {/* Main confirmation card */}
        <div className="relative border border-primary/30 bg-card rounded-2xl overflow-hidden shadow-[0_0_80px_-20px_rgba(0,255,136,0.2)]">
          {/* Top glow accent */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Ambient glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/15 blur-[60px] rounded-full pointer-events-none" />

          <div className="p-8 relative">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </div>
                <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping" />
              </div>
            </div>

            {/* Headline */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-[10px] text-primary tracking-widest font-bold">PAYMENT_CONFIRMED</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-foreground mb-2">
                Transaction Complete
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your payment was verified successfully. Your files are ready to download.
              </p>
            </div>

            {/* Order details */}
            {loading ? (
              <div className="bg-background/60 border border-border rounded-xl p-5 mb-6 flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
                <div>
                  <p className="text-xs font-mono text-muted-foreground">FETCHING_ORDER_DATA</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Syncing with payment processor...</p>
                </div>
              </div>
            ) : order ? (
              <div className="bg-background/60 border border-primary/15 rounded-xl p-5 mb-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground tracking-widest">PURCHASED_ASSET</span>
                  <span className="font-mono text-[10px] text-primary tracking-widest">VERIFIED</span>
                </div>
                <p className="font-bold text-foreground text-base leading-tight">{order.productName}</p>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div>
                    <span className="font-mono text-[10px] text-muted-foreground">ORDER_REF</span>
                    <p className="font-mono text-sm text-secondary font-bold">#{order.id}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[10px] text-muted-foreground">AMOUNT_PAID</span>
                    <p className="font-mono text-sm text-primary font-bold">${order.amountPaid.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ) : displayOrderId ? (
              <div className="bg-background/60 border border-border rounded-xl p-5 mb-6">
                <span className="font-mono text-[10px] text-muted-foreground">ORDER_REF</span>
                <p className="font-mono text-lg text-primary font-bold">#{displayOrderId}</p>
              </div>
            ) : null}

            {/* Download CTA */}
            {!loading && (
              <div className="space-y-3">
                {(order?.id ?? orderId) && (
                  <Button
                    asChild
                    size="lg"
                    className="w-full h-14 font-mono font-black tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 text-base shadow-[0_0_30px_rgba(0,255,136,0.25)]"
                    data-testid="btn-download-files"
                  >
                    <Link href={`/download/${order?.id ?? orderId}`}>
                      <Download className="mr-2 h-5 w-5" />
                      DOWNLOAD_FILES
                    </Link>
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full h-12 font-mono border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                  data-testid="btn-browse-more"
                >
                  <Link href="/products">
                    BROWSE_MORE <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Info pills */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border/60 rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-1">LINK_EXPIRY</p>
              <p className="text-xs text-foreground font-medium leading-snug">Download link valid for 60 minutes</p>
            </div>
          </div>
          <div className="bg-card border border-border/60 rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-1">EMAIL_SENT</p>
              <p className="text-xs text-foreground font-medium leading-snug">
                {order?.customerEmail
                  ? `Sent to ${order.customerEmail}`
                  : "Confirmation sent to your email"}
              </p>
            </div>
          </div>
        </div>

        {/* Keep this email note */}
        <p className="text-center font-mono text-[10px] text-muted-foreground tracking-wider">
          KEEP_THIS_PAGE &mdash; YOUR DOWNLOAD LINK IS ABOVE
        </p>
      </div>
    </div>
  );
}
