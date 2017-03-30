const { createServer } = require('http');
const next = require('next');
const express = require('express');
const LRUCache = require('lru-cache');

// This is where we cache our rendered HTML pages
const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60 // 1hour
});

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dir: '.', dev });
const handler = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    server.get('/', (req, res) => renderAndCache(req, res, '/'));
    server.get('/about/:foo', (req, res) => renderAndCache(req, res, '/about', req.params));
    server.get('/blog/', (req, res) => renderAndCache(req, res, '/'));
    server.get('/blog/:slug', (req, res) => renderAndCache(req, res, '/blog', req.params));
    server.get('*', (req, res) => handler(req, res));

    server.listen(process.env.PORT || 3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
      });
  });

/*
 * NB: make sure to modify this to take into account anything that should trigger
 * an immediate page change (e.g a locale stored in req.session)
 */
function getCacheKey (req) {
  return `${req.url}`;
}

function renderAndCache (req, res, pagePath, queryParams) {
  const key = getCacheKey(req);

  // If we have a page in the cache, let's serve it
  if (ssrCache.has(key)) {
    console.log(`CACHE HIT: ${key}`);
    res.send(ssrCache.get(key));
    return;
  }

  // If not let's render the page into HTML
  app.renderToHTML(req, res, pagePath, queryParams)
    .then((html) => {
      // Let's cache this page
      console.log(`CACHE MISS: ${key}`);
      ssrCache.set(key, html);

      res.send(html);
    })
    .catch((err) => {
      app.renderError(err, req, res, pagePath, queryParams);
    });
}
