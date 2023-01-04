import browser from 'webextension-polyfill';
import ClipboardJS from 'clipboard';

// see: https://stackoverflow.com/questions/63526969/how-do-you-return-multiple-values-from-a-typescript-function
export async function setupOptions(dataFormat: string, dataAction: string) {
	// Query only tabs that are in the current window aka the window that contains the code that is currently executing.
	let options = { currentWindow: true };

	// If true, query only the active tabs in their windows.
	if (dataAction == 'single') {
		options['active'] = true;
	}

	let tabStart = 0;
	if (dataAction == 'rightward') {
		const currentTab = await getCurrentTab();
		// see: https://developer.chrome.com/docs/extensions/reference/tabs/#type-Tab
		tabStart = currentTab.index
	}

	// see: https://www.w3schools.com/js/tryit.asp?filename=tryjs_object_object
	formatInput(dataFormat, options, tabStart);
}

/**
 * Copy urls/titles from tabs in current window
 * @param dataFormat - type of data format to copy e.g. "md", "title", or "url"
 * @param dataAction - action when it copies: "current", "all", or "all to the right"
 */
function formatInput(dataFormat: string, options, tabStart) {
	let output = '';
	chrome.tabs.query(options, (tabs) => {
		for (let i = tabStart; i < tabs.length; i++) {

			let buffer = 'ERROR - buffer was never overwritten by tabTitle or tabUrl';
			let tabTitle = tabs[i].title;
			let tabUrl = tabs[i].url;

			// remove leading "notification counts" that websites have started to add
			// see: https://www.youtube.com/watch?v=bV0QNuhN9fU&t=64s
			let matches = tabTitle.match(/^(\([0-9]+\) )?(.*)$/);
			if (matches) {
				tabTitle = matches[2];
			}

			// format each url depending on the requested data format
			if (dataFormat == 'markdown') {
				let prefix = '';
				if (isImage(tabUrl)) {
					prefix = '!';
				}
				buffer = prefix + '[' + tabTitle + '](' + tabUrl + ')';
			}
			else if (dataFormat == 'url') {
				buffer = tabUrl;
			}
			else if (dataFormat == 'title') {
				buffer = tabTitle;
			}

			// append working buffer to output, and if there's more than one line left start a new line
			output += buffer;
			if (tabs.length > 1) {
				output += '\n';
			}
		}
		
		return output
	});
}

function isImage(url) {
	return (url.indexOf('.jpg') > -1 || url.indexOf('.png') > -1);
}

// see: https://github.com/zenorocha/clipboard.js/blob/master/demo/target-programmatic-copy.html
function copyToClipboard(input: string) {
	const textCopied = ClipboardJS.copy(input);
	//! console.log('copied!\n' + textCopied);
}

// see: https://developer.chrome.com/docs/extensions/reference/tabs/#get-the-current-tab
async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}