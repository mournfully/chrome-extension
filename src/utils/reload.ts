export function reloadWindow(win) {
    //! console.log("function reloadWindow acknowledges")
    const bypassCache = false
    chrome.tabs.query({ windowId: win.id }, async (tabs) => {
        for (const i in tabs) {
            const tab = tabs[i]
            // see: https://developer.chrome.com/docs/extensions/reference/tabs/#method-reload
            chrome.tabs.reload(tab.id, { bypassCache }, null)
        }
    })
}

//! function test(win) {
//!     console.log("function test acknowledges")
//!     console.log(win)
//! }
