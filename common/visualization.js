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
document.getElementById("url").onkeyup = function (event) {
    if (event.keyCode === 13) {
        OpenSeadragonizer.open(document.getElementById('url').value);
    }
};

document.getElementById("show-button").onclick = function () {
    OpenSeadragonizer.open(document.getElementById('url').value);
};

window.OpenSeadragonizer = {
    open: function (url) {
        var popup = document.getElementById("popup");
        popup.style.display = "none";

        url = url || OpenSeadragon.getUrlParameter("img");
        if (!url) {
            popup.style.display = "block";
            return;
        }

        var image = new Image();
        var loaderDiv = document.getElementById("loader");
        loaderDiv.appendChild(image);

        image.onload = function () {
            document.title = "OpenSeadragon " + url +
                    " (" + image.naturalWidth + "x" + image.naturalHeight + ")";
            var viewer = OpenSeadragon({
                id: "openseadragon",
                prefixUrl: "openseadragon/images/",
                tileSources: {
                    type: 'legacy-image-pyramid',
                    levels: [{
                            url: image.src,
                            width: image.naturalWidth,
                            height: image.naturalHeight
                        }]
                },
                visibilityRatio: 1,
                constrainDuringPan: false,
                maxZoomPixelRatio: 2,
                showRotationControl: true
            });
            viewer.addHandler("tile-drawn", function readyHandler() {
                viewer.removeHandler("tile-drawn", readyHandler);
                document.body.removeChild(loaderDiv);
            });
            //TODO: use tile-load-failed when upgrading OSD to 2.1 to detect
            //errors.
        };

        image.onerror = function () {
            popup.style.display = "block";
            loaderDiv.removeChild(image);
            document.getElementById("error").textContent =
                    "Can not retrieve requested image.";
        };

        image.src = url;
        document.title = "OpenSeadragon " + url;
    }
};
