import { usePayment } from "@/context/PaymentContext";
import { X, ExternalLink, Send, Package } from "lucide-react";
import { useEffect } from "react";

const CASHAPP_URL = "https://cash.app/$JayKS5991";
const PAYPAL_URL  = "https://paypal.me/justinstanhope";
const RECEIPT_EMAIL = "stxpax.aig@gmail.com";

function getBundle(category: string): { label: string; file: string } {
  if (category.toLowerCase().includes("financial infographic")) {
    return { label: "Bundle 1 — Technical Analysis Pack", file: "bundle1.zip" };
  }
  return { label: "Bundle 2 — Creator & Strategy Pack", file: "bundle2.zip" };
}

function buildMailto(productName: string, price: number, bundle: string): string {
  const subject = encodeURIComponent("StaxVibe Order Verification");
  const body = encodeURIComponent(
    `Hi StaxVibe,\n\nI have sent payment for the following order:\n\n` +
    `Product: ${productName}\n` +
    `Bundle: ${bundle}\n` +
    `Amount: $${price.toFixed(2)}\n\n` +
    `Please find my payment screenshot/receipt attached.\n\n` +
    `Thank you!`
  );
  return `mailto:${RECEIPT_EMAIL}?subject=${subject}&body=${body}`;
}

export function PaymentModal() {
  const { product, closeModal } = usePayment();

  useEffect(() => {
    if (!product) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [product, closeModal]);

  if (!product) return null;

  const bundle = getBundle(product.category);
  const mailto = buildMailto(product.name, product.price, bundle.label);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={closeModal}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#0d0f14", border: "1px solid #1e2330" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Neon top bar */}
        <div style={{ height: 3, background: "linear-gradient(90deg, #00FF88 0%, #00E5CC 60%, transparent 100%)" }} />

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4" style={{ borderBottom: "1px solid #1e2330" }}>
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest mb-3"
              style={{ background: "rgba(0,255,136,0.10)", border: "1px solid rgba(0,255,136,0.25)", color: "#00FF88" }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
              PAYMENT_PORTAL
            </div>
            <h2 className="text-xl font-black text-white leading-tight">{product.name}</h2>
          </div>
          <button
            onClick={closeModal}
            className="ml-4 mt-1 rounded-lg p-2 transition-colors hover:bg-white/10 flex-shrink-0"
            style={{ color: "#8a8f9e" }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Price + bundle */}
          <div className="rounded-xl p-4" style={{ background: "#13161d", border: "1px solid #1e2330" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-mono tracking-widest text-[#8a8f9e] mb-1">AMOUNT_DUE</div>
                <div className="text-4xl font-black font-mono" style={{ color: "#00FF88" }}>
                  ${product.price.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono tracking-widest text-[#8a8f9e] mb-1">YOU_RECEIVE</div>
                <div className="flex items-center gap-1.5 justify-end">
                  <Package className="h-3.5 w-3.5" style={{ color: "#00E5CC" }} />
                  <span className="text-xs font-mono font-bold" style={{ color: "#00E5CC" }}>{bundle.file}</span>
                </div>
                <div className="text-[10px] font-mono text-[#8a8f9e] mt-0.5">{bundle.label}</div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <p className="text-sm text-[#8a8f9e] leading-relaxed">
            Send the <strong className="text-white">exact amount above</strong> via Cash App or PayPal. Once sent, click the button below to email your receipt for file delivery.
          </p>

          {/* Payment buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={CASHAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: "#00D632", color: "#000" }}
            >
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="#00D632"/>
                <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fontWeight="900" fill="#fff">$</text>
              </svg>
              <span className="font-black tracking-wide">Cash App</span>
              <span className="text-[10px] font-mono opacity-80">$JayKS5991</span>
            </a>

            <a
              href={PAYPAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: "#003087", color: "#fff" }}
            >
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="#003087"/>
                <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="13" fontWeight="900" fill="#009CDE">Pay</text>
              </svg>
              <span className="font-black tracking-wide">PayPal</span>
              <span className="text-[10px] font-mono opacity-80">@justinstanhope</span>
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "#1e2330" }} />
            <span className="text-[10px] font-mono text-[#4a4f5e] tracking-widest">AFTER_PAYMENT</span>
            <div className="flex-1 h-px" style={{ background: "#1e2330" }} />
          </div>

          {/* Mailto CTA */}
          <a
            href={mailto}
            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl font-black text-sm font-mono tracking-widest uppercase transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: "#FF3366", color: "#fff" }}
          >
            <Send className="h-4 w-4" />
            I've Sent Payment
          </a>

          {/* Small print */}
          <div className="rounded-lg px-3 py-2.5 text-[11px] font-mono text-[#8a8f9e] leading-relaxed" style={{ background: "rgba(0,229,204,0.06)", border: "1px solid rgba(0,229,204,0.15)" }}>
            <ExternalLink className="inline h-3 w-3 mr-1" style={{ color: "#00E5CC" }} />
            Clicking "I've Sent Payment" opens your email app pre-filled for <span style={{ color: "#00E5CC" }}>stxpax.aig@gmail.com</span>. Attach your payment screenshot — files delivered within 24 hrs.
          </div>
        </div>
      </div>
    </div>
  );
}
