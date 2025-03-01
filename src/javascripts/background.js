const DEFAULT_STORAGE_DATA = {
  ignoreList: 'messenger.com\nslack.com\noutlook.office.com',
  whitelist: 'voipsystem.com',
  unmuteLastTab: true,
};

let latestAudibleTabId = null;
let actualAudibleTabId = null;

const muteOtherTabs = (changedTab, whitelist) => {
  console.log('- Start muteOtherTabs');
  chrome.tabs.query({ audible: true }, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id !== changedTab.id) {
        const currentUrl = new URL(tab.url);
        const fqdn = currentUrl.hostname;
        console.log("- new tab domain: ", fqdn);
        
        if (whitelist.includes(fqdn)) {
          console.log('- On whitelist - don\'t mute');
        } else {
          console.log('- Not on whitelist - muting tab');
          latestAudibleTabId = tab.id;
          chrome.tabs.update(tab.id, { muted: true });
        }
      }
    });
  });
  console.log('- End muteOtherTabs');
};

const unmuteRecentTab = () => {
  console.log('- Start unmuteRecentTab');
  chrome.tabs.query({ audible: true }, (tabs) => {
    chrome.storage.local.get((storage) => {
      const whitelistedAudibleTab = tabs.find(tab => storage.whitelist.includes(new URL(tab.url).hostname));
      
      if (whitelistedAudibleTab) {
        console.log('- A whitelisted tab is playing sound, do nothing');
      } else {
        console.log('- Unmuting latest known tab');
        chrome.tabs.update(latestAudibleTabId, { muted: false });
      }
    });
  });
  console.log('- End unmuteRecentTab');
};

const unmuteselectedtab = () => {
  console.log('- Start of unmuteselectedtab');
  
  chrome.storage.local.get((storage) => {
    const whitelist = storage.whitelist || [];
    
    chrome.tabs.query({ audible: true }, (tabs) => {
      const whitelistedAudibleTab = tabs.find(tab => 
        whitelist.includes(new URL(tab.url).hostname)
      );
      
      if (whitelistedAudibleTab) {
        console.log('- A whitelisted tab is playing sound, do nothing');
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length === 0) return;
          
          const activeTab = tabs[0];
          
          chrome.windows.getCurrent((window) => {
            if (window.focused) {
              chrome.tabs.get(activeTab.id, (tab) => {
                if (tab.mutedInfo && tab.mutedInfo.muted) {
                  chrome.tabs.update(activeTab.id, { muted: false });
                  muteOtherTabs(tab, whitelist);
                }
              });
            }
          });
        });
      }
    });
  });
  
  console.log('- End of unmuteselectedtab');
};

const tabUpdated = (tabId, changeInfo, tab) => {
  if (latestAudibleTabId !== tabId) {
    if (changeInfo && (changeInfo.audible === true || changeInfo.audible === false)) {
      chrome.storage.local.get((storage) => {
        console.log('- Start tabUpdated');
        console.log('- latestAudibleTabId:', latestAudibleTabId, '- actualAudibleTabId:', actualAudibleTabId);
        
        if (changeInfo.audible === true) {
          console.log('- Tab is audible');
          chrome.tabs.query({ audible: true }, (tabs) => {
              console.log('- Muting other tabs');
              muteOtherTabs(tab, storage.whitelist);
          });
        } else {
          console.log('- Tab is not audible');
          if (storage.unmuteLastTab) {
            unmuteRecentTab();
          }
        }
        console.log('- End tabUpdated');
      });
    }
  }
};

chrome.storage.local.get((storage) => {
  if (!storage.ignoreList || !storage.whitelist) {
    chrome.storage.local.set(DEFAULT_STORAGE_DATA);
  }
});

// Listener for changes in tabs
chrome.tabs.onUpdated.addListener(tabUpdated);
// Listener for Windows removals
chrome.windows.onRemoved.addListener(unmuteRecentTab);
// Listener for tab removals
chrome.tabs.onRemoved.addListener(unmuteRecentTab);
// Listener for tab focus changes
chrome.tabs.onActivated.addListener(unmuteselectedtab);
// Listener windows focus changes
chrome.windows.onFocusChanged.addListener(unmuteselectedtab);
