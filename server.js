const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;

  // Default to index.html for root path
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(__dirname, pathname);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = mimeTypes[ext] || 'application/octet-stream';

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 - Not Found</title>
            <style>
                body { 
                    font-family: 'Arial', sans-serif; 
                    background: #0a0a0a; 
                    color: #00ff88; 
                    text-align: center; 
                    padding: 50px; 
                }
                h1 { font-size: 4em; text-shadow: 0 0 20px #00ff88; }
                p { font-size: 1.2em; }
                a { color: #00ffff; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <h1>404</h1>
            <p>File not found: ${pathname}</p>
            <p><a href="/">← Back to Portfolio</a></p>
        </body>
        </html>
      `);
      return;
    }

    // Read and serve file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      res.writeHead(200, { 
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio server running at http://localhost:${PORT}/`);
  console.log(`Serving files from: ${__dirname}`);
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('\nShutting down portfolio server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});