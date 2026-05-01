import { useParams } from "wouter";
import { useGetProduct, useCreateCheckoutSession, getGetProductQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowLeft, Terminal, ShieldCheck, Download as DownloadIcon } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useGetProduct(Number(id), { 
    query: { enabled: !!id, queryKey: getGetProductQueryKey(Number(id)) } 
  });
  
  const createCheckout = useCreateCheckoutSession();
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleCheckout = () => {
    createCheckout.mutate({
      data: {
        productId: Number(id),
        customerEmail: email || null
      }
    }, {
      onSuccess: (session) => {
        window.location.href = session.url;
      },
      onError: () => {
        toast({
          title: "CHECKOUT_ERROR",
          description: "Failed to initialize secure checkout. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const getCategoryImage = (category: string) => {
    if (category.toLowerCase().includes("notion")) return "/images/notion-dash.png";
    if (category.toLowerCase().includes("video")) return "/images/video-assets.png";
    if (category.toLowerCase().includes("prompt")) return "/images/prompts.png";
    return "/images/infographics.png";
  };

  const getBadgeColor = (badge: string | null) => {
    if (!badge) return "bg-primary";
    const b = badge.toUpperCase();
    if (b === "TRENDING") return "bg-accent text-accent-foreground";
    if (b === "HOT") return "bg-destructive text-destructive-foreground";
    if (b === "NEW") return "bg-secondary text-secondary-foreground";
    return "bg-primary text-primary-foreground";
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
            <Skeleton className="h-16 w-full bg-card" />
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

  return (
    <div className="container max-w-screen-xl px-4 py-8 mx-auto">
      <Link href="/products" className="inline-flex items-center text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> BACK_TO_CATALOG
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Visual Column */}
        <div className="space-y-6">
          <div className="relative aspect-video rounded-xl overflow-hidden border border-border/50 bg-muted group">
            <img
              src={product.imageUrl || getCategoryImage(product.category)}
              alt={product.name}
              className="object-cover w-full h-full"
            />
            {product.badge && (
              <Badge className={`absolute top-4 right-4 font-mono font-bold text-sm px-3 py-1 ${getBadgeColor(product.badge)} border-none shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                {product.badge === "HOT" || product.badge === "TRENDING" ? <Zap className="mr-2 h-4 w-4 inline" /> : null}
                {product.badge}
              </Badge>
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="border border-border/50 bg-card/30 rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <ShieldCheck className="h-6 w-6 text-primary mb-2" />
              <span className="text-[10px] font-mono text-muted-foreground">SECURE_TRANSACTION</span>
            </div>
            <div className="border border-border/50 bg-card/30 rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <DownloadIcon className="h-6 w-6 text-secondary mb-2" />
              <span className="text-[10px] font-mono text-muted-foreground">INSTANT_DELIVERY</span>
            </div>
            <div className="border border-border/50 bg-card/30 rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <Terminal className="h-6 w-6 text-accent mb-2" />
              <span className="text-[10px] font-mono text-muted-foreground">LIFETIME_ACCESS</span>
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="flex flex-col">
          <div className="mb-2 inline-flex items-center text-xs font-mono font-bold text-primary/80 tracking-widest uppercase">
            // {product.category}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 leading-tight">
            {product.name}
          </h1>
          
          <div className="text-3xl font-mono font-bold text-foreground mb-8 pb-8 border-b border-border/40">
            ${product.price.toFixed(2)}
          </div>

          <div className="prose prose-invert prose-p:text-muted-foreground max-w-none mb-10">
            <p className="text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-auto border border-border/50 bg-card p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
            
            <h3 className="font-mono text-sm font-bold text-foreground mb-4">INITIATE_ACQUISITION</h3>
            
            <div className="space-y-4 relative z-10">
              <div>
                <Input 
                  type="email" 
                  placeholder="Enter email for receipt (optional)" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-mono bg-background/50 border-border/50 focus-visible:ring-primary/50"
                  data-testid="input-checkout-email"
                />
              </div>
              
              <Button 
                size="lg" 
                className="w-full h-14 font-mono font-bold text-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all"
                onClick={handleCheckout}
                disabled={createCheckout.isPending}
                data-testid="btn-checkout"
              >
                {createCheckout.isPending ? "PROCESSING..." : `SECURE_PAYMENT -> $${product.price.toFixed(2)}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
