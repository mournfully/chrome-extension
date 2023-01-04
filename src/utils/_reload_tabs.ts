import { getUIDef } from './ui';
import { reloadWindow } from './reload'

export { };

/**
 * see: https://github.com/mohamedmansour/reload-all-tabs-extension
 * perms: tabs
 */

async function reloadHandler() {
    //! console.log("function reloadHandler acknowledges")
    //! chrome.windows.getCurrent((win) => this.reloadWindow(win))
    chrome.windows.getCurrent((win) => reloadWindow(win))
}

export const init = async (): Promise<void> => {
    const ui = getUIDef()

    /* add button events */
    ui.reloadButton.addEventListener('click', async () => {
        //! console.log("reload button acknowledges");
        await reloadHandler()
    });
};

document.addEventListener('DOMContentLoaded', init);
