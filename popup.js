document.querySelector("#settings").onclick = (e) => {
    let url = "chrome-extension://" + chrome.runtime.id + "/settings.html"
    chrome.tabs.create({url})
}
document.querySelector("#export").onclick = (e) => {
    let clips = Array.from(document.querySelectorAll("li")).map(({ style, textContent }) => {
        return { background: style.background, text: textContent }
    })
    if (clips.length > 0) {
        let blob = new Blob([JSON.stringify(clips, null, 2)], {type : "application/json"})
        chrome.downloads.download({ filename: "clips.json", url: URL.createObjectURL(blob) })
    }
}

const ul = document.querySelector("ul")
chrome.storage.sync.get({ clips: [], dark: false }, ({ clips }) => {
    clips.forEach((clip) => {
        let li = document.createElement("li")
        li.style.background = clip.background || "white"
        li.textContent = clip.text
        li.title = "Click to copy"
        li.onclick = (e) => navigator.clipboard.writeText(clip.text).then(window.close)
        ul.appendChild(li)
    })
})
chrome.storage.local.get({ clips: defaultClips, dark: false }, ({ clips, dark }) => {
    document.body.className = dark ? "dark" : ""
    clips.forEach((clip) => {
        let li = document.createElement("li")
        li.style.background = clip.background || "white"
        li.textContent = clip.text
        li.title = "Click to copy"
        li.onclick = (e) => navigator.clipboard.writeText(clip.text).then(window.close)
        ul.appendChild(li)
    })
})

