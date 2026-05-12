import { useGetFeaturedProducts } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap, TrendingUp, Terminal, Layers, BarChart2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const NEON_GREEN = "#00FF00";
const NEON_RED   = "#FF0000";

export default function Home() {
  const { data: featuredProducts, isLoading } = useGetFeaturedProducts();

  const categories = [
    { name: "Financial Infographics", icon: TrendingUp, slug: "infographics" },
    { name: "Master AI Prompts", icon: Terminal, slug: "prompts" },
    { name: "Faceless Video Assets", icon: Zap, slug: "video" },
    { name: "Notion Dashboards", icon: Layers, slug: "notion" },
  ];

  return (
    <div className="w-full" style={{ background: "#080a0e" }}>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ borderBottom: "1px solid #1e2330" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${NEON_GREEN}12 0%, transparent 60%)`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `linear-gradient(${NEON_GREEN}08 1px, transparent 1px), linear-gradient(90deg, ${NEON_GREEN}08 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container relative max-w-screen-xl px-4 py-28 md:py-36 flex flex-col items-center text-center">
          <div
            className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-mono font-bold tracking-widest mb-8 animate-in slide-in-from-bottom-4 duration-500"
            style={{
              border: `1px solid ${NEON_GREEN}50`,
              background: `${NEON_GREEN}10`,
              color: NEON_GREEN,
            }}
          >
            <BarChart2 className="mr-2 h-3.5 w-3.5" />
            SYSTEM_ONLINE: MARKETPLACE ACTIVE
          </div>

          <h1
            className="text-5xl md:text-7xl font-extrabold tracking-tighter max-w-4xl mb-6 leading-tight animate-in slide-in-from-bottom-6 duration-700 delay-100"
            style={{ color: "#fff" }}
          >
            WEAPONIZE YOUR <br />
            <span style={{ color: NEON_GREEN }}>CONTENT STRATEGY</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mb-10 font-medium animate-in slide-in-from-bottom-8 duration-700 delay-200" style={{ color: "#8a8f9e" }}>
            High-fidelity financial infographics, AI prompt engineering libraries, and Notion systems for creators who refuse to look average.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-in slide-in-from-bottom-10 duration-700 delay-300">
            <Button
              size="lg"
              asChild
              className="h-12 px-8 font-mono font-black text-base rounded-lg transition-all"
              style={{
                background: NEON_GREEN,
                color: "#0a0d12",
                boxShadow: `0 0 25px ${NEON_GREEN}40`,
                border: "none",
              }}
            >
              <Link href="/products" data-testid="btn-browse-catalog">
                BROWSE CATALOG <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section className="py-10" style={{ borderBottom: "1px solid #1e2330", background: "#0d0f14" }}>
        <div className="container max-w-screen-xl px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/products?category=${encodeURIComponent(cat.name)}`}>
                <div
                  className="flex items-center px-5 py-2.5 rounded-full text-sm font-mono font-bold cursor-pointer transition-all"
                  style={{ background: "#111318", border: "1px solid #1e2330", color: "#8a8f9e" }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = NEON_GREEN;
                    el.style.color = NEON_GREEN;
                    el.style.boxShadow = `0 0 12px ${NEON_GREEN}30`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "#1e2330";
                    el.style.color = "#8a8f9e";
                    el.style.boxShadow = "none";
                  }}
                  data-testid={`category-pill-${cat.slug}`}
                >
                  <cat.icon className="mr-2 h-4 w-4" />
                  {cat.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-24" style={{ background: "#080a0e" }}>
        <div className="container max-w-screen-xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight mb-2 text-white">FEATURED_ASSETS</h2>
              <p className="font-mono text-sm" style={{ color: "#8a8f9e" }}>TOP PERFORMING KITS THIS WEEK</p>
            </div>
            <Button
              variant="outline"
              asChild
              className="font-mono font-bold"
              style={{ borderColor: `${NEON_GREEN}40`, color: NEON_GREEN, background: "transparent" }}
            >
              <Link href="/products" data-testid="btn-view-all">VIEW_ALL_ASSETS</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-48 w-full rounded-xl bg-[#1e2330]" />
                  <Skeleton className="h-4 w-2/3 bg-[#1e2330]" />
                  <Skeleton className="h-4 w-1/2 bg-[#1e2330]" />
                </div>
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: "both" }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-12 rounded-xl"
              style={{ border: "1px dashed #1e2330", background: "#0d0f14" }}
            >
              <p className="font-mono" style={{ color: "#8a8f9e" }}>NO_ASSETS_FOUND</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section
        className="py-16 text-center"
        style={{
          background: `linear-gradient(135deg, #0d0f14 0%, ${NEON_GREEN}08 50%, #0d0f14 100%)`,
          borderTop: `1px solid ${NEON_GREEN}20`,
          borderBottom: `1px solid ${NEON_GREEN}20`,
        }}
      >
        <div className="container max-w-screen-xl px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
            READY TO UPGRADE YOUR EDGE?
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "#8a8f9e" }}>
            Professional-grade digital assets. Pay via Cash App or PayPal. Files delivered within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="h-12 px-10 font-mono font-black rounded-lg transition-all"
              style={{ background: NEON_GREEN, color: "#0a0d12", border: "none", boxShadow: `0 0 25px ${NEON_GREEN}40` }}
            >
              <Link href="/products">SHOP ALL ASSETS</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 px-10 font-mono font-black rounded-lg"
              style={{ borderColor: NEON_RED, color: NEON_RED, background: "transparent" }}
            >
              <a href="mailto:stxpax.aig@gmail.com">CONTACT US</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
