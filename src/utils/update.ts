import { debounce } from 'ts-debounce';

export const SAVE_URL_LIST_DEBOUNCE_TIME_MS = 100;
export const UPDATE_TAB_COUNT_DEBOUNCE_TIME_MS = 50;

const updateTabCount = (ui: UIDef) => {
    let tabCount = '0';
    if (ui.txtArea.value) {
      const lines = ui.txtArea.value.split(URL_LINE_SPLIT_REGEX);
      if (lines.length <= 5000) {
        /* limit for performance reasons */
        tabCount = String(lines.filter((line) => line.trim() !== '').length);
      } else {
        tabCount = '> 5000';
      }
    }
  
    ui.tabCountNumber.textContent = tabCount;
    ui.tabCountTabLabel.textContent = tabCount === '1' ? 'tab' : 'tabs';
    ui.tabCount.style.visibility = tabCount === '0' ? 'visible' : 'visible';
  };

export const debouncedUpdateTabCount = debounce(
    updateTabCount,
    UPDATE_TAB_COUNT_DEBOUNCE_TIME_MS
);