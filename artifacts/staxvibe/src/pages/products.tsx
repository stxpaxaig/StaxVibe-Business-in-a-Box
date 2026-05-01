import { useState } from "react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories, isLoading: isLoadingCategories } = useListCategories();
  
  // Use TanStack query
  const { data: products, isLoading: isLoadingProducts } = useListProducts(
    selectedCategory ? { category: selectedCategory } : {}
  );

  const filteredProducts = products?.filter((p) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-screen-xl px-4 py-8 mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-mono font-bold text-sm text-primary mb-4 tracking-wider flex items-center">
              <Search className="mr-2 h-4 w-4" />
              SEARCH_QUERY
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search assets..."
                className="pl-9 font-mono bg-card border-border/50 focus-visible:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          <div>
            <h3 className="font-mono font-bold text-sm text-primary mb-4 tracking-wider flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              FILTERS
            </h3>
            
            <div className="space-y-2">
              <button
                className={`w-full text-left px-3 py-2 text-sm font-mono rounded-md transition-colors ${
                  selectedCategory === null 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                }`}
                onClick={() => setSelectedCategory(null)}
                data-testid="filter-all"
              >
                ALL_CATEGORIES
              </button>
              
              {isLoadingCategories ? (
                Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-9 w-full bg-card" />)
              ) : categories?.map((cat) => (
                <button
                  key={cat.name}
                  className={`w-full flex items-center justify-between text-left px-3 py-2 text-sm font-mono rounded-md transition-colors ${
                    selectedCategory === cat.name 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                  }`}
                  onClick={() => setSelectedCategory(cat.name)}
                  data-testid={`filter-${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <span className="truncate">{cat.name.toUpperCase()}</span>
                  <Badge variant="secondary" className="ml-2 font-mono text-[10px] px-1 py-0 h-4">
                    {cat.count}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">
              {selectedCategory ? selectedCategory.toUpperCase() : "ALL_ASSETS"}
            </h1>
            <div className="text-sm font-mono text-muted-foreground">
              {filteredProducts?.length || 0} RESULTS
            </div>
          </div>

          {searchQuery && (
            <div className="mb-6 flex items-center">
              <span className="text-sm font-mono text-muted-foreground mr-2">QUERY:</span>
              <Badge variant="outline" className="font-mono border-primary/30 bg-primary/5 text-primary">
                "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="ml-2 hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </div>
          )}

          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-48 w-full rounded-xl bg-card" />
                  <Skeleton className="h-4 w-2/3 bg-card" />
                  <Skeleton className="h-4 w-1/2 bg-card" />
                </div>
              ))}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-border rounded-xl bg-card/30 flex flex-col items-center">
              <Filter className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">NO MATCHING ASSETS</h3>
              <p className="text-muted-foreground font-mono text-sm max-w-md mx-auto">
                No products found matching your current filter criteria. Adjust your search or category selection.
              </p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                className="mt-6 text-sm font-mono text-primary hover:underline underline-offset-4"
              >
                RESET_FILTERS
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
