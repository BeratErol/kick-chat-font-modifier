const defaults = {
  msgSize: 13,
  userSize: 13,
  lineHeight: 14
};

function showStatus(msg, green = true) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = 'status' + (green ? ' saved' : '');
  setTimeout(() => {
    el.textContent = 'kick.com sekmesinde aktif';
    el.className = 'status';
  }, 1500);
}

function applyToTabs(settings) {
  chrome.tabs.query({ url: 'https://kick.com/*' }, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { type: 'UPDATE_SETTINGS', settings });
    });
  });
}

function save(settings) {
  chrome.storage.sync.set({ kickFontSettings: settings }, () => {
    applyToTabs(settings);
    showStatus('✓ Kaydedildi');
  });
}

function getSettings() {
  return {
    msgSize: parseInt(document.getElementById('msgSize').value),
    userSize: parseInt(document.getElementById('userSize').value),
    lineHeight: parseInt(document.getElementById('lineHeight').value)
  };
}

function applyUI(s) {
  document.getElementById('msgSize').value = s.msgSize;
  document.getElementById('userSize').value = s.userSize;
  document.getElementById('lineHeight').value = s.lineHeight;

  document.getElementById('msgSizeVal').textContent = s.msgSize + 'px';
  document.getElementById('userSizeVal').textContent = s.userSize + 'px';
  document.getElementById('lineHeightVal').textContent = (s.lineHeight / 10).toFixed(1);
}

chrome.storage.sync.get('kickFontSettings', (data) => {
  applyUI(data.kickFontSettings || defaults);
});

['msgSize', 'userSize', 'lineHeight'].forEach(id => {
  const input = document.getElementById(id);
  const valEl = document.getElementById(id + 'Val');

  input.addEventListener('input', () => {
    if (id === 'lineHeight') {
      valEl.textContent = (parseInt(input.value) / 10).toFixed(1);
    } else {
      valEl.textContent = input.value + 'px';
    }
    save(getSettings());
  });
});

document.getElementById('resetBtn').addEventListener('click', () => {
  applyUI(defaults);
  save(defaults);
});
