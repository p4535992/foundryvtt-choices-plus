# Choices Plus

![Latest Release Download Count](https://img.shields.io/github/downloads/p4535992/foundryvtt-choices-plus/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge)

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fchoices-plus&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=choices-plus)

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-choices-plus%2Fmaster%2Fsrc%2Fmodule.json&label=Foundry%20Version&query=$.compatibility.verified&colorB=orange&style=for-the-badge)

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-choices-plus%2Fmaster%2Fsrc%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fchoices-plus%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/choices-plus/)

![GitHub all releases](https://img.shields.io/github/downloads/p4535992/foundryvtt-choices-plus/total?style=for-the-badge)

[![Translation status](https://weblate.foundryvtt-hub.com/widgets/choices-plus/-/287x66-black.png)](https://weblate.foundryvtt-hub.com/engage/choices-plus/)

Module for creating small scenes with multiple choices novel game style, with a powerful [api](./wiki/api.md) you can create a chain of choice for your players.

**Note: This is module is inspired from the  wonderful work done by [theRipper93](https://theripper93.com/) with its [automated-evocations](https://github.com/theripper93/choices) module.
If you want to support more modules of this kind, I invite you to go and support his patreon**

[![alt-text](https://img.shields.io/badge/-Patreon-%23ff424d?style=for-the-badge)](https://www.patreon.com/theripper93) [![alt-text](https://img.shields.io/badge/-Discord-%235662f6?style=for-the-badge)](https://discord.gg/F53gBjR97G)

![](./wiki/videos/video_example_1.gif)

![](./wiki/videos/video_example_2.gif)

## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/p4535992/foundryvtt-choices-plus/master/src/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

### libWrapper

This module uses the [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

### socketLib

This module uses the [socketLib](https://github.com/manuelVo/foundryvtt-socketlib) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

### Color Settings

This module uses the [colorsettings](https://github.com/ardittristan/VTTColorSettings) library for add a color picker. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.


## Api

All informations about the api can be found here [API](./wiki/api.md)

##### [API Chat](./wiki/api_chat.txt) (Deprecated remain for retro compatibility)

##### [API Chat Japaness](./wiki/api_chat_ja.txt) (Deprecated remain for retro compatibility)

# Build

## Install all packages

```bash
npm install
```

### dev

`dev` will let you develop you own code with hot reloading on the browser

```bash
npm run dev
```

## npm build scripts

### build

`build` will build and set up a symlink between `dist` and your `dataPath`.

```bash
npm run build
```

### build-watch

`build-watch` will build and watch for changes, rebuilding automatically.

```bash
npm run build-watch
```

### prettier-format

`prettier-format` launch the prettier plugin based on the configuration [here](./.prettierrc)

```bash
npm run-script prettier-format
```

## [Changelog](./CHANGELOG.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/foundryvtt-choices-plus/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

- **[choices](https://github.com/theripper93/choices)** : [MIT](https://github.com/theripper93/choices/blob/master/LICENSE)


This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

## Credit

A special ty to the original authors [theRipper93](https://theripper93.com/), for the idea , the inspiration and the initial template.

- [theRipper93](https://theripper93.com/) and the module [choices](https://github.com/theripper93/choices)
