/**
 * Finds your Messenger ID (PSID) so the chatbot can notify you about new bookings.
 *
 * 1. Put MESSENGER_PAGE_ACCESS_TOKEN in .env
 * 2. From your personal Facebook account, send any message to your Page
 * 3. Run from the project root: node scripts/get-messenger-id.mjs
 * 4. Copy your ID into MESSENGER_RECIPIENT_ID (in .env and in Vercel)
 */
process.loadEnvFile(new URL('../.env', import.meta.url));

const token = process.env.MESSENGER_PAGE_ACCESS_TOKEN;
if (!token) {
  console.error('MESSENGER_PAGE_ACCESS_TOKEN is missing from .env');
  process.exit(1);
}

const res = await fetch(
  `https://graph.facebook.com/me/conversations?fields=participants,updated_time&access_token=${encodeURIComponent(token)}`
);
const body = await res.json();
if (!res.ok) {
  console.error('Facebook error:', body.error?.message);
  process.exit(1);
}

const pageResponse = await fetch(`https://graph.facebook.com/me?fields=id,name&access_token=${encodeURIComponent(token)}`);
const page = await pageResponse.json();
if (!pageResponse.ok || !page.id || !page.name) {
  console.error('Could not identify the Page:', page.error?.message ?? 'Missing Page ID or name. Check the Page token and its permissions.');
  process.exit(1);
}
console.log(`Page: ${page.name}\n\nPeople who messaged the Page (most recent first):`);
for (const conv of body.data ?? []) {
  for (const p of conv.participants?.data ?? []) {
    if (p.id !== page.id) console.log(`  ${p.name.padEnd(30)} MESSENGER_RECIPIENT_ID=${p.id}`);
  }
}
