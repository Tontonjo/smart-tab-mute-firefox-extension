const DEFAULT_STORAGE_DATA = {
  ignoreList: 'messenger.com\nslack.com\noutlook.com',
  unmuteLastTab: true,
}
let latestAudibleTabId = null;
let actualAudibleTabId = null;

const muteOtherTabs = (changedTab, ignoreList) => {
console.log('- Start muteOtherTabs');
  chrome.tabs.query({ audible: true }, (tabs) => {
    tabs.forEach((tab) => {
      const onIgnoreList = ignoreList && Math.max(ignoreList.split(/\n/).map(i => tab.url.indexOf(i.trim()))) > -1;
      if (tab.id !== changedTab.id && !onIgnoreList) {
		latestAudibleTabId = tab.id;
        chrome.tabs.update(tab.id, { muted: true });
      }
    })
  });
};

const unmuteRecentTab = () => {
	console.log('- Start unmuteRecentTab');
	console.log('- latestAudibleTabId : '+ latestAudibleTabId +' - ActualAudibleTabId : '+ actualAudibleTabId);
	chrome.tabs.update(latestAudibleTabId, { muted: false });
	console.log('- End unmuteRecentTab');  
};

const unmuteRecentTabremoved = () => {
	console.log('- Start unmuteRecentTabremoved');
	console.log('- latestAudibleTabId : '+ latestAudibleTabId +' - ActualAudibleTabId : '+ actualAudibleTabId);
	chrome.tabs.update(latestAudibleTabId, { muted: false });
	console.log('- End unmuteRecentTab');  
};

const tabUpdated = (tabId, changeInfo, tab) => {
if (changeInfo && changeInfo.audible === true || changeInfo && changeInfo.audible === false) {
  chrome.storage.local.get((storage) => {
    const { ignoreList } = storage;	
	actualAudibleTabId = tabId;
	console.log('- Start tabUpdated');
	console.log('- latestAudibleTabId : '+ latestAudibleTabId +' - ActualAudibleTabId : '+ actualAudibleTabId);
    if (changeInfo && changeInfo.audible === true) {
      const onIgnoreList = ignoreList && Math.max(ignoreList.split(/\n/).map(i => tab.url.indexOf(i.trim()))) > -1;
      if (!onIgnoreList) {
		console.log('- Not on ignor list - muting other tabs');
        muteOtherTabs(tab, ignoreList);
      }
	  
    }
    if (changeInfo && changeInfo.audible === false) {
      if (storage && storage.unmuteLastTab) {
		if (latestAudibleTabId !== actualAudibleTabId) {
		unmuteRecentTab();
		}
      }
    }
  });
  console.log('-End tabUpdated');
 
};
}

chrome.storage.local.get((storage) => {
  if (!storage.ignoreList) {
    chrome.storage.local.set(DEFAULT_STORAGE_DATA);
  }
});

chrome.tabs.onUpdated.addListener(tabUpdated);
chrome.tabs.onRemoved.addListener(unmuteRecentTabremoved);
