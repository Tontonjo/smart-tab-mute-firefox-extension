# Smart Tab Mute Chrome Extension – ported to Firefox

## Tonton Jo  
### Join the community & Support my work   
[Click Here!](https://linktr.ee/tontonjo)  

## Thanks and informations about this fork
Special thanks to @Gregoux06 who helped me a lot in fixing this plugin.  
This is a Firefox port of https://github.com/neuling/smart-tab-mute-chrome-extension  
Forked from https://github.com/noniq/smart-tab-mute-chrome-extension  

## Known issues  
When 3 tabs are playing sound, the script loops between all of them  
 * In **Firefox 47** the options page is not available (needs Firefox 48 or newer), so it’s not possible to edit the whitelist or change the “Unmute last tab” setting.

## Testing the extension

Run the build process (see below), then open `about:debugging` in Firefox, click on “Load Temporary Add-on” and select any file inside the `build` directory (e.g. `manifest.json`). MDN has more info about [temporary installation in Firefox](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox).

---

*Original readme follows:*

---

## Development

### Install all dependencies

```shell
npm install
```

### Run the build process

run the build process once

```shell
grunt
```

or if you want to automatically reload the extension after every change.

```shell
grunt --reload-extension
```

Open [about:debugging](about:debugging#/setup), select this firfox and load a temporary add-on
