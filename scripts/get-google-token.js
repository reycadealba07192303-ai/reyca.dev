// Reconnect Google Calendar and save the refresh token in .env without printing it.
const http = require('http');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { randomBytes } = require('crypto');
const { spawn } = require('child_process');

const envPath = path.join(__dirname, '..', '.env');
process.loadEnvFile(envPath);
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
  console.error('Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_REDIRECT_URI in .env first.');
  process.exit(1);
}
const redirect = new URL(GOOGLE_REDIRECT_URI);
if (redirect.protocol !== 'http:' || redirect.hostname !== 'localhost' || !redirect.port) {
  console.error('This local setup script requires an http://localhost:PORT callback registered in Google Cloud.');
  process.exit(1);
}
const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
const state = randomBytes(24).toString('hex');
const authUrl = auth.generateAuthUrl({ access_type: 'offline', scope: ['https://www.googleapis.com/auth/calendar'], prompt: 'consent', state });
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, redirect.origin);
  if (url.pathname !== redirect.pathname) { res.writeHead(404); res.end(); return; }
  if (url.searchParams.get('state') !== state) { res.writeHead(400); res.end('Invalid authorization state.'); return; }
  const code = url.searchParams.get('code');
  if (!code) { res.writeHead(400); res.end('Authorization was cancelled or no code was returned.'); return; }
  try {
    const { tokens } = await auth.getToken(code);
    if (!tokens.refresh_token) throw new Error('No refresh token returned. Please retry and grant Calendar access.');
    const content = fs.readFileSync(envPath, 'utf8');
    const setting = `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`;
    const updated = /^GOOGLE_REFRESH_TOKEN=.*$/m.test(content)
      ? content.replace(/^GOOGLE_REFRESH_TOKEN=.*$/gm, setting)
      : `${content.trimEnd()}\n${setting}\n`;
    fs.writeFileSync(envPath, updated);
    console.log('Google Calendar reconnected. Refresh token saved to .env (hidden).');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Google Calendar connected</h1><p>You can close this tab and return to the portfolio setup.</p>');
    clearTimeout(timeout);
    server.close();
  } catch (error) {
    console.error('Authorization failed:', error.message);
    res.writeHead(500); res.end('Could not complete authorization. See your terminal.');
  }
});
const timeout = setTimeout(() => { console.error('Authorization timed out. Run the script again when ready.'); server.close(); }, 10 * 60000);
server.on('error', error => { clearTimeout(timeout); console.error(error.message); process.exitCode = 1; });
server.listen(Number(redirect.port), 'localhost', () => {
  console.log('Sign in to the Google account whose calendar Reyca uses and grant Calendar access.');
  console.log(authUrl);
  if (process.platform === 'win32') {
    const opener = spawn('powershell.exe', ['-NoProfile', '-Command', `Start-Process -FilePath '${authUrl.replace(/'/g, "''")}'`], { windowsHide: true, stdio: 'ignore' });
    opener.on('error', () => console.log('Open the authorization URL above manually.'));
  }
});
