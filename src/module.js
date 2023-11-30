import API from "./scripts/api.js";
import { ChoicesSocket, registerSocket } from "./scripts/socket.js";

Hooks.once("init", function () {
  game.settings.register("choices", "alwaysontop", {
    name: game.i18n.localize("choices.settings.alwaysontop.name"),
    hint: game.i18n.localize("choices.settings.alwaysontop.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register("choices", "timerSize", {
    name: game.i18n.localize("choices.settings.timerSize.name"),
    hint: game.i18n.localize("choices.settings.timerSize.hint"),
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 1,
      max: 10,
      step: 0.5,
    },
    default: 2,
  });
});

Hooks.once("setup", function () {
  // Set api
  const data = game.modules.get("choices");
  data.api = API;
});

Hooks.once("ready", function () {
  new window.Ardittristan.ColorSetting("choices", "textcolor", {
    name: game.i18n.localize("choices.settings.textcolor.name"),
    hint: game.i18n.localize("choices.settings.textcolor.hint"),
    label: game.i18n.localize("choices.settings.pickcolor.label"),
    restricted: true,
    defaultColor: "#000000eb",
    scope: "world",
  });

  new window.Ardittristan.ColorSetting("choices", "backgroundcolor", {
    name: game.i18n.localize("choices.settings.backgroundcolor.name"),
    hint: game.i18n.localize("choices.settings.backgroundcolor.hint"),
    label: game.i18n.localize("choices.settings.pickcolor.label"),
    restricted: true,
    defaultColor: "#000000ff",
    scope: "world",
  });

  new window.Ardittristan.ColorSetting("choices", "buttoncolor", {
    name: game.i18n.localize("choices.settings.buttoncolor.name"),
    hint: game.i18n.localize("choices.settings.buttoncolor.hint"),
    label: game.i18n.localize("choices.settings.pickcolor.label"),
    restricted: true,
    defaultColor: "#ffffffd8",
    scope: "world",
  });

  new window.Ardittristan.ColorSetting("choices", "buttonhovercolor", {
    name: game.i18n.localize("choices.settings.buttonhovercolor.name"),
    hint: game.i18n.localize("choices.settings.buttonhovercolor.hint"),
    label: game.i18n.localize("choices.settings.pickcolor.label"),
    restricted: true,
    defaultColor: "#c8c8c8d8",
    scope: "world",
  });

  new window.Ardittristan.ColorSetting("choices", "buttonactivecolor", {
    name: game.i18n.localize("choices.settings.buttonactivecolor.name"),
    hint: game.i18n.localize("choices.settings.buttonactivecolor.hint"),
    label: game.i18n.localize("choices.settings.pickcolor.label"),
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
