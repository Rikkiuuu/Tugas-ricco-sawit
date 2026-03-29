// ── Template: WhatsApp Android (Regular) ─────────────────────────────────────
export function buildAndroidTemplate(opts) {
  const {
    contactName    = 'Contact',
    contactStatus  = 'online',
    avatarUrl      = '',
    avatarInitial  = 'C',
    avatarColor    = '#00a884',
    message        = '',
    messageTime    = '08.08',
    senderType     = 'received',
    sponsored      = '',
    reactions      = ['👍','❤️','😂','😮','😢','🙏'],
    menuItems      = [
      { label: 'Beri Bintang' },
      { label: 'Balas'        },
      { label: 'Teruskan'     },
      { label: 'Salin'        },
      { label: 'Sematkan'     },
      { label: 'Laporkan'     },
    ],
    showDelete     = true,
    statusTime     = '08.25',
  } = opts;

  const avatarHTML = avatarUrl
    ? `<img src="${avatarUrl}" class="hd-avatar" alt="">`
    : `<div class="hd-avatar hd-avatar-initial" style="background:${avatarColor}">${avatarInitial}</div>`;

  const reactionsHTML = reactions.map(r =>
    `<span class="re-emoji">${r}</span>`
  ).join('') + `<span class="re-plus">+</span>`;

  const menuHTML = menuItems.map(item =>
    `<div class="cm-item"><span>${item.label}</span></div>`
  ).join('');

  const deleteHTML = showDelete
    ? `<div class="cm-item cm-delete"><span>Hapus</span></div>` : '';

  const isSent   = senderType === 'sent';
  const bubbleBg = isSent ? '#005c4b' : '#202c33';
  const bubbleBR = isSent ? '12px 2px 12px 12px' : '2px 12px 12px 12px';
  const bubbleAlign = isSent ? 'flex-end' : 'flex-start';
  const cmLeft   = isSent ? 'auto' : '12px';
  const cmRight  = isSent ? '12px' : 'auto';

  const sponsoredHTML = sponsored
    ? `<div class="bbl-sponsored">${sponsored.replace(/\n/g, '<br>')}</div>` : '';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

body {
  width: 390px;
  background: #111b21;
  font-family: 'Roboto', 'Noto Sans', Arial, sans-serif;
  overflow: hidden;
}

/* ── Android Status Bar ── */
.sb {
  background: #1f2c34;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px 6px 16px;
  height: 26px;
}
.sb-time { font-size: 12px; font-weight: 500; color: #fff; }
.sb-icons {
  display: flex; align-items: center; gap: 5px;
}
.sb-icon-grp {
  display: flex; align-items: flex-end; gap: 1px; height: 10px;
}
.sb-icon-grp span { background:#fff; width:2.5px; border-radius:1px; }
.sb-icon-grp span:nth-child(1){ height:3px; }
.sb-icon-grp span:nth-child(2){ height:5px; }
.sb-icon-grp span:nth-child(3){ height:7px; }
.sb-icon-grp span:nth-child(4){ height:10px; }
.sb-wifi-ic { font-size:12px; color:#fff; }
.sb-bat {
  width:20px; height:10px;
  border:1.2px solid rgba(255,255,255,0.8);
  border-radius:2px; padding:1px; position:relative;
}
.sb-bat::after {
  content:'';
  position:absolute; right:-4px; top:2px;
  width:2px; height:5px;
  background:rgba(255,255,255,0.6); border-radius:0 1px 1px 0;
}
.sb-bat-inner { width:65%; height:100%; background:#fff; border-radius:1px; }

/* ── Header ── */
.hd {
  background: #1f2c34;
  display: flex;
  align-items: center;
  padding: 8px 8px 8px 4px;
  gap: 8px;
}
.hd-back { color:#00a884; padding:4px 2px; }
.hd-back svg { width:24px; height:24px; display:block; }
.hd-avatar {
  width: 40px; height: 40px; border-radius:50%; object-fit:cover; flex-shrink:0;
}
.hd-avatar-initial {
  width:40px; height:40px; border-radius:50%; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  font-size:17px; font-weight:500; color:#fff;
}
.hd-info { flex:1; min-width:0; }
.hd-name { font-size:16px; font-weight:500; color:#e9edef; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.hd-status { font-size:13px; color:#8696a0; }
.hd-actions { display:flex; gap:16px; padding-right:4px; }
.hd-actions svg { width:22px; height:22px; color:#aebac1; display:block; }

/* ── Chat BG ── */
.chat-bg {
  background: #0b141a;
  min-height: 360px;
  padding: 16px 10px;
  position: relative;
  display:flex; flex-direction:column; justify-content:flex-end;
}
.overlay {
  position:absolute; inset:0;
  background:rgba(0,0,0,0.55);
  z-index:2;
}
.content {
  position:relative; z-index:3;
  display:flex; flex-direction:column;
  align-items: ${bubbleAlign};
  gap:10px;
}

/* ── Reaction bar ── */
.re-bar {
  background: #233138;
  border-radius: 100px;
  padding: 7px 10px;
  display:flex; align-items:center; gap:2px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.5);
}
.re-emoji { font-size:24px; }
.re-plus {
  width:28px; height:28px; border-radius:50%;
  background:#3b4a54;
  display:flex; align-items:center; justify-content:center;
  font-size:18px; color:#8696a0;
}

/* ── Bubble ── */
.bbl-wrap { max-width:72%; display:flex; flex-direction:column; align-items:${bubbleAlign}; }
.bbl {
  background: ${bubbleBg};
  border-radius: ${bubbleBR};
  padding: 8px 10px 22px 10px;
  position:relative;
  box-shadow: 0 1px 2px rgba(0,0,0,0.4);
  min-width:120px;
}
.bbl-text { font-size:14.5px; line-height:1.45; color:#e9edef; white-space:pre-wrap; word-break:break-word; }
.bbl-sponsored { color:#8696a0; font-size:12.5px; margin-top:5px; line-height:1.5; }
.bbl-time {
  position:absolute; bottom:5px; right:8px;
  color:#8696a0; font-size:11px;
  display:flex; align-items:center; gap:3px;
}
.bbl-check svg { width:14px; height:14px; color:#53bdeb; }

/* ── Context menu (Android style — no icon, left aligned) ── */
.cm {
  background: #233138;
  border-radius: 8px;
  overflow:hidden;
  min-width: 200px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.6);
  margin-left: ${cmLeft};
  margin-right: ${cmRight};
}
.cm-item {
  padding: 14px 20px;
  font-size:15px; color:#e9edef;
  border-bottom: 0.5px solid rgba(255,255,255,0.06);
  cursor:pointer;
}
.cm-item:last-child { border-bottom:none; }
.cm-delete { color:#e53935; }
</style>
</head>
<body>

<!-- Status bar -->
<div class="sb">
  <span class="sb-time">${statusTime}</span>
  <div class="sb-icons">
    <div class="sb-icon-grp"><span></span><span></span><span></span><span></span></div>
    <span class="sb-wifi-ic">&#x1F4F6;</span>
    <div class="sb-bat"><div class="sb-bat-inner"></div></div>
  </div>
</div>

<!-- Header -->
<div class="hd">
  <div class="hd-back">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
  </div>
  ${avatarHTML}
  <div class="hd-info">
    <div class="hd-name">${contactName}</div>
    <div class="hd-status">${contactStatus}</div>
  </div>
  <div class="hd-actions">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.4-.4a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
  </div>
</div>

<!-- Chat -->
<div class="chat-bg">
  <div class="overlay"></div>
  <div class="content">
    <div class="re-bar">${reactionsHTML}</div>
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
    <div class="cm">
      ${menuHTML}
      ${deleteHTML}
    </div>
  </div>
</div>

</body>
</html>`;
}
