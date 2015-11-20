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
    var loaderElt = document.getElementById("loader");
    var popupElt = document.getElementById("popup");
    var urlElt = document.getElementById("url");

    urlElt.onkeyup = function (event) {
        if (event.keyCode === 13) {
            OpenSeadragonizer.open(urlElt.value);
        }
    };

    document.getElementById("show-button").onclick = function () {
        OpenSeadragonizer.open(urlElt.value);
    };

    window.OpenSeadragonizer = {
        open: function (url) {
            popupElt.style.display = "none";

            if (!url) {
                var imgUrlParameter = OpenSeadragon.getUrlParameter("img");
                if (!imgUrlParameter) {
                    popupElt.style.display = "block";
                    return;
                }
                url = OpenSeadragon.getUrlParameter("encoded") ?
                    decodeURIComponent(imgUrlParameter) : imgUrlParameter;
            }

            var options = {
                src: url,
                container: document.getElementById("loader"),
                crossOrigin: 'Anonymous'
            };
            loadImage(options, onImageLoaded, function (event) {
                loaderElt.removeChild(event.image);
                // We retry without CORS
                delete options.crossOrigin;
                loadImage(options, onImageLoaded, onError);
            });
            document.title = "OpenSeadragon " + url;
        }
    };

    function loadImage(options, successCallback, errorCallback) {
        var image = new Image();
        options.container.appendChild(image);
        image.onload = function () {
            successCallback({
                image: image,
                options: options
            });
        };
        image.onerror = function () {
            errorCallback({
                image: image,
                options: options
            });
        };
        if (options.crossOrigin) {
            image.crossOrigin = options.crossOrigin;
        }
        image.src = options.src;
    }

    function onImageLoaded(event) {
        var image = event.image;
        document.title = "OpenSeadragon " + image.src +
                " (" + image.naturalWidth + "x" + image.naturalHeight + ")";
        var viewer = OpenSeadragon({
            id: "openseadragon",
            prefixUrl: "openseadragon/images/",
            tileSources: {
                type: 'image',
                url: image.src,
                crossOriginPolicy: event.options.crossOrigin
            },
            maxZoomPixelRatio: 2,
            showRotationControl: true
        });
        viewer.addHandler("tile-drawn", function readyHandler() {
            viewer.removeHandler("tile-drawn", readyHandler);
            document.body.removeChild(loaderElt);
        });
    }

    function onError(event) {
        popupElt.style.display = "block";
        loaderElt.removeChild(event.image);
        document.getElementById("error").textContent =
                "Can not retrieve requested image.";
    }

})();
