export default function Setup() {
  return (
    <div className="min-h-screen bg-[#0a0d12] px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-10">

        {/* Title */}
        <div className="text-center">
          <div
            className="inline-block px-3 py-1 mb-5 text-[10px] font-bold tracking-widest border rounded-full font-mono"
            style={{ color: "#00FF88", borderColor: "rgba(0,255,136,0.25)", background: "rgba(0,255,136,0.07)" }}
          >
            ● CONFIGURATION_GUIDE
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Setup Instructions</h1>
          <p className="text-[#8a8f9e] text-sm leading-relaxed">
            Add these secrets in your Replit project under <span className="font-mono text-[#00E5CC]">Tools → Secrets</span>.
            The app works without them (demo mode) but you need them for real payments and emails.
          </p>
        </div>

        {/* STRIPE */}
        <Section
          color="#00FF88"
          tag="STRIPE_PAYMENTS"
          title="1. Stripe — Real Checkout"
          intro="Without this, every purchase auto-completes in demo mode. Add your live key to charge real cards."
        >
          <SecretRow
            name="STRIPE_SECRET_KEY"
            example="sk_live_51..."
            required
            how={
              <>
                Go to{" "}
                <A href="https://dashboard.stripe.com/apikeys">dashboard.stripe.com/apikeys</A>
                {" "}→ <Code>Developers → API keys</Code> → copy your <Code>Secret key</Code>.
                Use <Code>sk_test_...</Code> for testing, <Code>sk_live_...</Code> for production.
              </>
            }
          />
          <SecretRow
            name="STRIPE_WEBHOOK_SECRET"
            example="whsec_abc123..."
            required={false}
            how={
              <>
                Go to{" "}
                <A href="https://dashboard.stripe.com/webhooks">dashboard.stripe.com/webhooks</A>
                {" "}→ <Code>Add endpoint</Code> → set the URL to{" "}
                <Code>https://YOUR-DOMAIN/api/webhook/stripe</Code> → select event{" "}
                <Code>checkout.session.completed</Code> → copy the <Code>Signing secret</Code>.
                Without this, webhooks still fire but signature verification is skipped.
              </>
            }
          />
          <Note color="#00FF88">
            Stripe test mode (sk_test_...) lets you place fake orders using card number{" "}
            <Code>4242 4242 4242 4242</Code>, any future expiry, any CVC. No real money moves.
          </Note>
        </Section>

        {/* SMTP / EMAIL */}
        <Section
          color="#00E5CC"
          tag="SMTP_EMAIL"
          title="2. Email — Order Confirmations"
          intro="Customers receive a branded download email after purchase. All five secrets below work together."
        >
          <SecretRow
            name="SMTP_HOST"
            example="smtp.gmail.com"
            required
            how={
              <>
                <strong className="text-white">Gmail:</strong> <Code>smtp.gmail.com</Code>
                &nbsp;·&nbsp;<strong className="text-white">Outlook/Hotmail:</strong> <Code>smtp-mail.outlook.com</Code>
                &nbsp;·&nbsp;<strong className="text-white">SendGrid:</strong> <Code>smtp.sendgrid.net</Code>
                &nbsp;·&nbsp;<strong className="text-white">Namecheap/PrivateEmail:</strong> <Code>mail.privateemail.com</Code>
              </>
            }
          />
          <SecretRow
            name="SMTP_PORT"
            example="587"
            required={false}
            how={
              <>
                <Code>587</Code> — standard TLS (recommended for Gmail, SendGrid, most providers).{" "}
                <Code>465</Code> — SSL (some older providers). Defaults to <Code>587</Code> if omitted.
              </>
            }
          />
          <SecretRow
            name="SMTP_USER"
            example="orders@yourdomain.com"
            required
            how={
              <>
                Your full email address used to log in to the SMTP provider (e.g. <Code>you@gmail.com</Code>).
                For SendGrid, this is <Code>apikey</Code> (literally the word "apikey").
              </>
            }
          />
          <SecretRow
            name="SMTP_PASS"
            example="xxxx xxxx xxxx xxxx"
            required
            how={
              <>
                <strong className="text-white">Gmail users:</strong> Do NOT use your Google account password.
                Go to{" "}
                <A href="https://myaccount.google.com/apppasswords">myaccount.google.com/apppasswords</A>
                {" "}→ create an App Password for "Mail" → paste the 16-character code here.
                Requires 2FA to be on.
                <br /><br />
                <strong className="text-white">SendGrid users:</strong> Paste your SendGrid API key here.
              </>
            }
          />
          <SecretRow
            name="SMTP_FROM_NAME"
            example="StaxVibe AI Graphics"
            required={false}
            how="The display name customers see in their inbox. Defaults to 'StaxVibe AI Graphics' if omitted."
          />
          <SecretRow
            name="SMTP_FROM_EMAIL"
            example="orders@yourdomain.com"
            required={false}
            how="The from address in the email header. Defaults to SMTP_USER if omitted. Must be verified with your provider if using a custom domain."
          />
          <Note color="#00E5CC">
            Gmail free accounts may have daily sending limits (~500/day). For high volume, use
            SendGrid (free up to 100/day) or another transactional provider.
          </Note>
        </Section>

        {/* All secrets table */}
        <Section
          color="#FF3366"
          tag="QUICK_REFERENCE"
          title="All Secrets at a Glance"
          intro="Copy these exact names into Replit → Tools → Secrets."
        >
          <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid #1e2330" }}>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr style={{ background: "#0d0f14", borderBottom: "1px solid #1e2330" }}>
                  <th className="text-left px-4 py-3 text-[#8a8f9e] tracking-widest text-[10px]">SECRET NAME</th>
                  <th className="text-left px-4 py-3 text-[#8a8f9e] tracking-widest text-[10px]">REQUIRED</th>
                  <th className="text-left px-4 py-3 text-[#8a8f9e] tracking-widest text-[10px]">PURPOSE</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "STRIPE_SECRET_KEY", req: true, purpose: "Real card payments" },
                  { name: "STRIPE_WEBHOOK_SECRET", req: false, purpose: "Stripe webhook signature verification" },
                  { name: "SMTP_HOST", req: true, purpose: "Email server hostname" },
                  { name: "SMTP_PORT", req: false, purpose: "Email port (default 587)" },
                  { name: "SMTP_USER", req: true, purpose: "Email login address" },
                  { name: "SMTP_PASS", req: true, purpose: "Email password / app key" },
                  { name: "SMTP_FROM_NAME", req: false, purpose: "Sender display name" },
                  { name: "SMTP_FROM_EMAIL", req: false, purpose: "Sender email address" },
                  { name: "SESSION_SECRET", req: true, purpose: "Already set — session signing" },
                ].map((row, i) => (
                  <tr
                    key={row.name}
                    style={{
                      borderBottom: i < 8 ? "1px solid #1e2330" : undefined,
                      background: i % 2 === 0 ? "#13161d" : "#0f1217",
                    }}
                  >
                    <td className="px-4 py-3" style={{ color: "#00E5CC" }}>{row.name}</td>
                    <td className="px-4 py-3">
                      {row.req ? (
                        <span style={{ color: "#00FF88" }}>YES</span>
                      ) : (
                        <span style={{ color: "#4a4f5e" }}>optional</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#8a8f9e]">{row.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Note color="#FF3366">
            After adding or changing any secret, restart the API server workflow for changes to take effect.
          </Note>
        </Section>

      </div>
    </div>
  );
}

function Section({
  color,
  tag,
  title,
  intro,
  children,
}: {
  color: string;
  tag: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#1e2330", background: "#13161d" }}>
      <div className="px-6 py-5" style={{ borderBottom: "1px solid #1e2330" }}>
        <div
          className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-widest font-mono rounded-full mb-3"
          style={{ color, background: `${color}18`, border: `1px solid ${color}33` }}
        >
          {tag}
        </div>
        <h2 className="text-lg font-black text-white mb-1">{title}</h2>
        <p className="text-[#8a8f9e] text-sm">{intro}</p>
      </div>
      <div className="px-6 py-5 space-y-6">{children}</div>
    </div>
  );
}

function SecretRow({
  name,
  example,
  required,
  how,
}: {
  name: string;
  example: string;
  required: boolean;
  how: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="text-sm font-mono font-bold px-2 py-0.5 rounded"
          style={{ color: "#00E5CC", background: "rgba(0,229,204,0.08)", border: "1px solid rgba(0,229,204,0.2)" }}
        >
          {name}
        </span>
        {required ? (
          <span className="text-[10px] font-mono font-bold tracking-widest" style={{ color: "#00FF88" }}>
            REQUIRED
          </span>
        ) : (
          <span className="text-[10px] font-mono tracking-widest" style={{ color: "#4a4f5e" }}>
            OPTIONAL
          </span>
        )}
      </div>
      <div className="text-xs font-mono text-[#4a4f5e]">
        Example: <span className="text-[#8a8f9e]">{example}</span>
      </div>
      <div className="text-sm text-[#8a8f9e] leading-relaxed">{how}</div>
    </div>
  );
}

function Note({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg px-4 py-3 text-xs leading-relaxed"
      style={{ background: `${color}0d`, border: `1px solid ${color}22`, color: "#8a8f9e" }}
    >
      <strong style={{ color }}>NOTE:</strong> {children}
    </div>
  );
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#00E5CC" }} className="underline underline-offset-2 hover:opacity-80 transition-opacity">
      {children}
    </a>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="text-xs px-1.5 py-0.5 rounded font-mono"
      style={{ background: "#0d0f14", color: "#00E5CC", border: "1px solid #1e2330" }}
    >
      {children}
    </code>
  );
}
