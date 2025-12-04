chrome.runtime.onInstalled.addListener(async () => {
  console.log("onInstalled");
  await chrome.storage.local.set({ stateOfExtension: "OFF" });
  await chrome.action.setBadgeText({ text: "OFF" });
});

chrome.runtime.onStartup.addListener(async () => {
  console.log("startup");
  const res = await chrome.storage.local.get("stateOfExtension");
  const state = res.stateOfExtension ?? "OFF"; 
  await chrome.action.setBadgeText({ text: state });
});

chrome.action.onClicked.addListener(async (tab) => {
  console.log("onClicked");
  const res = await chrome.storage.local.get("stateOfExtension");
  const state = res.stateOfExtension ?? "OFF";
  const newState = (state === "ON") ? "OFF" : "ON";

  await chrome.storage.local.set({ stateOfExtension: newState });

  await chrome.action.setBadgeText({
    text: newState
  });


  if(tab.url.startsWith("https://anidb.net") || tab.url.startsWith("http://anidb.net")){
    chrome.tabs.reload(tab.id);
  }
});