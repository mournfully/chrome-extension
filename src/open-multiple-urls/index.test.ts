import {
  init,
  SAVE_URL_LIST_DEBOUNCE_TIME_MS,
  UPDATE_TAB_COUNT_DEBOUNCE_TIME_MS,
} from '.';
import { extractURLs } from './extract';
import { loadSites } from './load';
import { getUIDef } from './ui';
import * as fs from 'fs';

const BODY_HTML = fs.readFileSync('./src/popup.html', 'utf-8');

let mockStore = {};
jest.mock('./load', () => ({
  ...jest.requireActual('./load'),
  loadSites: jest.fn(),
}));
jest.mock('./extract');
jest.mock('webextension-polyfill', () => ({
  tabs: { create: jest.fn() },
  runtime: { getURL: (val: string) => val },
  storage: {
    local: {
      get: (key: string) => {
        return { [key]: mockStore[key] };
      },
      set: (val: any) => (mockStore = { ...mockStore, ...val }), /* eslint-disable-line @typescript-eslint/no-explicit-any */
    },
  },
}));

const sleep = async (timeInMs: number) => {
  await new Promise((r) => setTimeout(r, timeInMs));
};

describe('test browser action', () => {
  beforeEach(async () => {
    mockStore = {};
    document.body.innerHTML = BODY_HTML;
  });

  test('init and render elements', async () => {
    await init();

    const uiDef = getUIDef();
    expect(uiDef.txtArea).toBeTruthy();
    expect(uiDef.openButton).toBeTruthy();
    expect(uiDef.extractButton).toBeTruthy();
  });

  test('set default options', async () => {
    await init();

    const uiDef = getUIDef();
    expect(uiDef.txtArea.value).toBe('');
  });

  test('restore options', async () => {
    await init();

    let uiDef = getUIDef();
    uiDef.txtArea.value = 'foobar';
    uiDef.txtArea.dispatchEvent(new Event('input'));
    
    uiDef = getUIDef();
    expect(uiDef.txtArea.value).toBe('foobar');

    document.body.innerHTML = BODY_HTML;

    uiDef = getUIDef();
    expect(uiDef.txtArea.value).toBe('');

    await init();

    uiDef = getUIDef();
    expect(uiDef.txtArea.value).toBe('foobar');
  });

  test('call open on button click', async () => {
    await init();

    const uiDef = getUIDef();
    uiDef.openButton.click();

    expect(loadSites).toHaveBeenCalled();
  });

  test('call extract on button click', async () => {
    await init();

    const uiDef = getUIDef();
    uiDef.extractButton.click();

    expect(extractURLs).toHaveBeenCalled();
  });

  test('display tab count', async () => {
    const uiDef = getUIDef();
    const hasNoTabCount = () => {
      return uiDef.tabCount.style.visibility === 'hidden';
    };
    const hasTabCount = (tabNo: string) => {
      return (
        uiDef.tabCount.style.visibility === 'visible' &&
        uiDef.tabCount.textContent
          .replace(/\s+/g, ' ')
          .indexOf(
            `will open ${tabNo} new ${tabNo === '1' ? 'tab' : 'tabs'}`
          ) !== -1
      );
    };

    await init();

    expect(hasNoTabCount()).toBeTruthy();

    uiDef.txtArea.value = 'https://test.de';
    uiDef.txtArea.dispatchEvent(new Event('input'));
    expect(hasNoTabCount()).toBeTruthy();
    await sleep(UPDATE_TAB_COUNT_DEBOUNCE_TIME_MS);
    expect(hasTabCount('1')).toBeTruthy();

    uiDef.txtArea.value = 'https://test.de\nhttps://spiegel.de';
    uiDef.txtArea.dispatchEvent(new Event('input'));
    expect(hasTabCount('1')).toBeTruthy();
    await sleep(UPDATE_TAB_COUNT_DEBOUNCE_TIME_MS);
    expect(hasTabCount('2')).toBeTruthy();

    uiDef.txtArea.value =
      'https://test.de\n\nhttps://spiegel.de\n    \nhttps://zeit.de\n\n   \n ';
    uiDef.txtArea.dispatchEvent(new Event('input'));
    expect(hasTabCount('2')).toBeTruthy();
    await sleep(UPDATE_TAB_COUNT_DEBOUNCE_TIME_MS);
    expect(hasTabCount('3')).toBeTruthy();

    uiDef.txtArea.value = 'https://test.de\n'.repeat(5001);
    uiDef.txtArea.dispatchEvent(new Event('input'));
    expect(hasTabCount('3')).toBeTruthy();
    await sleep(UPDATE_TAB_COUNT_DEBOUNCE_TIME_MS);
    expect(hasTabCount('> 5000')).toBeTruthy();
  });
});
