// ── Template: WhatsApp iPhone (iOS) ─────────────────────────────────────────
export function buildIphoneTemplate(opts) {
  const {
    // Profile
    contactName    = 'Contact',
    contactStatus  = 'online',
    avatarUrl      = '',
    avatarInitial  = 'C',
    avatarColor    = '#00a884',

    // Message bubble
    message        = '',
    messageTime    = '08.08',
    senderType     = 'received',   // 'received' | 'sent'
    sponsored      = '',           // "Disponsori:\n@user1\n@user2"

    // Reaction bar
    reactions      = ['👍','❤️','😂','😮','😢','🙏'],

    // Context menu items
    menuItems      = [
      { label: 'Beri Bintang', icon: 'star'    },
      { label: 'Balas',        icon: 'reply'   },
      { label: 'Teruskan',     icon: 'forward' },
      { label: 'Salin',        icon: 'copy'    },
      { label: 'Sematkan',     icon: 'pin'     },
      { label: 'Laporkan',     icon: 'report'  },
    ],
    showDelete     = true,

    // Status bar
    statusTime     = '08.25',
  } = opts;

  // Avatar HTML
  const avatarHTML = avatarUrl
    ? `<img src="${avatarUrl}" class="hd-avatar" alt="">`
    : `<div class="hd-avatar hd-avatar-initial" style="background:${avatarColor}">${avatarInitial}</div>`;

  // Reactions
  const reactionsHTML = reactions.map(r =>
    `<span class="re-emoji">${r}</span>`
  ).join('') + `<span class="re-plus">+</span>`;

  // Icon SVGs (inline, minimal)
  const ICONS = {
    star:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    reply:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>`,
    forward: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="15 17 20 12 15 7"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/></svg>`,
    copy:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    pin:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    report:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    trash:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,
  };

  const menuHTML = menuItems.map((item, i) => {
    const isFirst = i === 0;
    const isLast  = i === menuItems.length - 1 && !showDelete;
    const icon    = ICONS[item.icon] || ICONS.copy;
    return `
      <div class="cm-item ${isFirst ? 'cm-first' : ''} ${isLast ? 'cm-last' : ''}">
        <span class="cm-label">${item.label}</span>
        <span class="cm-icon">${icon}</span>
      </div>`;
  }).join('');

  const deleteHTML = showDelete ? `
    <div class="cm-item cm-delete cm-last">
      <span class="cm-label">Hapus</span>
      <span class="cm-icon">${ICONS.trash}</span>
    </div>` : '';

  const isSent = senderType === 'sent';
  const bubbleAlign = isSent ? 'flex-end' : 'flex-start';
  const bubbleBg    = isSent ? '#005c4b' : '#1f2c34';
  const bubbleBR    = isSent
    ? '12px 2px 12px 12px'
    : '2px 12px 12px 12px';

  const sponsoredHTML = sponsored
    ? `<div class="bbl-sponsored">${sponsored.replace(/\n/g, '<br>')}</div>`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

body {
  width: 390px;
  background: #111b21;
  font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  overflow: hidden;
  position: relative;
}

/* ── iOS Status Bar ── */
.sb {
  background: rgba(0,0,0,0.0);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 22px 4px 22px;
  position: relative;
  z-index: 10;
}
.sb-time {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.2px;
}
.sb-icons {
  display: flex;
  align-items: center;
  gap: 6px;
}
.sb-signal {
  display: flex; align-items: flex-end; gap: 1.5px; height: 12px;
}
.sb-signal span {
  background: #fff; border-radius: 1px;
  width: 3px;
}
.sb-signal span:nth-child(1) { height: 4px; }
.sb-signal span:nth-child(2) { height: 6px; }
.sb-signal span:nth-child(3) { height: 9px; }
.sb-signal span:nth-child(4) { height: 12px; }
.sb-wifi {
  width: 16px; height: 12px;
  display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 2px;
}
.sb-wifi div {
  background: transparent;
  border: 2px solid #fff;
  border-bottom: none;
  border-radius: 50% 50% 0 0;
}
.sb-wifi div:nth-child(1) { width: 14px; height: 8px; }
.sb-wifi div:nth-child(2) { width: 9px;  height: 5px; }
.sb-wifi div:nth-child(3) { width: 4px;  height: 4px; border-radius: 50%; background: #fff; border: none; }
.sb-battery {
  display: flex; align-items: center; gap: 1px;
}
.sb-bat-body {
  width: 25px; height: 12px;
  border: 1.5px solid rgba(255,255,255,0.8);
  border-radius: 3px;
  padding: 1.5px;
  position: relative;
}
.sb-bat-fill {
  width: 65%;
  height: 100%;
  background: #fff;
  border-radius: 1.5px;
}
.sb-bat-tip {
  width: 2px; height: 6px;
  background: rgba(255,255,255,0.6);
  border-radius: 0 1px 1px 0;
}
.sb-lte {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
}

/* ── Header ── */
.hd {
  background: #1f2c34;
  display: flex;
  align-items: center;
  padding: 8px 12px 10px 4px;
  gap: 6px;
  border-bottom: 0.5px solid rgba(255,255,255,0.06);
}
.hd-back {
  display: flex; align-items: center; gap: 0px;
  color: #00a884;
  font-size: 18px;
  padding: 0 2px;
  flex-shrink: 0;
}
.hd-back svg { width: 22px; height: 22px; }
.hd-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.hd-avatar-initial {
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; font-weight: 600; color: #fff;
}
.hd-info { flex: 1; min-width: 0; }
.hd-name {
  font-size: 16px; font-weight: 600;
  color: #e9edef;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.hd-status { font-size: 13px; color: #00a884; }
.hd-actions {
  display: flex; align-items: center; gap: 18px;
  color: #00a884;
}
.hd-actions svg { width: 22px; height: 22px; }

/* ── Chat background ── */
.chat-bg {
  background: #0b141a;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  min-height: 380px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px 12px 16px 12px;
  position: relative;
}

/* ── Overlay backdrop ── */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 2;
}

/* ── Content layer ── */
.overlay-content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: ${bubbleAlign};
  gap: 8px;
}

/* ── Reaction bar ── */
.re-bar {
  background: rgba(32,44,51,0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 100px;
  padding: 8px 12px;
  display: flex; align-items: center; gap: 4px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  margin-${isSent ? 'right' : 'left'}: 4px;
}
.re-emoji { font-size: 26px; line-height: 1; cursor: pointer; }
.re-plus {
  width: 30px; height: 30px;
  background: #3b4a54;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: #8696a0; font-weight: 300;
}

/* ── Message bubble ── */
.bbl-wrap {
  display: flex;
  flex-direction: column;
  align-items: ${bubbleAlign};
  max-width: 72%;
}
.bbl {
  background: ${bubbleBg};
  border-radius: ${bubbleBR};
  padding: 8px 10px 22px 10px;
  position: relative;
  box-shadow: 0 1px 2px rgba(0,0,0,0.4);
  min-width: 120px;
}
.bbl-text {
  font-size: 14.5px;
  line-height: 1.48;
  color: #e9edef;
  white-space: pre-wrap;
  word-break: break-word;
}
.bbl-sponsored {
  color: #8696a0;
  font-size: 12.5px;
  margin-top: 5px;
  line-height: 1.5;
}
.bbl-time {
  position: absolute;
  bottom: 5px; right: 8px;
  color: #8696a0;
  font-size: 11px;
  display: flex; align-items: center; gap: 3px;
}
${isSent ? `
.bbl-check { display:inline-flex; align-items:center; }
.bbl-check svg { width:14px; height:14px; color:#53bdeb; }
` : ''}

/* ── Context menu ── */
.cm {
  background: rgba(30,40,47,0.97);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 14px;
  overflow: hidden;
  min-width: 220px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6);
  margin-${isSent ? 'right' : 'left'}: 4px;
}
.cm-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 0.5px solid rgba(255,255,255,0.07);
  cursor: pointer;
}
.cm-item:last-child { border-bottom: none; }
.cm-label { font-size: 16px; color: #e9edef; font-weight: 400; }
.cm-icon { width: 22px; height: 22px; color: #8696a0; flex-shrink: 0; }
.cm-icon svg { width: 100%; height: 100%; }
.cm-delete .cm-label { color: #e53935; }
.cm-delete .cm-icon { color: #e53935; }
</style>
</head>
<body>

<!-- Status Bar -->
<div class="sb">
  <span class="sb-time">${statusTime}</span>
  <div class="sb-icons">
    <div class="sb-signal">
      <span></span><span></span><span></span><span></span>
    </div>
    <span class="sb-lte">LTE</span>
    <div class="sb-battery">
      <div class="sb-bat-body"><div class="sb-bat-fill"></div></div>
      <div class="sb-bat-tip"></div>
    </div>
  </div>
</div>

<!-- Header -->
<div class="hd">
  <div class="hd-back">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
  </div>
  ${avatarHTML}
  <div class="hd-info">
    <div class="hd-name">${contactName}</div>
    <div class="hd-status">${contactStatus}</div>
  </div>
  <div class="hd-actions">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.4-.4a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
  </div>
</div>

<!-- Chat area -->
<div class="chat-bg">
  <div class="overlay"></div>
  <div class="overlay-content">

    <!-- Reaction bar -->
    <div class="re-bar">
      ${reactionsHTML}
    </div>

    <!-- Message bubble -->
    <div class="bbl-wrap">
      <div class="bbl">
        <div class="bbl-text">${message.replace(/\n/g, '<br>')}</div>
        ${sponsoredHTML}
        <div class="bbl-time">
          ${messageTime}
          ${isSent ? `<span class="bbl-check"><svg viewBox="0 0 16 11" fill="none"><path d="M11.071.653L4.418 7.32 1.329 4.232" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.071.653L8.418 7.32" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>` : ''}
        </div>
      </div>
    </div>

    <!-- Context menu -->
    <div class="cm">
      ${menuHTML}
      ${deleteHTML}
    </div>

  </div>
</div>

</body>
</html>`;
}
