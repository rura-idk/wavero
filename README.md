# Wavero 0.7.0

The web client and API are served by one Cloudflare Worker and therefore use one origin. This removes the cross-origin fetch failure that appeared as `Load failed` on iPad browsers.

Open the app at the same URL as the API Worker:

`https://wavero-api.zachemposmotrel.workers.dev/`
