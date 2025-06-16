const http = require('http');
     const url = require('url');

     const server = http.createServer((req, res) => {
       const parsedUrl = url.parse(req.url, true);
       if (parsedUrl.pathname === '/auth/callback') {
         const query = parsedUrl.query;
         res.writeHead(200, { 'Content-Type': 'text/html' });
         res.end(`
           <h1>OAuth Callback</h1>
           <p>Received callback. Check Supabase Studio for user.</p>
           <p>Query params: ${JSON.stringify(query)}</p>
         `);
         console.log('Callback received:', query);
       } else {
         res.writeHead(404, { 'Content-Type': 'text/plain' });
         res.end('Not Found');
       }
     });

     server.listen(3000, () => {
       console.log('Callback server running at http://localhost:3000');
     });