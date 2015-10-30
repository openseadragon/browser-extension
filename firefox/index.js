var self = require("sdk/self");
var tabs = require("sdk/tabs");
var contextMenu = require("sdk/context-menu");

var menuItem = contextMenu.Item({
    label: "View in OpenSeadragon",
    image: self.data.url("logo16.png"),
    context: contextMenu.SelectorContext("img"),
    contentScriptFile: self.data.url("contentScript.js"),
    onMessage: function (imgUrl) {
        var protocol = imgUrl.split("/")[0].replace(":", "");
        imgUrl = imgUrl.replace(protocol + "://", "");
        tabs.activeTab.url = self.data.url("visualization.html?img=" + imgUrl +
                "&protocol=" + protocol);
    }
});
