import { usePayment } from "@/context/PaymentContext";
import { X, Send, Package } from "lucide-react";
import { useEffect } from "react";

const CASHAPP_URL = "https://cash.app/YOUR_CASHAPP_HANDLE";
const PAYPAL_URL  = "https://paypal.me/YOUR_PAYPAL_HANDLE";
const RECEIPT_EMAIL = "YOUR_EMAIL_FOR_RECEIPTS";

const NEON_GREEN = "#00FF00";
const NEON_RED   = "#FF0000";

function getBundle(category: string): { label: string; file: string } {
  if (category.toLowerCase().includes("financial infographic")) {
    return { label: "BundleZip 1 — Technical Analysis Pack", file: "BundleZip1.zip" };
  }
  return { label: "BundleZip 2 — Market & Crypto Pack", file: "BundleZip2.zip" };
}

function buildMailto(productName: string, price: number, bundle: string): string {
  const subject = encodeURIComponent("StaxVibe Order Verification");
  const body = encodeURIComponent(
    `Hi StaxVibe,\n\nI have sent payment for the following order:\n\n` +
    `Product: ${productName}\n` +
    `Bundle: ${bundle}\n` +
    `Amount: $${price.toFixed(2)}\n\n` +
    `Please find my payment screenshot/receipt attached.\n\nThank you!`
  );
  return `mailto:${RECEIPT_EMAIL}?subject=${subject}&body=${body}`;
}

export function PaymentModal() {
  const { product, closeModal } = usePayment();

  useEffect(() => {
    if (!product) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
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
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md rounded-xl overflow-hidden shadow-2xl"
        style={{ background: "#111318", border: `1px solid ${NEON_GREEN}40` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ height: 3, background: `linear-gradient(90deg, ${NEON_GREEN} 0%, ${NEON_RED} 100%)` }} />

        <div className="flex items-start justify-between p-6 pb-4" style={{ borderBottom: "1px solid #1e2330" }}>
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest mb-3"
              style={{ background: `${NEON_GREEN}18`, border: `1px solid ${NEON_GREEN}50`, color: NEON_GREEN }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: NEON_GREEN }} />
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

        <div className="p-6 space-y-5">
          <div className="rounded-xl p-4" style={{ background: "#0d0f14", border: "1px solid #1e2330" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-mono tracking-widest text-[#8a8f9e] mb-1">AMOUNT_DUE</div>
                <div className="text-4xl font-black font-mono" style={{ color: NEON_GREEN }}>
                  ${product.price.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono tracking-widest text-[#8a8f9e] mb-1">YOU_RECEIVE</div>
                <div className="flex items-center gap-1.5 justify-end">
                  <Package className="h-3.5 w-3.5" style={{ color: NEON_GREEN }} />
                  <span className="text-xs font-mono font-bold" style={{ color: NEON_GREEN }}>{bundle.file}</span>
                </div>
                <div className="text-[10px] font-mono text-[#8a8f9e] mt-0.5">{bundle.label}</div>
              </div>
            </div>
          </div>

          <p className="text-sm text-[#8a8f9e] leading-relaxed">
            Send the <strong className="text-white">exact amount above</strong> via Cash App or PayPal. Once sent, click the button below to email your receipt for verification and file delivery.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={CASHAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{ background: "#00D632", color: "#000", boxShadow: "0 0 0 1px #00D632" }}
            >
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="#00D632"/>
                <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fontWeight="900" fill="#fff">$</text>
              </svg>
              <span className="font-black tracking-wide">Cash App</span>
              <span className="text-[10px] font-mono opacity-90">$J</span>
            </a>

            <a
              href={PAYPAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{ background: "#003087", color: "#fff", boxShadow: "0 0 0 1px #009CDE" }}
            >
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="#003087"/>
                <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="13" fontWeight="900" fill="#009CDE"></text>
              </svg>
              <span className="font-black tracking-wide">PayPal</span>
              <span className="text-[10px] font-mono opacity-80"></span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "#1e2330" }} />
            <span className="text-[10px] font-mono text-[#4a4f5e] tracking-widest">AFTER_PAYMENT</span>
            <div className="flex-1 h-px" style={{ background: "#1e2330" }} />
          </div>

          <a
            href={mailto}
            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl font-black text-sm font-mono tracking-widest uppercase transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]"
            style={{ background: NEON_RED, color: "#fff" }}
          >
            <Send className="h-4 w-4" />
            I've Sent Payment
          </a>

          <div
            className="rounded-lg px-3 py-2.5 text-[11px] font-mono text-[#8a8f9e] leading-relaxed"
            style={{ background: `${NEON_GREEN}0a`, border: `1px solid ${NEON_GREEN}25` }}
          >
            Opens your email app pre-filled for{" "}
            <span style={{ color: NEON_GREEN }}>@YOUR_EMAIL</span>. Attach your payment screenshot — files delivered within 24 hrs.
          </div>
        </div>
      </div>
    </div>
  );
}
