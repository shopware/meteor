import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import { createHmac, randomBytes } from "node:crypto";

const APP_NAME = "MeteorAdminSDKi18nApp";
// Must match <secret> in MeteorAdminSDKi18nApp/manifest.xml.
const APP_SECRET = "testSecret";

/**
 * Minimal Shopware app-registration endpoints, served by the Vite dev server itself.
 *
 * Shopware HMAC-signs the admin iframe URL with an app secret, so every app with a
 * `base-app-url` must complete the registration handshake once at install time — which
 * means the dev server has to be RUNNING when `bin/console app:install`/`app:refresh`
 * executes. The contract (see shopware/shopware,
 * src/Core/Framework/App/Lifecycle/Registration):
 *
 *  1. GET  /authorize?shop-id&shop-url&timestamp
 *     header `shopware-app-signature` = HMAC-SHA256(rawQueryString, manifest secret)
 *     → respond { proof, secret, confirmation_url } where
 *       proof = HMAC-SHA256(shopId + shopUrl + appName, manifest secret)
 *  2. POST confirmation_url — the shop confirms the minted secret; any 2xx completes it.
 */
function appRegistration(): Plugin {
  return {
    name: "meteor-example-app-registration",
    configureServer(server) {
      // Registered before /authorize — connect matches by prefix, order matters.
      server.middlewares.use("/authorize/callback", (_req, res) => {
        res.setHeader("content-type", "application/json");
        res.end("{}");
      });

      server.middlewares.use("/authorize", (req, res) => {
        // HMAC over the raw query string exactly as the shop sent it.
        const rawQuery = (req.url ?? "").split("?")[1] ?? "";
        const params = new URLSearchParams(rawQuery);
        const shopId = params.get("shop-id") ?? "";
        const shopUrl = params.get("shop-url") ?? "";

        const expectedSignature = createHmac("sha256", APP_SECRET)
          .update(rawQuery)
          .digest("hex");

        if (req.headers["shopware-app-signature"] !== expectedSignature) {
          res.statusCode = 401;
          res.end(JSON.stringify({ error: "invalid shopware-app-signature" }));
          return;
        }

        const proof = createHmac("sha256", APP_SECRET)
          .update(shopId + shopUrl + APP_NAME)
          .digest("hex");

        res.setHeader("content-type", "application/json");
        res.end(
          JSON.stringify({
            proof,
            // Stateless demo server: mint a fresh secret per registration. The shop
            // stores it and uses it to sign the iframe URL; this app never calls the
            // Admin API, so it doesn't need to remember it.
            secret: randomBytes(32).toString("hex"),
            confirmation_url: "http://localhost:8889/authorize/callback",
          }),
        );
      });
    },
  };
}

export default defineConfig({
  plugins: [vue(), appRegistration()],
  build: {
    // Top-level await in src/bootstrap.ts (awaiting the initial admin locale before mount).
    target: "esnext",
  },
});
