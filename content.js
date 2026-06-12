const STYLE_ID = 'kick-font-custom-style';

function buildCSS(s) {
  const lh = (s.lineHeight / 10).toFixed(1);

  return `
    /* Kick Chat Font Extension */

    /* Genel chat span/p hepsi - mesaj metni */
    #chatroom span,
    #chatroom p,
    [id*="chatroom"] span,
    [id*="chatroom"] p,
    [class*="chatroom"] span,
    [class*="chatroom"] p,
    [class*="chat-entry"] span,
    [class*="chat-entry"] p,
    [data-chat-entry] span,
    [data-chat-entry] p,
    [class*="chatroom"] [class*="message"] span,
    .chat-message-content span,
    .chat-message-content p {
      font-size: ${s.msgSize}px !important;
      line-height: ${lh} !important;
    }

    /* Kullanıcı adları - her ihtimale karşı çok geniş selektör */
    #chatroom [class*="font-bold"],
    [id*="chatroom"] [class*="font-bold"],
    [class*="chatroom"] [class*="font-bold"],
    [class*="chat-entry"] [class*="font-bold"],
    [data-chat-entry] [class*="font-bold"],
    [class*="chat-entry"] .font-bold,
    [class*="chatroom"] .font-bold,
    #chatroom .font-bold,
    [id*="chatroom"] .font-bold,
    [class*="username"],
    [class*="chat-entry"] [class*="username"],
    [class*="chatroom"] [class*="username"],
    .chat-message-identity,
    .chat-message-identity *,
    .chat-message-identity span,
    [class*="chat-message-identity"],
    [class*="chat-message-identity"] *,
    [class*="chat-message-identity"] span {
      font-size: ${s.userSize}px !important;
      line-height: ${lh} !important;
    }
  `;
}

function applyStyles(settings) {
  let styleEl = document.getElementById(STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = buildCSS(settings);
}

// Load on page start
chrome.storage.sync.get('kickFontSettings', (data) => {
  if (data.kickFontSettings) {
    applyStyles(data.kickFontSettings);
  }
});

// Listen for live updates from popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'UPDATE_SETTINGS') {
    applyStyles(msg.settings);
  }
});

// Re-apply when Kick does a SPA navigation
let lastUrl = location.href;
const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    chrome.storage.sync.get('kickFontSettings', (data) => {
      if (data.kickFontSettings) {
        setTimeout(() => applyStyles(data.kickFontSettings), 800);
      }
    });
  }
});
observer.observe(document.body, { childList: true, subtree: true });
