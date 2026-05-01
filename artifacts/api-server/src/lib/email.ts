import nodemailer from "nodemailer";
import { logger } from "./logger";

function createTransporter(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: port ? Number(port) : 587,
    secure: port === "465",
    auth: { user, pass },
  });
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
    body { margin:0; padding:0; background-color:#0d0f14; font-family:Arial,Helvetica,sans-serif; color:#f2f2f2; -webkit-font-smoothing:antialiased; }
    .wrapper { max-width:600px; margin:0 auto; padding:40px 16px; }
    .card { background:#13161d; border:1px solid #1e2330; border-radius:16px; overflow:hidden; }

    /* top neon bar */
    .topbar { height:3px; background:linear-gradient(90deg, transparent 0%, #00FF88 40%, #00E5CC 70%, transparent 100%); }

    /* header */
    .header { padding:36px 40px 28px; border-bottom:1px solid #1e2330; position:relative; }
    .header-glow { position:absolute; top:-40px; right:-40px; width:200px; height:200px; background:radial-gradient(circle, rgba(0,255,136,0.10) 0%, transparent 70%); pointer-events:none; }
    .logo { display:flex; align-items:center; gap:10px; margin-bottom:24px; }
    .logo-box { width:34px; height:34px; background:#00FF88; border-radius:7px; display:flex; align-items:center; justify-content:center; }
    .logo-text { font-size:20px; font-weight:900; letter-spacing:-0.5px; color:#f2f2f2; font-family:Arial,sans-serif; }
    .logo-text span { color:#00FF88; }
    .status-pill { display:inline-block; background:rgba(0,255,136,0.10); border:1px solid rgba(0,255,136,0.25); border-radius:99px; padding:4px 14px; font-size:11px; font-weight:700; color:#00FF88; letter-spacing:0.08em; font-family:'Courier New',monospace; margin-bottom:16px; }
    .header h1 { margin:0 0 8px; font-size:28px; font-weight:900; color:#f2f2f2; line-height:1.2; }
    .header p { margin:0; font-size:14px; color:#8a8f9e; line-height:1.65; }

    /* body */
    .body { padding:32px 40px; }

    /* product block */
    .product-block { background:#0d0f14; border:1px solid #1e2330; border-radius:12px; padding:20px 24px; margin-bottom:28px; }
    .label { font-family:'Courier New',monospace; font-size:10px; font-weight:700; color:#8a8f9e; letter-spacing:0.10em; text-transform:uppercase; margin-bottom:8px; }
    .product-name { font-size:18px; font-weight:700; color:#f2f2f2; margin:0 0 10px; }
    .order-meta { display:flex; gap:24px; }
    .meta-item { }
    .meta-key { font-family:'Courier New',monospace; font-size:10px; color:#8a8f9e; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:3px; }
    .meta-val { font-family:'Courier New',monospace; font-size:13px; font-weight:700; }
    .meta-val.green { color:#00FF88; }
    .meta-val.teal { color:#00E5CC; }

    /* CTA */
    .cta-wrap { text-align:center; margin-bottom:28px; }
    .cta-sublabel { font-family:'Courier New',monospace; font-size:10px; color:#8a8f9e; letter-spacing:0.10em; text-transform:uppercase; margin-bottom:14px; }
    .cta-btn { display:inline-block; background:#00FF88; color:#0a0d12; font-weight:900; font-size:15px; font-family:'Courier New',monospace; letter-spacing:0.07em; text-decoration:none; padding:17px 48px; border-radius:9px; text-transform:uppercase; }

    /* expiry warning */
    .warn-box { background:rgba(255,51,102,0.07); border:1px solid rgba(255,51,102,0.22); border-radius:9px; padding:14px 18px; margin-bottom:28px; }
    .warn-inner { display:flex; gap:12px; align-items:flex-start; }
    .warn-icon { font-size:17px; line-height:1.4; flex-shrink:0; }
    .warn-text { font-size:13px; color:#c0c4d0; line-height:1.6; }
    .warn-text strong { color:#FF3366; }

    /* fallback url */
    .url-box { background:#0d0f14; border:1px solid #1e2330; border-radius:9px; padding:14px 18px; margin-bottom:28px; }
    .url-link { font-family:'Courier New',monospace; font-size:11px; color:#00E5CC; word-break:break-all; }

    /* divider */
    .divider { height:1px; background:#1e2330; margin:0 -40px 24px; }

    .tip-text { font-size:13px; color:#8a8f9e; line-height:1.7; margin:0; }

    /* ticker bar */
    .ticker { display:flex; gap:20px; justify-content:center; margin-bottom:16px; }
    .tick { font-family:'Courier New',monospace; font-size:10px; color:#4a4f5e; letter-spacing:0.05em; }
    .tick span { color:#00FF88; }
    .tick .red { color:#FF3366; }

    /* footer */
    .footer { padding:24px 40px; border-top:1px solid #1e2330; text-align:center; }
    .footer p { font-size:12px; color:#4a4f5e; margin:6px 0; line-height:1.65; }
    .footer a { color:#00FF88; text-decoration:none; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="card">
    <div class="topbar"></div>

    <!-- HEADER -->
    <div class="header">
      <div class="header-glow"></div>

      <div class="logo">
        <div class="logo-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0d12" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
            <polyline points="16 7 22 7 22 13"/>
          </svg>
        </div>
        <div class="logo-text">STAX<span>VIBE</span></div>
      </div>

      <div class="status-pill">&#9679; PAYMENT_CONFIRMED</div>
      <h1>Your files are ready.</h1>
      <p>
        Transaction verified and access token generated. Click the button below to download
        your asset immediately. This link is time-limited, so act fast.
      </p>
    </div>

    <!-- BODY -->
    <div class="body">

      <!-- Product block -->
      <div class="product-block">
        <div class="label">PURCHASED_ASSET</div>
        <div class="product-name">${productName}</div>
        <div class="order-meta">
          <div class="meta-item">
            <div class="meta-key">ORDER_ID</div>
            <div class="meta-val teal">#${orderId}</div>
          </div>
          <div class="meta-item">
            <div class="meta-key">STATUS</div>
            <div class="meta-val green">COMPLETED</div>
          </div>
        </div>
      </div>

      <!-- Download CTA -->
      <div class="cta-wrap">
        <div class="cta-sublabel">ACCESS_YOUR_FILES_NOW</div>
        <a href="${downloadUrl}" class="cta-btn">&#8659;&nbsp; DOWNLOAD NOW</a>
      </div>

      <!-- Expiry warning -->
      <div class="warn-box">
        <div class="warn-inner">
          <div class="warn-icon">&#9888;&#65039;</div>
          <div class="warn-text">
            This download link <strong>expires on ${expiry}</strong>.
            After that it will no longer work. Save your files to a safe location as soon as you download them.
          </div>
        </div>
      </div>

      <!-- Backup URL -->
      <div class="url-box">
        <div class="label">BACKUP_LINK &mdash; paste into browser if button fails</div>
        <div class="url-link">${downloadUrl}</div>
      </div>

      <div class="divider"></div>

      <p class="tip-text">
        Keep this email as your proof of purchase. If you have trouble downloading, reply to this email with your order ID and we&rsquo;ll sort it out.
      </p>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div class="ticker">
        <div class="tick">BTC <span>+2.4%</span></div>
        <div class="tick">ETH <span>+1.8%</span></div>
        <div class="tick">SPY <span>+0.6%</span></div>
        <div class="tick">NVDA <span class="red">-0.3%</span></div>
        <div class="tick">AAPL <span>+1.1%</span></div>
      </div>
      <p>&copy; 2026 StaxVibe AI Graphics &mdash; Premium financial assets for traders &amp; creators.</p>
      <p>You received this because you made a purchase at <a href="#">staxvibe.com</a>.</p>
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
  const transporter = createTransporter();

  if (!transporter) {
    logger.warn(
      "SMTP not configured (SMTP_HOST / SMTP_USER / SMTP_PASS missing) — skipping email"
    );
    return false;
  }

  const fromName = process.env.SMTP_FROM_NAME ?? "StaxVibe AI Graphics";
  const fromEmail = process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER ?? "";
  const from = `"${fromName}" <${fromEmail}>`;

  try {
    const info = await transporter.sendMail({
      from,
      to: opts.to,
      subject: `Your download is ready: ${opts.productName}`,
      html: buildDownloadEmailHtml(opts),
    });

    logger.info({ messageId: info.messageId, to: opts.to }, "Order confirmation email sent");
    return true;
  } catch (err) {
    logger.error({ err, to: opts.to }, "Failed to send order confirmation email");
    return false;
  }
}
