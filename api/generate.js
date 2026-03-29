import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { buildIphoneTemplate  } from './template-iphone.js';
import { buildAndroidTemplate } from './template-android.js';

// ── Default menu items per mode ───────────────────────────────────────────────
const DEFAULT_MENU_IPHONE = [
  { label: 'Beri Bintang', icon: 'star'    },
  { label: 'Balas',        icon: 'reply'   },
  { label: 'Teruskan',     icon: 'forward' },
  { label: 'Salin',        icon: 'copy'    },
  { label: 'Sematkan',     icon: 'pin'     },
  { label: 'Laporkan',     icon: 'report'  },
];
const DEFAULT_MENU_ANDROID = [
  { label: 'Beri Bintang' },
  { label: 'Balas'        },
  { label: 'Teruskan'     },
  { label: 'Salin'        },
  { label: 'Sematkan'     },
  { label: 'Laporkan'     },
];

export default async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const {
    mode           = 'iphone',   // 'iphone' | 'android'
    // Profile
    contactName    = 'Contact',
    contactStatus  = 'online',
    avatarUrl      = '',
    avatarInitial  = 'C',
    avatarColor    = '#00a884',
    // Message
    message        = 'Hello!',
    messageTime    = '08.08',
    senderType     = 'received',
    sponsored      = '',
    // Reactions (array of emoji strings)
    reactions,
    // Menu items
    menuItems,
    showDelete     = true,
    // Status bar
    statusTime     = '08.25',
    // Output
    scale          = 2,          // device pixel ratio (1 or 2 for retina)
  } = body;

  const opts = {
    contactName,
    contactStatus,
    avatarUrl,
    avatarInitial,
    avatarColor,
    message,
    messageTime,
    senderType,
    sponsored,
    reactions: reactions || ['👍','❤️','😂','😮','😢','🙏'],
    menuItems:  menuItems  || (mode === 'iphone' ? DEFAULT_MENU_IPHONE : DEFAULT_MENU_ANDROID),
    showDelete,
    statusTime,
  };

  // Build HTML template
  const html = mode === 'android'
    ? buildAndroidTemplate(opts)
    : buildIphoneTemplate(opts);

  // ── Puppeteer ─────────────────────────────────────────────────────────────
  let browser;
  try {
    browser = await puppeteer.launch({
      args:            chromium.args,
      defaultViewport: { width: 390, height: 800, deviceScaleFactor: Number(scale) },
      executablePath:  await chromium.executablePath(),
      headless:        chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Get actual content height
    const bodyH = await page.evaluate(() => document.body.scrollHeight);
    await page.setViewport({ width: 390, height: bodyH, deviceScaleFactor: Number(scale) });

    const screenshot = await page.screenshot({ type: 'png', fullPage: true });

    res.setHeader('Content-Type',        'image/png');
    res.setHeader('Content-Disposition', 'inline; filename="wa-screenshot.png"');
    res.setHeader('Cache-Control',       'no-store');
    return res.status(200).send(screenshot);

  } catch (err) {
    console.error('[generate]', err);
    return res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
