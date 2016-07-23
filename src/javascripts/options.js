const ignoreList = document.querySelector('textarea[name=ignoreList]');
const unmuteLastTab = document.querySelector('input[name=unmuteLastTab]');

chrome.storage.local.get((data) => {
  if (data && data.ignoreList) {
    ignoreList.value = data.ignoreList;
  }
  if (data && data.unmuteLastTab) {
    unmuteLastTab.checked = data.unmuteLastTab;
  }
});

ignoreList.addEventListener('keyup', (event) => {
  chrome.storage.local.set({ ignoreList: ignoreList.value });
});

unmuteLastTab.addEventListener('change', (event) => {
  chrome.storage.local.set({ unmuteLastTab: unmuteLastTab.checked });
});
