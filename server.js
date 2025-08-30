/**
 * Local development server for testing the BFHL API
 * Simulates Vercel serverless function environment
 */

const http = require('http');
const url = require('url');

// Import our API function
const bfhlApi = require('./api/bfhl.js');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Handle /bfhl route (simulate Vercel rewrite)
  if (parsedUrl.pathname === '/bfhl') {
    // Parse JSON body
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        if (body) {
          req.body = JSON.parse(body);
        }
      } catch (e) {
        req.body = null;
      }
      
      // Add Express-like methods to res object
      res.json = function(data) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      };
      
      res.status = function(code) {
        res.statusCode = code;
        return res;
      };
      
      // Call our serverless function
      bfhlApi(req, res);
    });
  } else {
    // Handle 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Not Found',
      message: 'Only /bfhl endpoint is available'
    }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 BFHL API Server running on http://localhost:${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/bfhl`);
  console.log(`🧪 Run tests: .\test.ps1 or npm test`);
});

module.exports = server;