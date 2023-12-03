const DEFAULT_STORAGE_DATA = {
  ignoreList: 'messenger.com\nslack.com\noutlook.com',
  whitelist: 'voipsystem.com',
  unmuteLastTab: true,
}
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
        // Comparaison avec la liste ignoreList
        if (whitelist.includes(fqdn)) {
          console.log('- On ignore list - dont mute');
        } else {
          console.log(whitelist);
          console.log('- Not on ignore list - muting other tabs');
	  latestAudibleTabId = tab.id;
          chrome.tabs.update(tab.id, { muted: true });
        }
      }
    });
  });
};

const unmuteRecentTab = () => {
	console.log('- Start unmuteRecentTab');
	console.log('- latestAudibleTabId : '+ latestAudibleTabId +' - ActualAudibleTabId : '+ actualAudibleTabId);
	chrome.tabs.update(latestAudibleTabId, { muted: false });
	console.log('- End unmuteRecentTab');  
};

const unmuteRecentTabremoved = (changeInfo) => {
	console.log('- Start unmuteRecentTabremoved');
	if (changeInfo.audible === true) {
	console.log('- latestAudibleTabId : '+ latestAudibleTabId +' - ActualAudibleTabId : '+ actualAudibleTabId);
	chrome.tabs.update(latestAudibleTabId, { muted: false });
	actualAudibleTabId = latestAudibleTabId
	}
	console.log('- End unmuteRecentTab');  
};

const unmuteselectedtab = () => {
console.log('- Start unmuteselectedtab');
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.get(activeTab.id, function(tab) {
      if (tab.mutedInfo && tab.mutedInfo.muted) {
        chrome.tabs.update(activeTab.id, { muted: false });
      }
	  });
  });
console.log('- End unmuteselectedtab');
};

const tabUpdated = (tabId, changeInfo, tab) => {
  if (changeInfo && (changeInfo.audible === true || changeInfo.audible === false)) {
    chrome.storage.local.get((storage) => {
      let actualAudibleTabId = tabId; // Déclarez actualAudibleTabId avec "let" pour éviter une erreur
      console.log('- Start tabUpdated');
      console.log('- latestAudibleTabId : ' + latestAudibleTabId + ' - ActualAudibleTabId : ' + actualAudibleTabId);

      if (changeInfo && changeInfo.audible === true) {
        browser.tabs.query({ active: true, currentWindow: true })
          .then((tabs) => {
            if (tabs.length > 0) {
              const ignoreList = storage.ignoreList;
              const whitelist = storage.whitelist;
              const currentTab = tabs[0];
              const currentUrl = new URL(currentTab.url);
              const fqdn = currentUrl.hostname;
              console.log("- new tab domain: ", fqdn);
              // Comparaison avec la liste ignoreList
              if (ignoreList.includes(fqdn)) {
                console.log('- On ignore list - tab wont get muted');
              } else {
                console.log(whitelist);
                console.log('- Not on ignore list - muting other tabs');
                muteOtherTabs(tab, whitelist);
              }
            }
          });
      }

      if (changeInfo && changeInfo.audible === false) {
        if (storage && storage.unmuteLastTab) {
          if (latestAudibleTabId !== actualAudibleTabId) {
            unmuteRecentTab();
          }
        }
      }

      console.log('- End tabUpdated');
    });
  }
};


chrome.storage.local.get((storage) => {
  if (!storage.ignoreList) {
    chrome.storage.local.set(DEFAULT_STORAGE_DATA);
  }
    if (!storage.whitelist) {
    chrome.storage.local.set(DEFAULT_STORAGE_DATA);
  }
});

chrome.tabs.onUpdated.addListener(tabUpdated);
chrome.tabs.onRemoved.addListener(unmuteRecentTabremoved);
chrome.tabs.onActivated.addListener(unmuteselectedtab)
