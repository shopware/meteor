import path from 'path';
import fs from 'fs';
import express from 'express';
import { App } from "shopware-app-server-sdk";
import { Config } from 'shopware-app-server-sdk/config';
import { InMemoryShopRepository } from 'shopware-app-server-sdk/repository';
import { NodeHmacSigner } from 'shopware-app-server-sdk/runtime/node/signer';
import { convertRequest, convertResponse, rawRequestMiddleware } from 'shopware-app-server-sdk/runtime/node/express';
import { createServer as createViteServer } from 'vite'
import vue from '@vitejs/plugin-vue2'

async function createServer() {
    const PORT = process.env.PORT || 8888;
    const URL = process.env.URL || `http://localhost:${PORT}`;

    const app = express();

    /**
     * Configure the app server for authentication and verification
     */
    const cfg: Config = {
    appName: 'AdminExtensionSDKExampleApp',
    appSecret: 'testSecret',
    authorizeCallbackUrl: `${URL}/authorize/callback`
    };

    const appServer = new App(cfg, new InMemoryShopRepository, new NodeHmacSigner);

    app.use(rawRequestMiddleware);

    app.get('/authorize', async (req, res) => {
        const resp = await appServer.registration.authorize(convertRequest(req));


        convertResponse(resp, res);
    });

    app.post('/authorize/callback', async (req, res) => {
        const resp = await appServer.registration.authorizeCallback(convertRequest(req));

        convertResponse(resp, res);
    });

    /**
     * Create Vite server in middleware mode and configure the app type as
     * 'custom', disabling Vite's own HTML serving logic so parent server
     * can take control
     */
    const vite = await createViteServer({
        root: path.resolve(__dirname, 'frontend'),
        server: {
            middlewareMode: true,
            watch: {
                // During tests we edit the files too fast and sometimes chokidar
                // misses change events, so enforce polling for consistency
                usePolling: true,
                interval: 100,
            },
        },
        appType: 'custom',
        plugins: [vue()],
        optimizeDeps: {
            include: [
                '@shopware-ag/admin-extension-sdk',
                '@shopware-ag/meteor-component-library'
            ]
        }
    })

    // use vite's connect instance as middleware
    app.use(vite.middlewares)

    app.use('*', async (req, res) => {
        const template = fs.readFileSync(
            path.resolve(__dirname, 'frontend/index.html'),
            'utf-8'
        );

        /**
         * Don't use hot-reload because this don't work correctly
         * within the Shopware Admin
         */
        // const url = req.originalUrl
        // template = await vite.transformIndexHtml(url, template)

        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    })      

    app.listen(PORT, () => {
        console.log(`App listening at ${URL}`)
    })
}

void createServer();
