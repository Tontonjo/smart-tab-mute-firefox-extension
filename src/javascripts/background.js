const DEFAULT_STORAGE_DATA = {
  ignoreList: 'messenger.com\nslack.com\noutlook.com\noffice.com',
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
          console.log('- On whitelist - dont mute');
        } else {
          console.log('- Not on whitelist - muting tab');
		  latestAudibleTabId = tab.id;
          chrome.tabs.update(tab.id, { muted: true });
		  console.log('- End muteOtherTabs');
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
	if (latestAudibleTabId !== null) {
    // Perform your action here
    console.log("- latestAudibleTabId is not null, unmuting latest known tab");
	chrome.tabs.update(latestAudibleTabId, { muted: false });
} else {
    console.log("- latestaudibletabid is null.");
	if (changeInfo.audible === true) {
	console.log('- latestAudibleTabId : '+ latestAudibleTabId +' - ActualAudibleTabId : '+ actualAudibleTabId);
	chrome.tabs.update(latestAudibleTabId, { muted: false });
	actualAudibleTabId = latestAudibleTabId
	}
}


	console.log('- End unmuteRecentTab');  
};

const unmuteselectedtab = () => {
  console.log('- Start of unmuteselectedtab');
  chrome.storage.local.get((storage) => {
    const whitelist = storage.whitelist;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTab = tabs[0];
      chrome.windows.getCurrent(function(window) {
        if (window.focused) {
          chrome.tabs.get(activeTab.id, function(tab) {
            if (tab.mutedInfo && tab.mutedInfo.muted) {
              chrome.tabs.update(activeTab.id, { muted: false });
              muteOtherTabs(tab, whitelist);
            }
          });
        }
      });
    });
    console.log('- End of unmuteselectedtab');
  });
};



const tabUpdated = (tabId, changeInfo, tab) => {
  let actualAudibleTabId = tabId;
  if (latestAudibleTabId !== actualAudibleTabId) {
  if (changeInfo && (changeInfo.audible === true || changeInfo.audible === false)) {
    chrome.storage.local.get((storage) => {
      let actualAudibleTabId = tabId;
      console.log('- Start tabUpdated');
      console.log('- latestAudibleTabId : ' + latestAudibleTabId + ' - ActualAudibleTabId : ' + actualAudibleTabId);
      if (changeInfo && changeInfo.audible === true) {
		console.log('- Tab is audible');  
        browser.tabs.query({ active: true, currentWindow: true })
          .then((tabs) => {
            if (tabs.length > 0) {
              const ignoreList = storage.ignoreList;
              const whitelist = storage.whitelist;
              const currentTab = tabs[0];
              const currentUrl = new URL(currentTab.url);
              const fqdn = currentUrl.hostname;
              console.log("- New tab domain: ", fqdn);
              if (ignoreList.includes(fqdn)) {
                console.log('- On ignorelist - tab wont get muted');
              } else {
                console.log('- Not on ignoreList - muting other tabs');
                muteOtherTabs(tab, whitelist);
              }
            }
          });
      } else {
		console.log('- Tab is not audible');
        if (storage && storage.unmuteLastTab) {
		unmuteRecentTab();
        }
	  }
      console.log('- End tabUpdated');
    });
  }
};
}



chrome.storage.local.get((storage) => {
  if (!storage.ignoreList) {
    chrome.storage.local.set(DEFAULT_STORAGE_DATA);
  }
    if (!storage.whitelist) {
    chrome.storage.local.set(DEFAULT_STORAGE_DATA);
  }
});

// Listener for changes in tabs
chrome.tabs.onUpdated.addListener(tabUpdated);
// Listener for tab removals
chrome.tabs.onRemoved.addListener(unmuteRecentTabremoved);
// Listener for tab selection
chrome.tabs.onActivated.addListener(unmuteselectedtab)
// Listener windows focus changes
chrome.windows.onFocusChanged.addListener(unmuteselectedtab)