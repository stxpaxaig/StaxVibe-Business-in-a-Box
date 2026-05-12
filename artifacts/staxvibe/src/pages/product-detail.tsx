import { useParams } from "wouter";
import { useGetProduct, getGetProductQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowLeft, ShieldCheck, Download as DownloadIcon, Terminal, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { usePayment } from "@/context/PaymentContext";
import { PRODUCT_GALLERY } from "@/lib/productGallery";
import { useState } from "react";

const NEON_GREEN = "#00FF00";
const NEON_RED   = "#FF0000";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useGetProduct(Number(id), {
    query: { enabled: !!id, queryKey: getGetProductQueryKey(Number(id)) },
  });
  const { openModal } = usePayment();
  const [activeImg, setActiveImg] = useState(0);

  const getCategoryImage = (category: string) => {
    if (category.toLowerCase().includes("notion")) return "/images/notion-dash.png";
    if (category.toLowerCase().includes("video")) return "/images/video-assets.png";
    if (category.toLowerCase().includes("prompt")) return "/images/prompts.png";
    return "/images/infographics.png";
  };

  const getBadgeColor = (badge: string | null) => {
    if (!badge) return "";
    const b = badge.toUpperCase();
    if (b === "HOT") return "destructive";
    if (b === "TRENDING") return "accent";
    return "secondary";
  };

  if (isLoading) {
    return (
      <div className="container max-w-screen-xl px-4 py-12 mx-auto">
        <Skeleton className="h-8 w-24 mb-8 bg-card" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-video w-full rounded-xl bg-card" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4 bg-card" />
            <Skeleton className="h-6 w-1/4 bg-card" />
            <Skeleton className="h-32 w-full bg-card" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container max-w-screen-xl px-4 py-24 mx-auto text-center">
        <h1 className="text-3xl font-bold font-mono mb-4">ASSET_NOT_FOUND</h1>
        <p className="text-muted-foreground mb-8">The requested digital asset could not be located in the databank.</p>
        <Button asChild variant="outline" className="font-mono">
          <Link href="/products">RETURN_TO_MARKETPLACE</Link>
        </Button>
      </div>
    );
  }

  const gallery = PRODUCT_GALLERY[product.id] ?? [];
  const heroSrc = gallery[activeImg] ?? product.imageUrl ?? getCategoryImage(product.category);

  function handleBuyNow() {
    openModal({ id: product!.id, name: product!.name, price: product!.price, category: product!.category });
  }

  return (
    <div className="container max-w-screen-xl px-4 py-8 mx-auto">
      <Link
        href="/products"
        className="inline-flex items-center text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> BACK_TO_CATALOG
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Visual column */}
        <div className="space-y-4">
          {/* Hero image */}
          <div
            className="relative aspect-video rounded-xl overflow-hidden bg-[#0d0f14]"
            style={{ border: `1px solid ${NEON_GREEN}` }}
          >
            <img
              src={heroSrc}
              alt={product.name}
              className="object-cover w-full h-full transition-opacity duration-300"
            />
            {product.badge && (
              <Badge
                className="absolute top-4 right-4 font-mono font-bold text-sm px-3 py-1 border-none shadow-lg"
                variant={getBadgeColor(product.badge) as any}
              >
                {(product.badge === "HOT" || product.badge === "TRENDING") && (
                  <Zap className="mr-2 h-4 w-4 inline" />
                )}
                {product.badge}
              </Badge>
            )}
          </div>

          {/* 4-image gallery grid */}
          {gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className="relative aspect-square rounded-lg overflow-hidden transition-all duration-200 hover:scale-[1.03]"
                  style={{
                    border: activeImg === i
                      ? `2px solid ${NEON_GREEN}`
                      : `1px solid #1e2330`,
                    boxShadow: activeImg === i
                      ? `0 0 12px ${NEON_GREEN}60`
                      : "none",
                  }}
                >
                  <img
                    src={src}
                    alt={`${product.name} preview ${i + 1}`}
                    className="object-cover w-full h-full"
                  />
                  {activeImg === i && (
                    <div
                      className="absolute inset-0"
                      style={{ background: `${NEON_GREEN}15` }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: ShieldCheck, label: "SECURE_PAYMENT", color: NEON_GREEN },
              { icon: DownloadIcon, label: "FILE_DELIVERY", color: NEON_GREEN },
              { icon: Terminal, label: "LIFETIME_ACCESS", color: NEON_GREEN },
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className="rounded-lg p-4 flex flex-col items-center justify-center text-center"
                style={{ background: "#0d0f14", border: "1px solid #1e2330" }}
              >
                <Icon className="h-5 w-5 mb-2" style={{ color }} />
                <span className="text-[10px] font-mono text-[#8a8f9e]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content column */}
        <div className="flex flex-col">
          <div className="mb-2 text-xs font-mono font-bold tracking-widest uppercase" style={{ color: `${NEON_GREEN}cc` }}>
            // {product.category}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 leading-tight text-white">
            {product.name}
          </h1>

          <div
            className="text-3xl font-mono font-bold mb-8 pb-8"
            style={{ color: NEON_GREEN, borderBottom: "1px solid #1e2330" }}
          >
            ${product.price.toFixed(2)}
          </div>

          <div className="mb-10">
            <p className="text-lg leading-relaxed text-[#b0b5c0]">{product.description}</p>
          </div>

          {/* Buy Now Panel */}
          <div
            className="mt-auto p-6 rounded-xl relative overflow-hidden"
            style={{ background: "#0d0f14", border: `1px solid ${NEON_GREEN}40` }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at top right, ${NEON_GREEN}08 0%, transparent 70%)` }}
            />
            <h3 className="font-mono text-sm font-bold text-white mb-1">ACQUIRE_THIS_ASSET</h3>
            <p className="text-xs font-mono mb-5" style={{ color: "#8a8f9e" }}>
              Pay via Cash App or PayPal — files delivered within 24 hrs via email.
            </p>
            <button
              onClick={handleBuyNow}
              data-testid="btn-checkout"
              className="relative z-10 w-full h-14 flex items-center justify-center gap-3 rounded-xl font-mono font-black text-lg tracking-wider transition-all"
              style={{
                background: NEON_GREEN,
                color: "#0a0d12",
                boxShadow: `0 0 25px ${NEON_GREEN}40`,
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 40px ${NEON_GREEN}70`)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 25px ${NEON_GREEN}40`)}
            >
              <ShoppingBag className="h-5 w-5" />
              BUY NOW — ${product.price.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
