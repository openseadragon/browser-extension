/*
 * Copyright (C) 2015 OpenSeadragon contributors
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * - Neither the name of OpenSeadragon nor the names of its contributors
 *   may be used to endorse or promote products derived from this software
 *   without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
(function () {
    var self = require("sdk/self");
    var tabs = require("sdk/tabs");
    var contextMenu = require("sdk/context-menu");
    var pageMod = require("sdk/page-mod");

    var pm = null;

    contextMenu.Item({
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
})();
