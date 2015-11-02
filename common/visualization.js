(function () {
    openSeadragonizerOptions = openSeadragonizerOptions || {};

    var contentDiv = document.getElementById("contentDiv");
    function setFullHeight() {
        contentDiv.style.height = window.innerHeight + "px";
    }
    setFullHeight();
    window.onresize = setFullHeight;

    var imgUrl = openSeadragonizerOptions.imgUrl ||
            OpenSeadragon.getUrlParameter("img");
    if (!imgUrl) {
        contentDiv.innerHTML =
                "No image specified.<br>" +
                "Set the image in the URL like this:<br>" +
                "visualization.html?img=http://example.org/bigimage.jpg";
        return;
    }

// TODO: remove width/height
    var image = new Image(window.innerWidth, window.innerHeight);
    contentDiv.appendChild(image);

    image.onload = function () {
        contentDiv.removeChild(image);
        document.title = "OpenSeadragon " + imgUrl +
                " (" + image.naturalWidth + "x" + image.naturalHeight + ")";
        OpenSeadragon({
            id: "contentDiv",
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
    };

    image.src = imgUrl;
    document.title = "OpenSeadragon " + imgUrl;
})();
