import API from "./scripts/api.js";
import CONSTANTS from "./scripts/constants.js";
import { ActorChoicesPlusMacroConfig } from "./scripts/lib/ActorChoicesPlusMacroConfig.js";
import Logger from "./scripts/lib/Logger.js";
import ChoicesPlusHelpers from "./scripts/lib/choices-plus-helpers.js";
import ChoicesPlusTokenHUD from "./scripts/lib/choices-plus-token-hud.js";
import { registerSettings, registerSettingsReady } from "./scripts/settings.js";
import { ChoicesSocket, registerSocket } from "./scripts/socket.js";

Hooks.once("init", function () {
    registerSettings();
});

Hooks.once("libWrapper.Ready", function () {
    // ACTOR
    // libWrapper.register(
    //     CONSTANTS.MODULE_ID,
    //     "Token.prototype._onClickLeft",
    //     ChoicesPlusHelpers._TokenPrototypeOnClickLeftTokenHandler,
    //     "MIXED",
    // );
    // libWrapper.register(
    //     CONSTANTS.MODULE_ID,
    //     "Token.prototype._onClickLeft2",
    //     ChoicesPlusHelpers._TokenPrototypeOnClickLeftTokenHandler,
    //     "MIXED",
    // );

    // libWrapper.register(
    //     CONSTANTS.MODULE_ID,
    //     "Token.prototype._onClickRight2",
    //     ChoicesPlusHelpers._TokenPrototypeOnClickRight2TokenHandlerOverride,
    //     "OVERRIDE"
    // );

    libWrapper.register(
        CONSTANTS.MODULE_ID,
        "Token.prototype._onClickRight2",
        ChoicesPlusHelpers._TokenPrototypeOnClickRight2TokenHandler,
        "MIXED",
    );

    // NOTE
    // libWrapper.register(
    //     CONSTANTS.MODULE_ID,
    //     "Note.prototype._onClickLeft",
    //     ChoicesPlusHelpers._NotePrototypeOnClickLeftHandler,
    //     "MIXED",
    // );
    // libWrapper.register(
    //     CONSTANTS.MODULE_ID,
    //     "Note.prototype._onClickLeft2",
    //     ChoicesPlusHelpers._NotePrototypeOnClickLeftHandler,
    //     "MIXED",
    // );
});

Hooks.once("setup", function () {
    game.modules.get(CONSTANTS.MODULE_ID).api = API;
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

    if (game.user.isGM) {
        // Do anything once the module is ready
        if (!game.modules.get("lib-wrapper")?.active && game.user?.isGM) {
            let word = "install and activate";
            if (game.modules.get("lib-wrapper")) word = "activate";
            throw Logger.error(`Requires the 'libWrapper' module. Please ${word} it.`);
        }
        if (!game.modules.get("socketlib")?.active && game.user?.isGM) {
            let word = "install and activate";
            if (game.modules.get("socketlib")) word = "activate";
            throw Logger.error(`Requires the 'socketlib' module. Please ${word} it.`);
        }
    }

    ChoicesPlusHelpers.registerActor();
});

// Hooks.on("chatMessage", (ChatLog, content) => {
//     if (content.toLowerCase().startsWith("/choice")) {
//         const data = content.replace("/choice", "");
//         ChoicesSocket.executeForEveryone("showChoices", data);
//         return false;
//     }
// });

Hooks.once("socketlib.ready", () => {
    registerSocket();
});

Hooks.on("renderActorSheet", (app, html, data) => {
    ActorChoicesPlusMacroConfig._init(app, html, data);
});

Hooks.on("renderTokenHUD", (hud, html, token) => {
    ChoicesPlusTokenHUD.prepTokenHUD(hud, html, token);
});
