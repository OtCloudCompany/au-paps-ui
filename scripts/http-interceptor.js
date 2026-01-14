const http = require('http');
const https = require('https');

const originalHttpRequest = http.request;
const originalHttpsRequest = https.request;
const originalHttpGet = http.get;
const originalHttpsGet = https.get;

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

function patchRequest(originalRequest) {
    return function (...args) {
        let options = args[0];
        if (typeof options === 'string' || options instanceof URL) {
            // If the first argument is a URL string or object, the options object is the second argument
            // If it's missing, we need to create it
            if (!args[1]) {
                args[1] = {};
            }
            options = args[1];
        }

        if (options) {
            if (!options.headers) {
                options.headers = {};
            }
            options.headers['User-Agent'] = userAgent;
            options.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9';
            options.headers['Accept-Language'] = 'en-US,en;q=0.9';
        }

        // Log the request
        let url = '';
        if (typeof args[0] === 'string') {
            url = args[0];
        } else if (args[0] instanceof URL) {
            url = args[0].toString();
        } else if (options && options.href) {
            url = options.href;
        } else if (options && options.protocol && options.hostname && options.path) {
            url = `${options.protocol}//${options.hostname}${options.path}`;
        }

        console.log(`[Interceptor] Requesting: ${url}`);

        const req = originalRequest.apply(this, args);

        const originalEmit = req.emit;
        req.emit = function (type, ...emitArgs) {
            if (type === 'response') {
                const res = emitArgs[0];
                console.log(`[Interceptor] Response from ${url}: ${res.statusCode} ${res.statusMessage}`);
            }
            return originalEmit.apply(this, [type, ...emitArgs]);
        };

        return req;
    };
}

function patchGet(originalGet) {
    return function (...args) {
        console.log('[Interceptor] http/https.get called');
        return originalGet.apply(this, args);
    };
}

http.request = patchRequest(originalHttpRequest);
https.request = patchRequest(originalHttpsRequest);
http.get = patchGet(originalHttpGet);
https.get = patchGet(originalHttpsGet);

const originalFetch = global.fetch;

global.fetch = function (resource, options) {
    let url = resource;
    if (resource instanceof Request) {
        url = resource.url;
    }

    console.log(`[Interceptor] Fetching: ${url}`);

    if (!options) {
        options = {};
    }
    if (!options.headers) {
        options.headers = {};
    }

    if (options.headers instanceof Headers) {
        options.headers.set('User-Agent', userAgent);
        options.headers.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9');
        options.headers.set('Accept-Language', 'en-US,en;q=0.9');
    } else {
        options.headers['User-Agent'] = userAgent;
        options.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9';
        options.headers['Accept-Language'] = 'en-US,en;q=0.9';
    }

    return originalFetch(resource, options).then(res => {
        console.log(`[Interceptor] Fetch response from ${url}: ${res.status} ${res.statusText}`);
        return res;
    });
};

// Try to patch XMLHttpRequest prototype open
// This only works if XMLHttpRequest is already defined (e.g. by xhr2)
// Since we are running with -r, it might not be defined yet.
// We can try to hook into the global object property definition?
try {
    Object.defineProperty(global, 'XMLHttpRequest', {
        configurable: true,
        enumerable: true,
        get: function () {
            return this._XMLHttpRequest;
        },
        set: function (val) {
            this._XMLHttpRequest = val;
            if (val && val.prototype && val.prototype.open) {
                console.log('[Interceptor] Patching XMLHttpRequest.prototype.open');
                const originalOpen = val.prototype.open;
                val.prototype.open = function (method, url, ...args) {
                    console.log(`[Interceptor] XHR Open: ${method} ${url}`);
                    this._url = url; // Save for send
                    return originalOpen.call(this, method, url, ...args);
                };

                const originalSend = val.prototype.send;
                val.prototype.send = function (body) {
                    console.log(`[Interceptor] XHR Send to ${this._url}`);
                    this.setRequestHeader('User-Agent', userAgent);
                    this.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9');
                    this.setRequestHeader('Accept-Language', 'en-US,en;q=0.9');
                    return originalSend.call(this, body);
                };
            }
        }
    });
} catch (e) {
    console.error('[Interceptor] Failed to hook XMLHttpRequest:', e);
}

console.log('HTTP/HTTPS requests, get, global.fetch, and XHR patched to include User-Agent header and logging.');
