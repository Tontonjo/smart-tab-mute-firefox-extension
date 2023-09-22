const DEFAULT_STORAGE_DATA = {
  ignoreList: 'messenger.com\nslack.com\noutlook.com',
  unmuteLastTab: true,
}
let latestAudibleTabId = null;
let actualAudibleTabId = null;

const muteOtherTabs = (changedTab, ignoreList) => {
  chrome.tabs.query({ audible: true }, (tabs) => {
    tabs.forEach((tab) => {
      const onIgnoreList = ignoreList && Math.max(ignoreList.split(/\n/).map(i => tab.url.indexOf(i.trim()))) > -1;
      if (tab.id !== changedTab.id && !onIgnoreList) {
        chrome.tabs.update(tab.id, { muted: true });
      }
    })
  });
};

const unmuteRecentTab = () => {
	
	console.log('DEBUT unmuteRecentTab');
	
	chrome.tabs.query({ muted: true }, (tabs) => {
		tabs.forEach((tab) => {
		
		console.log(tab);
		
	//	const latestAudibleTabId = Math.max(tabs.map(tab => tab.id));
		const latestAudibleTabId = tab.id;
				
		console.log('latestAudibleTabId : '+ latestAudibleTabId);
		console.log('actualAudibleTabId : '+ actualAudibleTabId);
		if (latestAudibleTabId !== actualAudibleTabId) {
		chrome.tabs.update(latestAudibleTabId, { muted: false });
		}
		console.log('------- FIN unmuteRecentTab');  
	});

	})
  
};

const tabUpdated = (tabId, changeInfo, tab) => {
  chrome.storage.local.get((storage) => {
    const { ignoreList } = storage;	
    if (changeInfo && changeInfo.audible === true) {
      const onIgnoreList = ignoreList && Math.max(ignoreList.split(/\n/).map(i => tab.url.indexOf(i.trim()))) > -1;
      if (!onIgnoreList) {
		console.log('--------------- not on ignor list - mute other tabs  ------------------');
		actualAudibleTabId = tabId;
        muteOtherTabs(tab, ignoreList);
      }
	  	console.log('--------------- tabUpdated ------------------');
		console.log('--------------- audible === true ------------------');
		console.log('tab n°'+tabId + ' :  '+tab.title);
		console.log(JSON.stringify(changeInfo))
		console.log('audible : ' + JSON.stringify(tab.audible));
		console.log(JSON.stringify(tab.mutedInfo))
		console.log('actualAudibleTabId : '+ actualAudibleTabId);
	   console.log(tab.mutedInfo.reason);
	  
    }
    if (changeInfo && changeInfo.audible === false) {
      if (storage && storage.unmuteLastTab) {
		console.log('--------------- tabUpdated ------------------');
		console.log('--------------- audible === false ------------------');
		console.log('tab n°'+tabId + ' :  '+tab.title);
		console.log(JSON.stringify(changeInfo))
		console.log('audible : ' + JSON.stringify(tab.audible));
		console.log(JSON.stringify(tab.mutedInfo))
		console.log('actualAudibleTabId : '+ actualAudibleTabId);
        unmuteRecentTab();
      }
    }
  });
  actualAudibleTabId = tabId;
};

chrome.storage.local.get((storage) => {
  if (!storage.ignoreList) {
    chrome.storage.local.set(DEFAULT_STORAGE_DATA);
  }
 	console.log('--------------- DEFAULT_STORAGE_DATA ------------------');
	console.log(storage); 
  
});

chrome.tabs.onUpdated.addListener(tabUpdated);
chrome.tabs.onRemoved.addListener(unmuteRecentTab);
