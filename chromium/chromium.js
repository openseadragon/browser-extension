chrome.contextMenus.create({
    type: "normal",
    contexts: ["image"],
    title: "View with OpenSeadragon",
    onclick: function (event) {
        chrome.tabs.update({url: "visualization.html?img=" + event.srcUrl});
    }
});
