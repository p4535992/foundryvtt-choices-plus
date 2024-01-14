import CONSTANTS from "../constants.js";
import { RetrieveHelpers } from "./retrieve-helpers.js";

// ================================
// Logger utility
// ================================

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, ...args) {
  try {
    if (
      game.settings.get(CONSTANTS.MODULE_ID, "debug") ||
      game.modules.get("_dev-mode")?.api?.getPackageDebugValue(CONSTANTS.MODULE_ID, "boolean")
    ) {
      console.log(`DEBUG | ${CONSTANTS.MODULE_ID} | ${msg}`, ...args);
    }
  } catch (e) {
    console.error(e.message);
  }
  return msg;
}

export function log(message, ...args) {
  try {
    message = `${CONSTANTS.MODULE_ID} | ${message}`;
    console.log(message.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return message;
}

export function notify(message, ...args) {
  try {
    message = `${CONSTANTS.MODULE_ID} | ${message}`;
    ui.notifications?.notify(message);
    console.log(message.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return message;
}

export function info(info, notify = false, ...args) {
  try {
    info = `${CONSTANTS.MODULE_ID} | ${info}`;
    if (notify) {
      ui.notifications?.info(info);
    }
    console.log(info.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return info;
}

export function warn(warning, notify = false, ...args) {
  try {
    warning = `${CONSTANTS.MODULE_ID} | ${warning}`;
    if (notify) {
      ui.notifications?.warn(warning);
    }
    console.warn(warning.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return warning;
}

export function error(error, notify = true, ...args) {
  try {
    error = `${CONSTANTS.MODULE_ID} | ${error}`;
    if (notify) {
      ui.notifications?.error(error);
    }
    console.error(error.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return new Error(error.replace("<br>", "\n"));
}

export function timelog(message) {
  warn(Date.now(), message);
}

export const i18n = (key) => {
  return game.i18n.localize(key)?.trim();
};

export const i18nFormat = (key, data = {}) => {
  return game.i18n.format(key, data)?.trim();
};

// export const setDebugLevel = (debugText): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };

export function dialogWarning(message, icon = "fas fa-exclamation-triangle") {
  return `<p class="${CONSTANTS.MODULE_ID}-dialog">
          <i style="font-size:3rem;" class="${icon}"></i><br><br>
          <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_ID}</strong>
          <br><br>${message}
      </p>`;
}

// ================================
// Retrieve document utility
// ================================

export function getDocument(target) {
  return RetrieveHelpers.getDocument(target);
}

export function stringIsUuid(inId) {
  return RetrieveHelpers.stringIsUuid(inId);
}

export function getUuid(target) {
  return RetrieveHelpers.getUuid(target);
}

export function getCompendiumCollectionSync(target, ignoreError = false, ignoreName = true) {
  return RetrieveHelpers.getCompendiumCollectionSync(target, ignoreError, ignoreName);
}

export async function getCompendiumCollectionAsync(target, ignoreError = false, ignoreName = true) {
  return await RetrieveHelpers.getCompendiumCollectionAsync(target, ignoreError, ignoreName);
}

export function getUserSync(target, ignoreError = false, ignoreName = true) {
  return RetrieveHelpers.getUserSync(target, ignoreError, ignoreName);
}

export function getActorSync(target, ignoreError = false, ignoreName = true) {
  return RetrieveHelpers.getActorSync(target, ignoreError, ignoreName);
}

export async function getActorAsync(target, ignoreError = false, ignoreName = true) {
  return await RetrieveHelpers.getActorAsync(target, ignoreError, ignoreName);
}

export function getJournalSync(target, ignoreError = false, ignoreName = true) {
  return RetrieveHelpers.getJournalSync(target, ignoreError, ignoreName);
}

export async function getJournalAsync(target, ignoreError = false, ignoreName = true) {
  return await RetrieveHelpers.getJournalAsync(target, ignoreError, ignoreName);
}

export function getMacroSync(target, ignoreError = false, ignoreName = true) {
  return RetrieveHelpers.getMacroSync(target, ignoreError, ignoreName);
}

export async function getMacroAsync(target, ignoreError = false, ignoreName = true) {
  return await RetrieveHelpers.getMacroAsync(target, ignoreError, ignoreName);
}

export function getSceneSync(target, ignoreError = false, ignoreName = true) {
  return RetrieveHelpers.getSceneSync(target, ignoreError, ignoreName);
}

export async function getSceneAsync(target, ignoreError = false, ignoreName = true) {
  return await RetrieveHelpers.getSceneAsync(target, ignoreError, ignoreName);
}

export function getItemSync(target, ignoreError = false, ignoreName = true) {
  return RetrieveHelpers.getItemSync(target, ignoreError, ignoreName);
}

export async function getItemAsync(target, ignoreError = false, ignoreName = true) {
  return await RetrieveHelpers.getItemAsync(target, ignoreError, ignoreName);
}

export function getPlaylistSoundPathSync(target, ignoreError = false, ignoreName = true) {
  return RetrieveHelpers.getPlaylistSoundPathSync(target, ignoreError, ignoreName);
}

export async function getPlaylistSoundPathAsync(target, ignoreError = false, ignoreName = true) {
  return await RetrieveHelpers.getPlaylistSoundPathAsync(target, ignoreError, ignoreName);
}

/* ========================================== */

export async function runMacro(macroReference, ...macroData) {
  let macroFounded = await getMacroAsync(macroReference, false, true);
  if (!macroFounded) {
    throw error(`Could not find macro with reference "${macroReference}"`, true);
  }
  // Credit to Otigon, Zhell, Gazkhan and MrVauxs for the code in this section
  /*
    let macroId = macro.id;
    if (macroId.startsWith("Compendium")) {
      let packArray = macroId.split(".");
      let compendium = game.packs.get(`${packArray[1]}.${packArray[2]}`);
      if (!compendium) {
        throw error(`Compendium ${packArray[1]}.${packArray[2]} was not found`, true);
      }
      let findMacro = (await compendium.getDocuments()).find(m => m.name === packArray[3] || m.id === packArray[3])
      if (!findMacro) {
        throw error(`The "${packArray[3]}" macro was not found in Compendium ${packArray[1]}.${packArray[2]}`, true);
      }
      macro = new Macro(findMacro?.toObject());
      macro.ownership.default = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;
    } else {
      macro = game.macros.getName(macroId);
      if (!macro) {
        throw error(`Could not find macro with name "${macroId}"`, true);
      }
    }
    */
  let result = false;
  try {
    let args = {};
    if (typeof macroData !== "object") {
      // for (let i = 0; i < macroData.length; i++) {
      //   args[String(macroData[i]).trim()] = macroData[i].trim();
      // }
      args = parseAsArray(macroData);
    } else {
      args = macroData;
    }

    // Little trick to bypass permissions and avoid a socket to run as GM
    let macroTmp = new Macro(macroFounded.toObject());
    macroTmp.ownership.default = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;
    if (macroTmp.type === "chat") {
      result = await macroTmp.execute(args);
    } else if (macroTmp.type === "script") {
      //add variable to the evaluation of the script
      const macro = macroTmp;
      const actor = getUserCharacter();
      const speaker = ChatMessage.getSpeaker({ actor: actor });
      const token = canvas.tokens.get(actor.token);
      const character = game.user.character;
      const event = getEvent();

      debug("runMacro | ", { macro, speaker, actor, token, character, event, args });

      //build script execution
      let body = ``;
      if (macro.command.trim().startsWith(`(async ()`)) {
        body = macro.command;
      } else {
        body = `(async ()=>{
            ${macro.command}
          })();`;
      }
      const fn = Function("speaker", "actor", "token", "character", "event", "args", body);

      debug("runMacro | ", { body, fn });

      //attempt script execution
      try {
        fn.call(macro, speaker, actor, token, character, event, args);
      } catch (err) {
        error(`error macro Execution`, true, err);
      }

      function getEvent() {
        let a = args[0];
        if (a instanceof Event) {
          return args[0].shift();
        }
        if (a?.originalEvent instanceof Event) {
          return args.shift().originalEvent;
        }
        return undefined;
      }
    } else {
      warn(`Something is wrong a macro can be only a 'char' or a 'script'`, true);
    }
  } catch (err) {
    throw error(`Error when executing macro ${macroReference}!`, true, macroDataArr, err);
  }

  return result;
}

export function getOwnedCharacters(user = false) {
  user = user || game.user;
  return game.actors
    .filter((actor) => {
      return actor.ownership?.[user.id] === CONST.DOCUMENT_PERMISSION_LEVELS.OWNER && actor.prototypeToken.actorLink;
    })
    .sort((a, b) => {
      return b._stats.modifiedTime - a._stats.modifiedTime;
    });
}

export function getUserCharacter(user = false) {
  user = user || game.user;
  return user.character || (user.isGM ? false : getOwnedCharacters(user)?.[0] ?? false);
}

export function isValidImage(pathToImage) {
  const pathToImageS = String(pathToImage);
  if (pathToImageS.match(CONSTANTS.imageReg) || pathToImageS.match(CONSTANTS.imageRegBase64)) {
    return true;
  }
  return false;
}

export function isRealNumber(inNumber) {
  return !isNaN(inNumber) && typeof inNumber === "number" && isFinite(inNumber);
}

export function isRealBoolean(inBoolean) {
  return String(inBoolean) === "true" || String(inBoolean) === "false";
}

export function parseAsArray(obj) {
  if (!obj) {
    return [];
  }
  let arr = [];
  if (typeof obj === "string" || obj instanceof String) {
    arr = obj.split(",");
  } else if (obj.constructor === Array) {
    arr = obj;
  } else {
    arr = [obj];
  }
  return arr;
}
