# monolithic-chrome-extension

> **NOTE**: this extension is not meant for the chrome webstore as it violates their [Extensions quality guidelines](https://developer.chrome.com/docs/extensions/mv3/single_purpose/), because this extension does not have a narrow focus area or purpose.

[OpenMultipleURLs](https://github.com/htrinter/Open-Multiple-URLs) dev environment was rather interesting. So, I've been slowly looking at their configs and replicating pieces of it here. I wonder how I could use docker here...

*There's also an excessive amount of semicolons between open and copy tabs. Oh yes, all our modules are also missing proper tests >.<*

When redoing [CopyCat](https://github.com/kiichi/QuickCopyTitleAndURL) - I want these schemes:
- Copy Markdown
- Copy URLs
- Copy Titles

With these options:
- Copy
- Copy all tabs
- Copy tabs to the right

*Although, we're not done yet. There's a few `chrome.*` api calls, that Ihaven't managed to replace with `browser` from `webextension-polyfill`. And, maybe a status indicator for how many tabs will be copied - like what open-tabs has.*

*Oh and I think we could also break up copy.ts into multiple files. For example, formatInput() should probably be it's own file. Especially when you consider that extract.ts is already it's own file and it's got less lines.*

---

I just want [Reload all Tabs Extension](https://github.com/mohamedmansour/reload-all-tabs-extension)'s `Reload all tabs in current window` and nothing else.

---

I wonder if I could easily integrate [Youtube NonStop](https://github.com/lawfx/YoutubeNonStop) into what I already have.

---

I want [enchanced-github](https://github.com/softvar/enhanced-github)'s ability to show each repo's size in the sidebar. Besides, I really hate how slow it can be and how it shows each files size...

*on second thought, this kind of complexity is making me start to change my mind*

---

```shell
docker-compose up
docker-compose up --force

# see: https://www.digitalocean.com/community/tutorials/how-to-use-docker-exec-to-run-commands-in-a-docker-container
docker exec -it mournfuly-extension sh
```

By the way, `node_modules` and `.parcel-cache` are meant to look empty because their contents are inside a docker volume.

Perhaps we should bulid something to track the files we referenced to create this extensions. So, that in the event of an update, we could in turn update our extensions as well :thonk: