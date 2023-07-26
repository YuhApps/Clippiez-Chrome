const body = document.querySelector("body")
const textarea = document.querySelector("textarea")
const ul = document.querySelector("ul")

textarea.onkeydown = (e) => { if (e.keyCode === 13) e.preventDefault() }

document.querySelector("#scroll-to-top").onclick = (e) => {
    document.querySelector("li").scrollIntoView(false)
}
document.querySelector("#scroll-to-bottom").onclick = (e) => {
    let lis = document.querySelectorAll("li")
    lis[lis.length - 1].scrollIntoView(true)
}
document.querySelector("#dark").onclick = (e) => {
    body.className = body.className === "dark" ? "" : "dark"
    saveClips()
}
document.querySelector("#delete-all").onclick = (e) => {
    ul.innerHTML = ""
    let defaultLinkColor = document.querySelector("#default-link-color-container span.selected").style.background
    let defaultSelectionTextColor = document.querySelector("#default-selection-text-color-container span.selected").style.background
    chrome.storage.local.set({ clips: [], dark: body.className === "dark", defaultLinkColor, defaultSelectionTextColor })
}
document.querySelector("#export").onclick = (e) => {
    let clips = Array.from(document.querySelectorAll("li span")).map(({ style, textContent }) => {
        return { background: style.background, text: textContent }
    })
    if (clips.length > 0) {
        let blob = new Blob([JSON.stringify(clips, null, 2)], {type : "application/json"})
        chrome.downloads.download({ filename: "clips.json", url: URL.createObjectURL(blob) })
    }
}
document.querySelectorAll(".color-picker-container span").forEach((span) => {
    span.onclick = (e) => {
        span.parentNode.childNodes.forEach((s) => s.className = "")
        span.className = "selected"
        if (span.parentNode.id === "add-color-picker-container") {
            textarea.style.background = span.style.background
        } else {
            saveClips()
        }
    }
})
document.querySelector("#clear-text").onclick = (e) => {
    textarea.value = ""
}
document.querySelector("#add-clip").onclick = (e) => {
    try {
        let clips = JSON.parse(textarea.value)
        clips.forEach(addClip)
    } catch (e) {
        addClip({ background: textarea.style.background, text: textarea.value })
    }
    saveClips()
    textarea.value = ""
    let lis = document.querySelectorAll("li")
    lis[lis.length - 1].scrollIntoView(true)
}

chrome.storage.sync.get({ clips: [] }, ({ clips }) => {
    clips.forEach(addClip)
})
chrome.storage.local.get({ clips: defaultClips, dark: false, defaultLinkColor: "rgb(255, 255, 255)", defaultSelectionTextColor: "rgb(255, 255, 255)" }, ({ clips, dark, defaultLinkColor, defaultSelectionTextColor }) => {
    body.className = dark ? "dark" : ""
    document.querySelectorAll("#default-link-color-container span").forEach((span) => span.className = span.style.background === defaultLinkColor ? "selected" : "")
    document.querySelectorAll("#default-selection-text-color-container span").forEach((span) => span.className = span.style.background === defaultSelectionTextColor ? "selected" : "")
    clips.forEach(addClip)
})

function addClip(clip) {
    let li = document.createElement("li")
    let span = document.createElement("span")
    let i_delete = document.createElement("a")
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.style.display = "block"
    svg.setAttribute("width", 24)
    svg.setAttribute("height", 24)
    svg.setAttribute("viewBox", "0 0 24 24")
    svg.innerHTML = "<path d=\"m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm4.253 7.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z\"/>"
    // svg.innerHTML = "<path d=\"M19 24h-14c-1.104 0-2-.896-2-2v-16h18v16c0 1.104-.896 2-2 2m3-19h-20v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2zm-12-2h4v-1h-4v1z\"/>"
    i_delete.title = "Delete clip"
    li.className = "card"
    li.style.background = clip.background || "white"
    span.textContent = clip.text
    span.style.background = clip.background || "white"
    i_delete.onclick = (e) => {
        ul.removeChild(li)
        saveClips()
    }

    i_delete.appendChild(svg)
    li.appendChild(span)
    li.appendChild(i_delete)
    ul.appendChild(li)
}

function saveClips() {
    let clips = Array.from(document.querySelectorAll("li span")).map(({ style, textContent }) => { 
        return { background: style.background, text: textContent }
    })
    let defaultLinkColor = document.querySelector("#default-link-color-container span.selected").style.background
    let defaultSelectionTextColor = document.querySelector("#default-selection-text-color-container span.selected").style.background
    chrome.storage.local.set({ clips, dark: body.className === "dark", defaultLinkColor, defaultSelectionTextColor })
}