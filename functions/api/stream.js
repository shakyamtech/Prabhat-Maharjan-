/**
 * Cloudflare Pages Function: Audio Stream Proxy
 * Streams remote audio with full CORS and Range headers support
 * Allows Web Audio API createMediaElementSource + AnalyserNode to sync real frequency spectrum!
 */

export async function onRequest(context) {
  const { request } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response('Missing "url" parameter', { status: 400 });
  }

  try {
    const fetchHeaders = new Headers();
    const range = request.headers.get('Range');
    if (range) {
      fetchHeaders.set('Range', range);
    }

    const upstreamResponse = await fetch(targetUrl, {
      headers: fetchHeaders,
      redirect: 'follow'
    });

    const responseHeaders = new Headers(upstreamResponse.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', '*');
    responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders
    });
  } catch (err) {
    return new Response('Audio stream error: ' + err.message, { status: 502 });
  }
}
