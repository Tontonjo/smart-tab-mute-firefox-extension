# Smart Tab Mute +

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
Not much an issue, but script only remember 1 latest playing tab, it's not "recursive"

## Possible feature suggestions and future improvements:
- When a new window start playing when a whitelisted tab is already making sound, we should prevent the new tab from playing until the other tab stops.

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
