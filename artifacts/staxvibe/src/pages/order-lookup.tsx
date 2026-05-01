import { useState } from "react";
import { Link } from "wouter";

interface OrderResult {
  id: number;
  productName: string;
  amountPaid: number;
  createdAt: string;
  downloadUrl: string;
  expiresAt: string;
}

export default function OrderLookup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderResult[] | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    setOrders(null);
    setSearched(false);

    try {
      const res = await fetch("/api/orders/lookup-by-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lookup failed");
      setOrders(data.orders);
      setSearched(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0d12] px-4 py-16">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-block px-3 py-1 mb-5 text-[10px] font-bold tracking-widest border rounded-full font-mono"
            style={{ color: "#00E5CC", borderColor: "rgba(0,229,204,0.25)", background: "rgba(0,229,204,0.07)" }}
          >
            ● ORDER_RECOVERY
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Retrieve Your Downloads</h1>
          <p className="text-[#8a8f9e] text-sm leading-relaxed">
            Lost your confirmation email? Enter the email address you used at checkout
            and we'll find all your completed orders.
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl border p-8 mb-6"
          style={{ background: "#13161d", borderColor: "#1e2330" }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold tracking-widest font-mono text-[#8a8f9e] mb-2">
                CUSTOMER_EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg px-4 py-3 text-sm font-mono text-white placeholder-[#4a4f5e] outline-none focus:ring-2 transition-all"
                style={{
                  background: "#0d0f14",
                  border: "1px solid #1e2330",
                  focusRingColor: "#00FF88",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#00FF88")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1e2330")}
              />
            </div>

            {error && (
              <div
                className="rounded-lg px-4 py-3 text-sm font-mono"
                style={{ background: "rgba(255,51,102,0.08)", border: "1px solid rgba(255,51,102,0.25)", color: "#FF3366" }}
              >
                ✗ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full py-4 rounded-xl font-black text-sm tracking-widest font-mono uppercase transition-all disabled:opacity-40"
              style={{ background: "#00FF88", color: "#0a0d12" }}
            >
              {loading ? "SCANNING..." : "FIND MY ORDERS →"}
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && orders !== null && (
          <div>
            {orders.length === 0 ? (
              <div
                className="rounded-xl border p-8 text-center"
                style={{ background: "#13161d", borderColor: "#1e2330" }}
              >
                <div className="text-3xl mb-3">◎</div>
                <p className="text-[#8a8f9e] text-sm font-mono">
                  NO_ORDERS_FOUND for this email address.
                </p>
                <p className="text-[#4a4f5e] text-xs mt-2">
                  Try a different email, or check for a typo.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-[10px] font-mono font-bold tracking-widest text-[#8a8f9e] mb-1">
                  FOUND {orders.length} ORDER{orders.length !== 1 ? "S" : ""}
                </div>
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer links */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="text-xs font-mono tracking-widest text-[#4a4f5e] hover:text-[#00FF88] transition-colors"
          >
            ← BACK TO MARKETPLACE
          </Link>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: OrderResult }) {
  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const expiry = new Date(order.expiresAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: "#13161d", borderColor: "#1e2330" }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono font-bold tracking-widest text-[#8a8f9e] mb-1">PURCHASED_ASSET</div>
          <div className="text-white font-bold text-sm leading-snug">{order.productName}</div>
        </div>
        <div
          className="text-[10px] font-mono font-bold px-2 py-1 rounded-full flex-shrink-0"
          style={{ background: "rgba(0,255,136,0.10)", color: "#00FF88", border: "1px solid rgba(0,255,136,0.2)" }}
        >
          COMPLETED
        </div>
      </div>

      {/* Meta row */}
      <div className="flex gap-6 mb-4 pb-4" style={{ borderBottom: "1px solid #1e2330" }}>
        <div>
          <div className="text-[10px] font-mono text-[#8a8f9e] tracking-widest">ORDER_ID</div>
          <div className="text-[#00E5CC] font-mono font-bold text-sm">#{order.id}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-[#8a8f9e] tracking-widest">AMOUNT_PAID</div>
          <div className="text-white font-mono font-bold text-sm">${order.amountPaid.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-[#8a8f9e] tracking-widest">PURCHASE_DATE</div>
          <div className="text-white font-mono font-bold text-sm">{date}</div>
        </div>
      </div>

      {/* Expiry warning */}
      <div
        className="text-[10px] font-mono mb-3 px-2 py-1.5 rounded-md"
        style={{ background: "rgba(255,51,102,0.07)", color: "#FF3366", border: "1px solid rgba(255,51,102,0.15)" }}
      >
        ⚠ Link expires today at {expiry} — download before then
      </div>

      {/* Download button */}
      <a
        href={order.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center py-3 rounded-xl font-black text-xs font-mono tracking-widest uppercase transition-opacity hover:opacity-90"
        style={{ background: "#00FF88", color: "#0a0d12" }}
      >
        ↓ DOWNLOAD_FILES
      </a>
    </div>
  );
}
