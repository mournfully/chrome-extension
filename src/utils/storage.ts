import browser from 'webextension-polyfill';

export enum StorageKey {
  urlList = 'txt',
  tabFormat = 'tabFormat',
  tabScope = 'tabScope',
}

export interface StoredOptions {
  [StorageKey.urlList]: string;
  [StorageKey.tabFormat]: string;
  [StorageKey.tabScope]: string;
}

export async function getStoredOptions(): Promise<StoredOptions> {
  const txtVal = await browser.storage.local.get(StorageKey.urlList);
  const tabFormatVal = await browser.storage.local.get(StorageKey.tabFormat);
  const tabScopeVal = await browser.storage.local.get(StorageKey.tabScope);

  return {
    txt: txtVal?.txt || '',
    tabFormat: tabFormatVal?.tabFormat || '',    
    tabScope: tabScopeVal?.tabScope || '',    
  };
}

export async function storeValue<T>(key: StorageKey, value: T): Promise<void> {
  await browser.storage.local.set({ [key]: value });
}
