export interface UIDef {
  txtArea: HTMLTextAreaElement;
  openButton: HTMLInputElement;
  extractButton: HTMLInputElement;
  tabCount: HTMLSpanElement;
  tabCountNumber: HTMLSpanElement;
  tabCountTabLabel: HTMLSpanElement;
  copyForm: HTMLFormElement;
  copyButton: HTMLInputElement;
  reloadButton: HTMLInputElement;
}

export function getUIDef(): UIDef {
  return {
    txtArea: document.getElementById('urls') as HTMLTextAreaElement,
    openButton: document.getElementById('open') as HTMLInputElement,
    extractButton: document.getElementById('extract') as HTMLInputElement,
    tabCount: document.getElementById('tabcount') as HTMLSpanElement,
    tabCountNumber: document.getElementById('tabcount-number') as HTMLSpanElement,
    tabCountTabLabel: document.getElementById('tabcount-tab-label') as HTMLSpanElement,
    copyForm: document.getElementById('copyForm') as HTMLFormElement,
    copyButton: document.getElementById('copy') as HTMLInputElement,
    reloadButton: document.getElementById('reload') as HTMLInputElement,
  };
}

