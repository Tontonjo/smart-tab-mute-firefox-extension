const DEFAULT_STORAGE_DATA = {
  ignoreList: 'messenger.com\nslack.com',
  unmuteLastTab: true,
}

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
  chrome.tabs.query({ audible: true }, (tabs) => {
    const latestAudibleTabId = Math.max(tabs.map(tab => tab.id));
    chrome.tabs.update(latestAudibleTabId, { muted: false });
  });
};

const tabUpdated = (tabId, changeInfo, tab) => {
  chrome.storage.local.get((storage) => {
    const { ignoreList } = storage;
    if (changeInfo && changeInfo.audible === true) {
      const onIgnoreList = ignoreList && Math.max(ignoreList.split(/\n/).map(i => tab.url.indexOf(i.trim()))) > -1;
      if (!onIgnoreList) {
        muteOtherTabs(tab, ignoreList);
      }
    }
    if (changeInfo && changeInfo.audible === false) {
      if (storage && storage.unmuteLastTab) {
        unmuteRecentTab();
      }
    }
  });
};

chrome.storage.local.get((storage) => {
  if (!storage.ignoreList) {
    chrome.storage.local.set(DEFAULT_STORAGE_DATA);
  }
});

chrome.tabs.onUpdated.addListener(tabUpdated);
chrome.tabs.onRemoved.addListener(unmuteRecentTab);
