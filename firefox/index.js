var self = require("sdk/self");
var tabs = require("sdk/tabs");
var contextMenu = require("sdk/context-menu");
var pageMod = require("sdk/page-mod");

var pm = null;

var menuItem = contextMenu.Item({
    label: "View in OpenSeadragon",
    image: self.data.url("logo16.png"),
    context: contextMenu.SelectorContext("img"),
    contentScriptFile: self.data.url("contextMenuContentScript.js"),
    onMessage: function (imgUrl) {
        if (pm) {
            pm.destroy();
        }
        var url = self.data.url("visualization.html");
        pm = pageMod.PageMod({
            include: url,
            contentScriptFile: self.data.url("visualizationContentScript.js"),
            contentScriptWhen: "start",
            contentScriptOptions: {
                imgUrl: imgUrl
            }
        });

        tabs.activeTab.url = url;
    }
});
