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
  registerSettingsReady();
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
