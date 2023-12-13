import { debug, log, warn, i18n } from "./lib.js";
import CONSTANTS from "./constants.js";

export const registerSettings = function () {
  // game.settings.registerMenu(CONSTANTS.MODULE_ID, "resetAllSettings", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.reset.title`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.reset.hint`,
  //   icon: "fas fa-coins",
  //   type: ResetSettingsDialog,
  //   restricted: true,
  // });

  // =====================================================================

  game.settings.register(CONSTANTS.MODULE_ID, "alwaysontop", {
    name: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.alwaysontop.title`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.alwaysontop.hint`),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "timerSize", {
    name: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.timerSize.title`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_ID}.settings.timerSize.hint`),
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

  game.settings.register(CONSTANTS.MODULE_ID, "enableIntegrationWithFEP", {
    name: `${CONSTANTS.MODULE_ID}.settings.enableIntegrationWithFEP.title`,
    hint: `${CONSTANTS.MODULE_ID}.settings.enableIntegrationWithFEP.hint`,
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================================

  game.settings.register(CONSTANTS.MODULE_ID, "debug", {
    name: `${CONSTANTS.MODULE_ID}.settings.debug.title`,
    hint: `${CONSTANTS.MODULE_ID}.settings.debug.hint`,
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
  });
};

export const registerSettingsReady = function () {
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
};

class ResetSettingsDialog extends FormApplication {
  constructor(...args) {
    //@ts-ignore
    super(...args);
    //@ts-ignore
    return new Dialog({
      title: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.title`),
      content:
        '<p style="margin-bottom:1rem;">' +
        game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.content`) +
        "</p>",
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.confirm`),
          callback: async () => {
            const worldSettings = game.settings.storage
              ?.get("world")
              ?.filter((setting) => setting.key.startsWith(`${CONSTANTS.MODULE_ID}.`));
            for (let setting of worldSettings) {
              log(`Reset setting '${setting.key}'`);
              await setting.delete();
            }
            //window.location.reload();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.cancel`),
        },
      },
      default: "cancel",
    });
  }

  async _updateObject(event, formData = undefined) {
    // do nothing
  }
}
