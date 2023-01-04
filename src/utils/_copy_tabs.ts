import { getUIDef } from './ui';
import { getStoredOptions, StorageKey, storeValue } from './storage';
import { debounce } from 'ts-debounce';

export { };

export const SAVE_URL_LIST_DEBOUNCE_TIME_MS = 100;
export const UPDATE_TAB_COUNT_DEBOUNCE_TIME_MS = 50;

/**
 * see: https://github.com/kiichi/QuickCopyTitleAndURL
 * perms: storage, tabs, clipboardWrite
 * debug: chrome.storage.local.get(console.log)
 */

const saveOptions = async (name: string, value: string): Promise<void> => {
    if (name == "format") {
        await storeValue<string>(StorageKey.tabFormat, value);
    }   
    if (name == "scope") {
        await storeValue<string>(StorageKey.tabScope, value);
    }
};

const debouncedSaveOptions = debounce(
    saveOptions,
    SAVE_URL_LIST_DEBOUNCE_TIME_MS
);

function copyTabsHandler(dataFormat, dataAction) {
	setupOptions(dataFormat, dataAction);
}

export const init = async (): Promise<void> => {
    const ui = getUIDef();
    const options = await getStoredOptions();

    /* restore radio button options and add an event listener for each radio button */
    let matches = ui.copyForm.querySelectorAll("input[type=radio]");
    for (let i = 0; i < matches.length; i++) {
        if (options.tabFormat == matches[i].id || options.tabScope == matches[i].id) {
            // @ts-ignore
            ui.copyForm.querySelector(`#${matches[i].id}`).checked = true;
        }
        matches[i].addEventListener("change", function() {
            debouncedSaveOptions(this.name, this.id);
            // debouncedUpdateTabCount(ui);
        });
    }

    /* add button events */
    // see: https://stackoverflow.com/questions/50623279/js-event-handler-async-function
    ui.copyButton.addEventListener('click', async () => {
        const options = await getStoredOptions();
        copyTabsHandler(options.tabFormat, options.tabScope);
    });
};

document.addEventListener('DOMContentLoaded', init);
