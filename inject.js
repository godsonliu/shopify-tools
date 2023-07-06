(() => {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.src = chrome.runtime.getURL("menus.js");
  script.onload = function () {
    chrome.storage.sync.get("checkbox").then((data) => {
      data.type = "shopifyTools";
      window.postMessage(data);
      this.parentNode.removeChild(this);
    });
  };
  document.head.appendChild(script);
})();
