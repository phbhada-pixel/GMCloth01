import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

const whatsappApiPlugin = (): Plugin => ({
  name: 'whatsapp-api-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/api/send-whatsapp-bill' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            console.log('Sending WhatsApp Bill to:', data.phone);
            console.log('Payload:', data.payload);
            // Simulate WhatsApp Business API Call
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: 'Message sent via WhatsApp API', data }));
          } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
          }
        });
        return;
      }
      next();
    });
  }
});

export default defineConfig({
  base: './',
  plugins: [whatsappApiPlugin()],
});
