import { Link } from "wouter";
import type { Product } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, ShoppingBag } from "lucide-react";
import { usePayment } from "@/context/PaymentContext";
import { PRODUCT_GALLERY } from "@/lib/productGallery";

const NEON_GREEN = "#00FF00";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { openModal } = usePayment();

  const getBadgeColor = (badge: string | null) => {
    if (!badge) return "bg-primary";
    const b = badge.toUpperCase();
    if (b === "TRENDING") return "bg-accent text-accent-foreground";
    if (b === "HOT") return "bg-destructive text-destructive-foreground";
    if (b === "NEW") return "bg-secondary text-secondary-foreground";
    return "bg-primary text-primary-foreground";
  };

  const getCategoryImage = (category: string) => {
    if (category.toLowerCase().includes("notion")) return "/images/notion-dash.png";
    if (category.toLowerCase().includes("video")) return "/images/video-assets.png";
    if (category.toLowerCase().includes("prompt")) return "/images/prompts.png";
    return "/images/infographics.png";
  };

  const gallery = PRODUCT_GALLERY[product.id] ?? [];
  const heroSrc = gallery[0] ?? product.imageUrl ?? getCategoryImage(product.category);

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    openModal({ id: product.id, name: product.name, price: product.price, category: product.category });
  }

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <Card
        className="h-full overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
        style={{
          background: "#0d0f14",
          border: "1px solid #1e2330",
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = `${NEON_GREEN}80`)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e2330")}
        data-testid={`card-product-${product.id}`}
      >
        {/* Hero image with neon border */}
        <div
          className="relative aspect-video overflow-hidden"
          style={{ borderBottom: "1px solid #1e2330" }}
        >
          <img
            src={heroSrc}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            style={{ outline: `1px solid ${NEON_GREEN}` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14]/90 to-transparent" />
          {product.badge && (
            <Badge
              className={`absolute top-3 right-3 font-mono font-bold border-none shadow-lg ${getBadgeColor(product.badge)}`}
            >
              {(product.badge === "HOT" || product.badge === "TRENDING") && (
                <Zap className="mr-1 h-3 w-3 inline" />
              )}
              {product.badge}
            </Badge>
          )}
          <div className="absolute bottom-3 left-3 text-2xl font-bold font-mono text-white drop-shadow-md">
            ${product.price.toFixed(2)}
          </div>
        </div>

        <CardHeader className="p-4 pb-2">
          <div className="text-xs font-mono mb-1 line-clamp-1" style={{ color: `${NEON_GREEN}cc` }}>
            {product.category.toUpperCase()}
          </div>
          <CardTitle className="text-lg font-bold line-clamp-2 transition-colors text-white group-hover:text-[#00FF00]">
            {product.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-1">
          <p className="text-sm text-[#8a8f9e] line-clamp-2">{product.description}</p>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <button
            onClick={handleBuyNow}
            data-testid={`btn-buy-${product.id}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-mono font-black text-sm tracking-wider transition-all"
            style={{
              background: NEON_GREEN,
              color: "#0a0d12",
              boxShadow: `0 0 15px ${NEON_GREEN}30`,
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 25px ${NEON_GREEN}60`)}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 15px ${NEON_GREEN}30`)}
          >
            <ShoppingBag className="h-4 w-4" />
            BUY NOW
          </button>
        </CardFooter>
      </Card>
    </Link>
  );
}
