import { useGetFeaturedProducts } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap, TrendingUp, Terminal, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featuredProducts, isLoading } = useGetFeaturedProducts();

  const categories = [
    { name: "Financial Infographics", icon: TrendingUp, slug: "infographics" },
    { name: "Master AI Prompts", icon: Terminal, slug: "prompts" },
    { name: "Faceless Video Assets", icon: Zap, slug: "video" },
    { name: "Notion Dashboards", icon: Layers, slug: "notion" },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.apply/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        
        <div className="container relative max-w-screen-xl px-4 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 font-mono animate-in slide-in-from-bottom-4 duration-500">
            <Zap className="mr-2 h-4 w-4" />
            <span>SYSTEM_ONLINE: MARKETPLACE ACTIVE</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter max-w-4xl mb-6 leading-tight animate-in slide-in-from-bottom-6 duration-700 delay-100">
            WEAPONIZE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              CONTENT STRATEGY
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 font-medium animate-in slide-in-from-bottom-8 duration-700 delay-200">
            High-fidelity financial infographics, AI prompt engineering libraries, and Notion systems for creators who refuse to look average.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-in slide-in-from-bottom-10 duration-700 delay-300">
            <Button size="lg" asChild className="h-12 px-8 font-mono font-bold text-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all">
              <Link href="/products" data-testid="btn-browse-catalog">
                BROWSE CATALOG <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 border-b border-border/40 bg-card/30">
        <div className="container max-w-screen-xl px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Link key={category.slug} href={`/products?category=${encodeURIComponent(category.name)}`}>
                <div className="flex items-center px-6 py-3 rounded-full border border-border/50 bg-card hover:border-primary/50 hover:text-primary transition-all cursor-pointer text-sm font-mono font-medium group" data-testid={`category-pill-${category.slug}`}>
                  <category.icon className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="container max-w-screen-xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">FEATURED_ASSETS</h2>
              <p className="text-muted-foreground font-mono text-sm">TOP PERFORMING KITS THIS WEEK</p>
            </div>
            <Button variant="outline" asChild className="font-mono border-primary/20 hover:border-primary/50 hover:bg-primary/10 hover:text-primary">
              <Link href="/products" data-testid="btn-view-all">VIEW_ALL_DATA_SETS</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-48 w-full rounded-xl bg-muted" />
                  <Skeleton className="h-4 w-2/3 bg-muted" />
                  <Skeleton className="h-4 w-1/2 bg-muted" />
                </div>
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <div key={product.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 150}ms`, animationFillMode: "both" }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card/30">
              <p className="text-muted-foreground font-mono">NO_ASSETS_FOUND</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
