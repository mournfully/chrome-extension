import browser from 'webextension-polyfill';

export const URL_LINE_SPLIT_REGEX = /\r\n?|\n/g;

/**
 * Loads sites in new background tabs
 * @param text Text containing one URL per line
 */

export function loadSites(text: string): void {
  const urlschemes = ['http', 'https', 'file', 'view-source'];
  let urls = text.split(URL_LINE_SPLIT_REGEX);

  for (let i = 0; i < urls.length; i++) {
    let theurl = urls[i].trim();
    if (theurl !== '') {
      if (urlschemes.indexOf(theurl.split(':')[0]) === -1) {
        theurl = 'http://' + theurl;
      }
      browser.tabs.create({
        url: theurl,
        active: false,
      });
    }
  }
}
