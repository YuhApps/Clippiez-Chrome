const yellow_100 = "#FFF9C4";
const green_100 = "#C8E6C9";
const defaultClips = [
    {
        background: yellow_100,
        text: "On popup view, click on a clip to copy its text so you can paste it anywhere you want."
    },
    {
        background: green_100,
        text: "To manage your clips, click the top right icon on popup view."
    }
]

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "add-selection-to-clips",
        title: "Add \"%s\" to Clips",
        contexts: ["selection"]
    }),
    chrome.contextMenus.create({
        id: "add-link-to-clips",
        title: "Add link to Clips",
        contexts: ["link"]
    })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
    let defaultSettings = { clips: defaultClips, dark: false, defaultLinkColor: "rgb(255, 255, 255)", defaultSelectionTextColor: "rgb(255, 255, 255)" }
    if (info.linkUrl) {
        chrome.storage.local.get(defaultSettings, ({ clips, dark, defaultLinkColor, defaultSelectionTextColor }) => {
            let clip = { background: defaultLinkColor, text: info.linkUrl }
            chrome.storage.local.set({ clips: [...clips, clip], dark, defaultLinkColor, defaultSelectionTextColor })
        })
    } else if (info.selectionText) {
        chrome.storage.local.get(defaultSettings, ({ clips, dark, defaultLinkColor, defaultSelectionTextColor }) => {
            let clip = { background: defaultSelectionTextColor, text: info.selectionText }
            chrome.storage.local.set({ clips: [...clips, clip], dark, defaultLinkColor, defaultSelectionTextColor })
        })
    }
})