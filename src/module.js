import API from "./scripts/api.js";
import CONSTANTS from "./scripts/constants.js";
import { registerSettings } from "./scripts/settings.js";
import { ChoicesSocket, registerSocket } from "./scripts/socket.js";

Hooks.once("init", function () {
  registerSettings();
});

Hooks.once("setup", function () {
  // Set api
  const data = game.modules.get(CONSTANTS.MODULE_ID);
  data.api = API;
});

Hooks.once("ready", function () {
  new window.Ardittristan.ColorSetting(CONSTANTS.MODULE_ID, "textcolor", {
    name: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.textcolor.title`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.textcolor.hint`),
    label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.pickcolor.label`),
    restricted: true,
    defaultColor: "#000000eb",
    scope: "world",
  });

  new window.Ardittristan.ColorSetting(CONSTANTS.MODULE_ID, "backgroundcolor", {
    name: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.backgroundcolor.title`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.backgroundcolor.hint`),
    label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.pickcolor.label`),
    restricted: true,
    defaultColor: "#000000ff",
    scope: "world",
  });

  new window.Ardittristan.ColorSetting(CONSTANTS.MODULE_ID, "buttoncolor", {
    name: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.buttoncolor.title`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.buttoncolor.hint`),
    label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.pickcolor.label`),
    restricted: true,
    defaultColor: "#ffffffd8",
    scope: "world",
  });

  new window.Ardittristan.ColorSetting(CONSTANTS.MODULE_ID, "buttonhovercolor", {
    name: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.buttonhovercolor.title`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.buttonhovercolor.hint`),
    label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.pickcolor.label`),
    restricted: true,
    defaultColor: "#c8c8c8d8",
    scope: "world",
  });

  new window.Ardittristan.ColorSetting(CONSTANTS.MODULE_ID, "buttonactivecolor", {
    name: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.buttonactivecolor.title`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.buttonactivecolor.hint`),
    label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.pickcolor.label`),
    restricted: true,
    defaultColor: "#838383d8",
    scope: "world",
  });
});

Hooks.on("chatMessage", (ChatLog, content) => {
  //debugger;
  if (content.toLowerCase().startsWith("/choice")) {
    const data = content.replace("/choice", "");
    ChoicesSocket.executeForEveryone("showChoices", data);
    return false;
  }
});

Hooks.once("socketlib.ready", () => {
  registerSocket();
});
