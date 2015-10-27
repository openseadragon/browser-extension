(function () {
  var contentDiv = document.getElementById("contentDiv");
  contentDiv.style.height = window.innerHeight + "px";

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
      constrainDuringPan: true,
      maxZoomPixelRatio: 1
    });
  };

  var imgUrl = OpenSeadragon.getUrlParameter("img");
  image.src = imgUrl;
  document.title = "OpenSeadragon " + imgUrl;
})();
