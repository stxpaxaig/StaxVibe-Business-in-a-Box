import { Resend } from "resend";
import { logger } from "./logger";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export function buildDownloadEmailHtml(opts: {
  productName: string;
  downloadUrl: string;
  expiresAt: string;
  orderId: number | string;
}): string {
  const { productName, downloadUrl, expiresAt, orderId } = opts;
  const expiry = new Date(expiresAt).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your StaxVibe Order is Ready</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
    body { margin: 0; padding: 0; background-color: #0d0f14; font-family: 'Inter', sans-serif; color: #f2f2f2; -webkit-font-smoothing: antialiased; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 16px; }
    .card { background: #13161d; border: 1px solid #1e2330; border-radius: 16px; overflow: hidden; }
    .header { padding: 36px 40px 28px; border-bottom: 1px solid #1e2330; position: relative; overflow: hidden; }
    .header::before { content: ''; position: absolute; top: -40px; right: -40px; width: 180px; height: 180px; background: radial-gradient(circle, rgba(0,255,136,0.12) 0%, transparent 70%); pointer-events: none; }
    .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
    .logo-icon { width: 32px; height: 32px; background: #00FF88; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
    .logo-text { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; color: #f2f2f2; }
    .logo-text span { color: #00FF88; }
    .status-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.25); border-radius: 99px; padding: 4px 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #00FF88; letter-spacing: 0.05em; margin-bottom: 16px; }
    .status-dot { width: 6px; height: 6px; background: #00FF88; border-radius: 50%; }
    .header h1 { margin: 0 0 8px; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; color: #f2f2f2; line-height: 1.2; }
    .header p { margin: 0; font-size: 14px; color: #8a8f9e; line-height: 1.6; }
    .body { padding: 32px 40px; }
    .product-block { background: #0d0f14; border: 1px solid #1e2330; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; }
    .product-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #8a8f9e; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
    .product-name { font-size: 18px; font-weight: 700; color: #f2f2f2; margin: 0 0 8px; }
    .order-ref { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #8a8f9e; }
    .order-ref span { color: #00E5CC; }
    .cta-section { text-align: center; margin-bottom: 28px; }
    .cta-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8a8f9e; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 14px; }
    .cta-btn { display: inline-block; background: #00FF88; color: #0a0d12; font-weight: 800; font-size: 15px; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.06em; text-decoration: none; padding: 16px 40px; border-radius: 8px; text-transform: uppercase; }
    .expiry-box { background: rgba(255,51,102,0.07); border: 1px solid rgba(255,51,102,0.2); border-radius: 8px; padding: 12px 16px; margin-bottom: 28px; display: flex; align-items: flex-start; gap: 10px; }
    .expiry-icon { font-size: 16px; flex-shrink: 0; line-height: 1.4; }
    .expiry-text { font-size: 13px; color: #c0c4d0; line-height: 1.5; }
    .expiry-text strong { color: #FF3366; }
    .url-fallback { background: #0d0f14; border: 1px solid #1e2330; border-radius: 8px; padding: 14px 16px; margin-bottom: 28px; }
    .url-fallback-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #8a8f9e; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }
    .url-fallback-link { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #00E5CC; word-break: break-all; }
    .divider { height: 1px; background: #1e2330; margin: 0 -40px 28px; }
    .footer { padding: 24px 40px; text-align: center; }
    .footer p { font-size: 12px; color: #4a4f5e; margin: 0 0 6px; line-height: 1.6; }
    .footer a { color: #00FF88; text-decoration: none; }
    .ticker { display: flex; gap: 16px; justify-content: center; margin-top: 16px; }
    .ticker-item { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #4a4f5e; }
    .ticker-item span { color: #00FF88; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <!-- Header -->
      <div class="header">
        <div class="logo">
          <div class="logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0d12" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </div>
          <div class="logo-text">STAX<span>VIBE</span></div>
        </div>
        <div class="status-pill"><span class="status-dot"></span>PAYMENT_CONFIRMED</div>
        <h1>Your files are ready.</h1>
        <p>Transaction verified. Your secure download token has been generated and is ready to use. Click the button below to access your files immediately.</p>
      </div>

      <!-- Body -->
      <div class="body">

        <!-- Product Info -->
        <div class="product-block">
          <div class="product-label">PURCHASED_ASSET</div>
          <div class="product-name">${productName}</div>
          <div class="order-ref">ORDER_ID: <span>#${orderId}</span></div>
        </div>

        <!-- CTA Button -->
        <div class="cta-section">
          <div class="cta-label">ACCESS_YOUR_FILES</div>
          <a href="${downloadUrl}" class="cta-btn">DOWNLOAD NOW</a>
        </div>

        <!-- Expiry Warning -->
        <div class="expiry-box">
          <div class="expiry-icon">&#9888;</div>
          <div class="expiry-text">
            This download link expires on <strong>${expiry}</strong>. After expiry, the link will no longer work. Download your files before then and store them in a safe location.
          </div>
        </div>

        <!-- Fallback URL -->
        <div class="url-fallback">
          <div class="url-fallback-label">BACKUP_LINK</div>
          <div class="url-fallback-link">${downloadUrl}</div>
        </div>

        <div class="divider"></div>

        <p style="font-size: 13px; color: #8a8f9e; line-height: 1.7; margin: 0;">
          If the download button doesn't work, copy and paste the backup link into your browser. If you run into any issues, keep this email as proof of purchase.
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="ticker">
          <div class="ticker-item">BTC <span>+2.4%</span></div>
          <div class="ticker-item">ETH <span>+1.8%</span></div>
          <div class="ticker-item">SPY <span>+0.6%</span></div>
          <div class="ticker-item">NVDA <span>+3.1%</span></div>
        </div>
        <p style="margin-top: 16px;">
          &copy; 2026 StaxVibe AI Graphics. Premium financial content for traders and creators.<br/>
          You received this because you made a purchase at <a href="#">staxvibe.com</a>.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(opts: {
  to: string;
  productName: string;
  downloadUrl: string;
  expiresAt: string;
  orderId: number | string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    logger.warn("RESEND_API_KEY not set — skipping email delivery");
    return false;
  }

  const fromDomain = process.env.RESEND_FROM_EMAIL ?? "orders@staxvibe.com";

  const { data, error } = await resend.emails.send({
    from: `StaxVibe AI Graphics <${fromDomain}>`,
    to: [opts.to],
    subject: `Your download is ready: ${opts.productName}`,
    html: buildDownloadEmailHtml(opts),
  });

  if (error) {
    logger.error({ error }, "Failed to send order confirmation email");
    return false;
  }

  logger.info({ emailId: data?.id, to: opts.to }, "Order confirmation email sent");
  return true;
}
