chrome.contextMenus.create({
    type: "normal",
    contexts: ["image"],
    title: "View with OpenSeadragon",
    onclick: function (event) {
        chrome.tabs.update({
            url: "visualization.html"
        }, function (tab) {
            function messageHandler(message, sender, sendResponse) {
                if (sender.tab.id === tab.id &&
                        message.request === "getUrl") {
                    chrome.runtime.onMessage.removeListener(messageHandler);
                    sendResponse({url: event.srcUrl});
                }
            }
            chrome.runtime.onMessage.addListener(messageHandler);
        });
    }
});
