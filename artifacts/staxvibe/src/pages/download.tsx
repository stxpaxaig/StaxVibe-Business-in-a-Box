import { useParams } from "wouter";
import { useGetDownloadLink, getGetDownloadLinkQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Download as DownloadIcon, AlertTriangle, ShieldAlert, Timer, Terminal } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function Download() {
  const { orderId } = useParams<{ orderId: string }>();
  
  const { data: downloadLink, isLoading, isError } = useGetDownloadLink(Number(orderId), {
    query: { enabled: !!orderId, queryKey: getGetDownloadLinkQueryKey(Number(orderId)) }
  });

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-muted-foreground animate-pulse">DECRYPTING_PAYLOAD...</p>
        </div>
      </div>
    );
  }

  if (isError || !downloadLink) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-destructive/30 bg-card p-8 rounded-xl text-center">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">ACCESS_DENIED</h2>
          <p className="text-muted-foreground font-mono text-sm mb-6">
            Invalid or expired access token. This payload is no longer available.
          </p>
          <Button asChild variant="outline" className="font-mono">
            <Link href="/products">RETURN_TO_MARKET</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isExpired = new Date(downloadLink.expiresAt) < new Date();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full border border-border/50 bg-card/50 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-border/50">
          <Terminal className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-none">SECURE_PAYLOAD_READY</h1>
            <p className="text-xs text-muted-foreground font-mono mt-1">END-TO-END ENCRYPTED TRANSFER</p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <div className="text-xs text-muted-foreground font-mono mb-1">ASSET_IDENTIFIER</div>
            <div className="text-lg font-bold font-mono text-foreground break-all bg-background/50 p-3 rounded border border-border/50">
              {downloadLink.productName}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm font-mono bg-secondary/10 text-secondary p-3 rounded border border-secondary/20">
            <Timer className="w-4 h-4" />
            <span>LINK EXPIRES: {format(new Date(downloadLink.expiresAt), "PPpp")}</span>
          </div>
        </div>

        {isExpired ? (
          <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-destructive">TOKEN_EXPIRED</h4>
              <p className="text-xs text-destructive/80 font-mono mt-1">
                For security reasons, this download link has expired. Please contact support with your order reference.
              </p>
            </div>
          </div>
        ) : (
          <Button 
            asChild 
            size="lg" 
            className="w-full h-16 font-mono font-bold text-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all"
          >
            <a href={downloadLink.url} target="_blank" rel="noopener noreferrer" data-testid="btn-download-file">
              <DownloadIcon className="mr-3 h-5 w-5" /> INITIATE_DOWNLOAD
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
