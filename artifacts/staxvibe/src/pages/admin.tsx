import { useState } from "react";
import { useGetAdminStats, useGetRevenueChart, useListProducts, useListOrders, useCreateProduct, useUpdateProduct, useDeleteProduct, getListProductsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Lock, Activity, DollarSign, Package, ShoppingCart, TrendingUp, Plus, Edit, Trash2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "staxadmin2026") {
      setIsAuthenticated(true);
    } else {
      toast({
        title: "ACCESS_DENIED",
        description: "Invalid authorization credentials.",
        variant: "destructive"
      });
      setPassword("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-md">
          <CardHeader className="text-center border-b border-border/50 pb-6 mb-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="font-mono text-xl tracking-widest text-primary">RESTRICTED_ACCESS</CardTitle>
            <CardDescription className="font-mono text-xs">ENTER CLEARANCE CODE TO CONTINUE</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-mono text-center tracking-[0.5em] bg-background/50 border-border/50 h-12"
                  placeholder="••••••••"
                  autoFocus
                  data-testid="input-admin-password"
                />
              </div>
              <Button type="submit" className="w-full font-mono font-bold bg-primary text-primary-foreground hover:bg-primary/90 h-12" data-testid="btn-admin-login">
                AUTHENTICATE
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const { data: stats } = useGetAdminStats();
  const { data: chartData } = useGetRevenueChart();
  const { data: products } = useListProducts();
  const { data: orders } = useListOrders();

  return (
    <div className="container max-w-screen-2xl px-4 py-8 mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter flex items-center">
            <Activity className="mr-3 h-8 w-8 text-primary" />
            COMMAND_CENTER
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">StaxVibe Administration Terminal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">TOTAL_REVENUE</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">${stats?.totalRevenue.toFixed(2) || "0.00"}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">TOTAL_ORDERS</CardTitle>
            <ShoppingCart className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats?.totalOrders || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">ACTIVE_ASSETS</CardTitle>
            <Package className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats?.totalProducts || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">AVG_ORDER_VALUE</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">${stats?.avgOrderValue.toFixed(2) || "0.00"}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-muted/50 border border-border/50 p-1 mb-6">
          <TabsTrigger value="overview" className="font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary" data-testid="tab-overview">OVERVIEW</TabsTrigger>
          <TabsTrigger value="products" className="font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary" data-testid="tab-products">ASSETS_DB</TabsTrigger>
          <TabsTrigger value="orders" className="font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary" data-testid="tab-orders">TRANSACTIONS</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-mono text-sm tracking-widest text-muted-foreground">REVENUE_TELEMETRY</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickFormatter={(val) => format(new Date(val), "MMM dd")}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                        tickFormatter={(val) => `$${val}`}
                      />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                        itemStyle={{ color: 'hsl(var(--primary))' }}
                        labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--background))', stroke: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-mono text-sm tracking-widest text-muted-foreground">TOP_ASSETS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {stats?.topProducts.map((p, i) => (
                    <div key={p.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-6 h-6 rounded bg-muted flex items-center justify-center font-mono text-xs text-muted-foreground shrink-0 border border-border">
                          {i + 1}
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{p.orders} TXs</p>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-primary shrink-0 pl-4">
                        ${p.revenue.toFixed(2)}
                      </div>
                    </div>
                  ))}
                  {(!stats?.topProducts || stats.topProducts.length === 0) && (
                    <div className="text-sm font-mono text-muted-foreground text-center py-4">NO_DATA_AVAILABLE</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-mono text-sm tracking-widest text-muted-foreground">ASSETS_DATABASE</CardTitle>
              <ProductDialog mode="create" />
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-mono text-xs">ID</TableHead>
                      <TableHead className="font-mono text-xs">NAME</TableHead>
                      <TableHead className="font-mono text-xs">CATEGORY</TableHead>
                      <TableHead className="font-mono text-xs">PRICE</TableHead>
                      <TableHead className="font-mono text-xs">STATUS</TableHead>
                      <TableHead className="text-right font-mono text-xs">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products?.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">#{product.id}</TableCell>
                        <TableCell className="font-medium truncate max-w-[200px]">{product.name}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{product.category}</TableCell>
                        <TableCell className="font-mono">${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {product.featured ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-primary/10 text-primary border border-primary/20">
                              FEATURED
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-muted text-muted-foreground border border-border">
                              STANDARD
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <ProductDialog mode="edit" product={product} />
                            <DeleteProductDialog id={product.id} name={product.name} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="font-mono text-sm tracking-widest text-muted-foreground">TRANSACTION_LEDGER</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-mono text-xs">TX_ID</TableHead>
                      <TableHead className="font-mono text-xs">TIMESTAMP</TableHead>
                      <TableHead className="font-mono text-xs">ASSET</TableHead>
                      <TableHead className="font-mono text-xs">EMAIL</TableHead>
                      <TableHead className="font-mono text-xs">AMOUNT</TableHead>
                      <TableHead className="font-mono text-xs">STATUS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders?.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">#{order.id}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{format(new Date(order.createdAt), "yyyy-MM-dd HH:mm")}</TableCell>
                        <TableCell className="font-medium truncate max-w-[200px]">{order.productName}</TableCell>
                        <TableCell className="text-sm truncate max-w-[150px]">{order.customerEmail || "Anonymous"}</TableCell>
                        <TableCell className="font-mono font-bold text-primary">${order.amountPaid.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                            order.status === 'completed' ? 'bg-primary/10 text-primary border-primary/20' :
                            order.status === 'pending' ? 'bg-chart-4/10 text-chart-4 border-chart-4/20' :
                            'bg-destructive/10 text-destructive border-destructive/20'
                          }`}>
                            {order.status.toUpperCase()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductDialog({ mode, product }: { mode: 'create' | 'edit', product?: any }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    category: product?.category || "",
    imageUrl: product?.imageUrl || "",
    fileUrl: product?.fileUrl || "",
    featured: product?.featured || false,
    badge: product?.badge || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      imageUrl: formData.imageUrl || null,
      fileUrl: formData.fileUrl || null,
      badge: formData.badge || null
    };

    if (mode === 'create') {
      createProduct.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          toast({ title: "ASSET_CREATED", description: "Successfully added to databank." });
          setOpen(false);
        }
      });
    } else {
      updateProduct.mutate({ id: product.id, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          toast({ title: "ASSET_UPDATED", description: "Successfully modified in databank." });
          setOpen(false);
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === 'create' ? (
          <Button size="sm" className="font-mono text-xs bg-primary text-primary-foreground hover:bg-primary/90" data-testid="btn-add-product">
            <Plus className="h-3 w-3 mr-1" /> ADD_ASSET
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" data-testid={`btn-edit-product-${product?.id}`}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-primary/20 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-mono tracking-widest text-primary">
            {mode === 'create' ? 'INITIALIZE_NEW_ASSET' : 'MODIFY_ASSET_PARAMETERS'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label className="font-mono text-xs text-muted-foreground">ASSET_NAME</Label>
              <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="font-mono bg-background/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs text-muted-foreground">PRICE_USD</Label>
              <Input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="font-mono bg-background/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs text-muted-foreground">CATEGORY</Label>
              <Input required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="font-mono bg-background/50 border-border/50" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="font-mono text-xs text-muted-foreground">DESCRIPTION</Label>
              <Textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="font-mono bg-background/50 border-border/50 resize-none" rows={3} />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs text-muted-foreground">IMAGE_URL</Label>
              <Input value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="font-mono bg-background/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs text-muted-foreground">FILE_URL</Label>
              <Input value={formData.fileUrl} onChange={(e) => setFormData({...formData, fileUrl: e.target.value})} className="font-mono bg-background/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs text-muted-foreground">BADGE_TAG</Label>
              <Input value={formData.badge} onChange={(e) => setFormData({...formData, badge: e.target.value})} placeholder="e.g. HOT, NEW" className="font-mono bg-background/50 border-border/50" />
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <div className="flex items-center space-x-2 h-10 px-3 rounded-md border border-border/50 bg-background/50">
                <Switch checked={formData.featured} onCheckedChange={(c) => setFormData({...formData, featured: c})} id="featured" />
                <Label htmlFor="featured" className="font-mono text-xs text-muted-foreground cursor-pointer">FEATURED</Label>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-border/50">
            <Button type="submit" className="w-full font-mono font-bold bg-primary text-primary-foreground hover:bg-primary/90" disabled={createProduct.isPending || updateProduct.isPending}>
              {createProduct.isPending || updateProduct.isPending ? 'PROCESSING...' : 'COMMIT_CHANGES'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteProductDialog({ id, name }: { id: number, name: string }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deleteProduct = useDeleteProduct();

  const handleDelete = () => {
    deleteProduct.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        toast({ title: "ASSET_DELETED", description: "Removed from databank." });
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" data-testid={`btn-delete-product-${id}`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] border-destructive/30 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-mono tracking-widest text-destructive flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            CONFIRM_DELETION
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">Are you sure you want to permanently delete asset <span className="font-mono font-bold text-foreground">"{name}"</span>?</p>
          <p className="text-xs font-mono text-destructive/80 mt-2 border border-destructive/20 bg-destructive/5 p-2 rounded">THIS_ACTION_CANNOT_BE_UNDONE</p>
        </div>
        <div className="flex justify-end space-x-2 pt-4 border-t border-border/50">
          <Button variant="outline" onClick={() => setOpen(false)} className="font-mono">ABORT</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteProduct.isPending} className="font-mono font-bold">
            {deleteProduct.isPending ? 'PROCESSING...' : 'EXECUTE_DELETE'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
