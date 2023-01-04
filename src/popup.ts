import { extractURLs } from './utils/extract';
import { loadSites, URL_LINE_SPLIT_REGEX } from './utils/load';
import { getStoredOptions, StorageKey, storeValue } from './utils/storage';
import { getUIDef, UIDef } from './utils/ui';
import { debounce } from 'ts-debounce';

export { };

/**
 * see: https://github.com/htrinter/Open-Multiple-URLs
 * perms: storage
 */

const saveUrlList = async (ui: UIDef): Promise<void> => {
  if (ui.txtArea) {
    // ^ will evaluate to true if value is not: 
    //  null, undefined, NaN, empty string (""), 0, false,  
    await storeValue<string>(StorageKey.urlList, ui.txtArea.value);
  }
};
const debouncedSaveUrlList = debounce(
  saveUrlList,
  SAVE_URL_LIST_DEBOUNCE_TIME_MS
);

export const init = async (): Promise<void> => {
  const ui = getUIDef();

  /* restore options */
  const options = await getStoredOptions();
  ui.txtArea.value = options.txt;

  /* add text input events */
  ui.txtArea.addEventListener('input', () => {
    debouncedSaveUrlList(ui);
    debouncedUpdateTabCount(ui);
  });

  /* add button events */
  ui.openButton.addEventListener('click', () => {
    saveUrlList(ui);
    loadSites(ui.txtArea.value);
  });

  ui.extractButton.addEventListener('click', () => {
    ui.txtArea.value = extractURLs(ui.txtArea.value);
    saveUrlList(ui);
    updateTabCount(ui);
  });

  /* update tabcount */
  updateTabCount(ui);

  /* select text in form field */
  ui.txtArea.select();
};

document.addEventListener('DOMContentLoaded', init);
