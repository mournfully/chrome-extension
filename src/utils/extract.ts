export {};

/**
 * Extract URLs from text
 * @param text Text
 */

export function extractURLs(text: string): string {
  let urls = '';
  let urlmatcharr;
  const urlregex =
    /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()[\]{};:'".,<>?«»“”‘’]))/gi;

  // see: https://bobbyhadz.com/blog/javascript-remove-characters-not-match-regex
  let replacedText: string = text.replace(/chrome-extension:.*suspended.html#ttl=.*uri=/g, '');

  while ((urlmatcharr = urlregex.exec(replacedText)) !== null) {
    const match = urlmatcharr[0];
    urls += match + '\n';
  }

  return urls;
}
