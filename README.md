# Smart Tab Mute 2023

## Tonton Jo  
### Join the community & Support my work   
[Click Here!](https://linktr.ee/tontonjo)  

## Thanks and informations about this fork
Special thanks to @Gregoux06 who helped me a lot in fixing this plugin.  
This is a Firefox port of https://github.com/neuling/smart-tab-mute-chrome-extension  
Forked from https://github.com/noniq/smart-tab-mute-chrome-extension  

## Download from Firefox!  
[Click Here!](https://addons.mozilla.org/en-US/firefox/addon/smart-tab-mute-2023)  

## Known issues  
Version 2 introduced a bug when closing a tab, a wrong tab may get unmuted
Not much an issue, but script can only remember 1 latest playing tab, it's not "recursive"
Script is not "fast" due to the delay implied by a tab when it stops making noise and background triggers.

## Possible feature suggestions and future improvements:
- Unmute a tab when selected  

## Changelog:  
### V 2.0.1  
- set the latest audible tab at the right moment

### V 2.0.0  
- Added support for a whitelist: thoses tabs will never get muted
- ignore list now working as expected

### V 1.2.0  
- Tidy the code a bit from non-necessary parts
- Plugin now only triggered when the tab has sound (playing or not)
- Small enhancements to prevente non-necessary processings
### V 1.1.0  
- - When 3 tabs are playing sound, the script loops between all of them
- - Closing a tab correctly triggers the unmute

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
