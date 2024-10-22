(() => {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.src = chrome.runtime.getURL("menus.js");
  script.onload = () => {
    chrome.storage.sync.get(["checkbox1", "checkbox2"], (data) => {
      data.type = "shopifyTools";
      window.postMessage(data);
      script.parentNode.removeChild(script);
    });
  };
  document.head.appendChild(script);
})();
