// cache blob
export const securedImageWMS = function (image, src) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", src);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
      var arrayBufferView = new Uint8Array(this.response);
      var blob = new Blob([arrayBufferView], { type: "image/png" });
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(blob);
      image.getImage().src = imageUrl;
    };
    xhr.send();
};

export const clearLocalData = (key) => {
    if (key === "ALL") {
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      localStorage.removeItem(key);
    }
};