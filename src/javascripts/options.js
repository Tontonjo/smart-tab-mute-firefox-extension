import $ from 'npm-zepto';

const $ignoreList = $('textarea[name=ignoreList]');
const $unmuteLastTab = $('input[name=unmuteLastTab]');

chrome.storage.local.get((data) => {
  if (data && data.ignoreList) {
    $ignoreList.val(data.ignoreList);
  }
  if (data && data.unmuteLastTab) {
    $unmuteLastTab.prop('checked', data.unmuteLastTab);
  }
});

$ignoreList.on('keyup', (event) => {
  chrome.storage.local.set({ ignoreList: $ignoreList.val() });
});

$unmuteLastTab.on('change', (event) => {
  chrome.storage.local.set({ unmuteLastTab: $unmuteLastTab.prop('checked') });
});
