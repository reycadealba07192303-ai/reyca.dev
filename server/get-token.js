/**
 * One-time script to get Google Calendar refresh token.
 * Run this ONCE: node get-token.js
 * It will open a browser for you to authorize, then save the token to .env
 */
const http = require('http');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Step 1: Generate auth URL and open in browser
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent',
});

console.log('\n========================================');
console.log('Open this URL in your browser:');
console.log('========================================\n');
console.log(authUrl);
console.log('\n========================================\n');

// Step 2: Start a temporary server to catch the callback
const server = http.createServer(async (req, res) => {
  if (req.url.startsWith('/auth/google/callback')) {
    const url = new URL(req.url, 'http://localhost:5000');
    const code = url.searchParams.get('code');

    if (code) {
      try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log('\nRefresh Token:', tokens.refresh_token);

        // Append to .env
        const envPath = path.join(__dirname, '.env');
        fs.appendFileSync(envPath, `\nGOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
        
        console.log('\n Token saved to .env file!');
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Authorization Successful!</h1><p>You can close this window and return to your terminal.</p>');
        
        setTimeout(() => {
          server.close();
          process.exit(0);
        }, 2000);
      } catch (err) {
        console.error('Error getting token:', err);
        res.writeHead(500);
        res.end('Error getting token');
      }
    }
  }
});

server.listen(5000, () => {
  console.log('Waiting for authorization on port 5000...');
  console.log('(Copy the URL above and paste it in your browser)\n');
  
  // Try to auto-open browser
  const { exec } = require('child_process');
  exec(`start "${authUrl}"`);
});
