const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;
const DIST_FOLDER = path.join(process.cwd(), 'dist/browser');

// Proxy API requests to the backend
// We need to proxy /server to https://papsrepository.africanunion.org/server
app.use('/server', createProxyMiddleware({
    target: 'https://papsrepository.africanunion.org',
    changeOrigin: true,
    secure: false, // Accept self-signed certs if any, though production should be valid
    logLevel: 'debug',
    onProxyReq: (proxyReq, req, res) => {
        // We can inject headers here if needed, but for CSR, the browser sends the User-Agent.
        // The proxy just forwards it.
        // However, if we want to be safe, we can force a known good User-Agent?
        // No, let's let the browser do its thing.
        console.log(`[Proxy] ${req.method} ${req.url} -> ${proxyReq.path}`);
    }
}));

// Serve static files
app.use(express.static(DIST_FOLDER));

// Fallback to index.html for Angular routing
app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_FOLDER, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`CSR Server listening on http://localhost:${PORT}`);
    console.log(`Serving content from ${DIST_FOLDER}`);
});
