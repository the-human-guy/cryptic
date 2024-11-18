// transpile JSX using babel so it can be run in the browser, you don't need to edit this
// if you do edit this file, call `await window.serviceWorkerRegistration.unregister()` in the browser to update it

self.addEventListener('install', e => e.waitUntil(getBabel()))
self.addEventListener('fetch', e => e.respondWith(handleRequest(e.request)))

async function getBabel() {
  const r = await fetch('https://unpkg.com/@babel/standalone/babel.min.js')
  eval(await r.text())
}

async function handleRequest(request) {
  if (typeof Babel === 'undefined') {
    await getBabel()
  }
  const url = new URL(request.url)
  const r = await fetch(request)
  if (r.status === 200 & url.host === location.host && url.pathname.endsWith('.js') && !url.pathname.startsWith('./lib')) {
    const jsx = await r.text()
    const js = Babel.transform(jsx, {presets: ['react']}).code
    return new Response(js, r)
  } else {
    return r
  }
}
