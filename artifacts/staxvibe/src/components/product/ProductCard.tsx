import { Link } from "wouter";
import type { Product } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, ShoppingBag } from "lucide-react";
import { usePayment } from "@/context/PaymentContext";

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

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    openModal({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    });
  }

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-border/50 bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(0,255,136,0.15)] flex flex-col" data-testid={`card-product-${product.id}`}>
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={product.imageUrl || getCategoryImage(product.category)}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          {product.badge && (
            <Badge className={`absolute top-3 right-3 font-mono font-bold ${getBadgeColor(product.badge)} border-none shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
              {product.badge === "HOT" || product.badge === "TRENDING" ? <Zap className="mr-1 h-3 w-3 inline" /> : null}
              {product.badge}
            </Badge>
          )}
          <div className="absolute bottom-3 left-3 text-2xl font-bold font-mono text-white drop-shadow-md">
            ${product.price.toFixed(2)}
          </div>
        </div>
        <CardHeader className="p-4 pb-2">
          <div className="text-xs font-mono text-primary/80 mb-1 line-clamp-1">{product.category.toUpperCase()}</div>
          <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-1">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <button
            onClick={handleBuyNow}
            data-testid={`btn-buy-${product.id}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-mono font-bold text-sm tracking-wider transition-all hover:opacity-90"
            style={{ background: "#00FF88", color: "#0a0d12" }}
          >
            <ShoppingBag className="h-4 w-4" />
            BUY NOW
          </button>
        </CardFooter>
      </Card>
    </Link>
  );
}
