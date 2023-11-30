import API from "./scripts/api.js";
import CONSTANTS from "./scripts/constants.js";
import { registerSettings, registerSettingsReady } from "./scripts/settings.js";
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
  if (game.modules.get("compendium-themer")?.active) {
    game.modules.get("compendium-themer").api.addModule(CONSTANTS.MODULE_ID, [
      {
        dataPack: `${CONSTANTS.MODULE_ID}.choices-plus-macros`,
        colorText: `#800000`,
        iconText: ``,
        bannerImage: `modules/${CONSTANTS.MODULE_ID}/assets/images/cover-compendium.webp`,
        backgroundColorText: `#9999FF`,
        fontFamilyText: `'Comic Sans MS', 'Comic Sans', cursive`,
      },
    ]);
  }
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
