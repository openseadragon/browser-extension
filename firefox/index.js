var self = require("sdk/self");
var tabs = require("sdk/tabs");
var contextMenu = require("sdk/context-menu");

var menuItem = contextMenu.Item({
    label: "View in OpenSeadragon",
    image: self.data.url("logo16.png"),
    context: contextMenu.SelectorContext("img"),
    contentScript: 'self.on("click", function (node) {' +
            '  self.postMessage(node.src);' +
            '});',
    onMessage: function (imgUrl) {
        imgUrl = imgUrl.replace("http://", "");
        tabs.open("visualization.html?img=" + imgUrl);
    }
});
