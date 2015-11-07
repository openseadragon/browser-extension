(function () {
    chrome.tabs.getCurrent(function(tab) {
      chrome.runtime.sendMessage({
          request: "getUrl"
      }, function(response) {
          window.OpenSeadragonizer.open(response.url);
      });
    });
})();
