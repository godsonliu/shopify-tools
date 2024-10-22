const menuList = [
  {
    id: "refresh",
    title: "清除缓存",
    includes: [
      "anker.com",
      "ankersolix.com",
      "eufy.com",
      "mach.com",
      "soundcore.com",
      "seenebula.com",
      "ankermake.com",
      "ankerwork.com",
      "beta-anker-",
      "beta-ankersolix-",
      "beta-eufy-",
      "beta-mach-",
      "beta-soundcore-",
      "beta-seenebula-",
      "beta-ankermake-",
      "beta-ankerwork-",
    ],
    excludes: ["admin.shopify.com"],
  },
  {
    id: "handle",
    title: "复制handle",
    includes: ["/products/"],
    excludes: ["admin.shopify.com"],
  },
  {
    id: "sku",
    title: "复制sku",
    includes: ["/products/"],
    excludes: ["admin.shopify.com"],
  },
  {
    id: "handle-sku",
    title: "复制handle及sku (json格式)",
    includes: ["/products/"],
    excludes: ["admin.shopify.com"],
  },
  {
    id: "link",
    title: "打开链接",
    includes: ["admin.shopify.com/store/*/products"],
    excludes: [],
  },
];

const matchUrl = (url, includes, excludes) => {
  let result = false;
  includes.forEach((include) => {
    if (include.indexOf("*") > -1) {
      const reg = new RegExp(include.replace(/\*/g, ".*"));
      if (reg.test(url)) {
        result = true;
      }
    } else {
      if (url.includes(include)) {
        result = true;
      }
    }
  });
  excludes.forEach((exclude) => {
    if (exclude.indexOf("*") > -1) {
      const reg = new RegExp(exclude.replace(/\*/g, ".*"));
      if (reg.test(url)) {
        result = true;
      }
    } else {
      if (url.includes(exclude)) {
        result = false;
      }
    }
  });
  return result;
};

const toggleTab = (tab) => {
  menuList.forEach((item) => {
    chrome.contextMenus.update(item.id, {
      visible: matchUrl(tab.url, item.includes, item.excludes),
    });
  });
};

chrome.runtime.onInstalled.addListener(() => {
  menuList.forEach((item) => {
    chrome.contextMenus.create({
      id: item.id,
      title: item.title,
      contexts: ["page"],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  let selectItem = menuList.filter((item) => item.id === info.menuItemId)[0];
  if (selectItem) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [selectItem],
      func: (selectItem) => {
        function copy(text) {
          const input = document.createElement("INPUT");
          input.style.opacity = 0;
          input.style.position = "absolute";
          input.style.left = "-100000px";
          document.body.appendChild(input);

          input.value = text;
          input.select();
          input.setSelectionRange(0, text.length);
          document.execCommand("copy");
          document.body.removeChild(input);
          return true;
        }
        const headless = !!document.getElementById("__NEXT_DATA__");
        let sku;
        const handle = location.pathname.split("/").pop();
        if (headless) {
          if (selectItem.id === "refresh") {
            fetch(
              `${location.origin}/api/revalidate?secret=ankerinner&path=${location.pathname}`
            ).then(() => {
              {
                location.reload();
              }
            });
            return;
          }
          const nextData = JSON.parse(
            document.getElementById("__NEXT_DATA__").innerHTML
          );
          const { pageProps } = nextData.props;
          const { product } = pageProps;
          sku = product.variants[0].sku;
        } else if (window.Shopify) {
          sku = document.head.innerHTML.match(
            /var meta =.+"sku":\s?"(.+?)"/
          )?.[1];
        }

        switch (selectItem.id) {
          case "handle":
            copy(handle);
            break;
          case "sku":
            copy(sku);
            break;
          case "handle-sku":
            copy(
              JSON.stringify({
                handle,
                sku,
              })
            );
            break;
          case "link":
            const seo = document.getElementById("seo")?.innerHTML || "";
            const matchs = seo.match(/https.+?\</);
            if (matchs) {
              let url = matchs[0].slice(0, -1);
              url = url.replace(/›/g, "/").replace(/\s/g, "");
              window.open(url);
            }
            break;
        }
      },
    });
  }
});

chrome.tabs.onCreated.addListener((tab) => {
  toggleTab(tab);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    toggleTab(tab);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  toggleTab(tab);
});
