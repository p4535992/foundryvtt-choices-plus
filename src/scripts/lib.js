import CONSTANTS from "./constants.js";

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
  if (stringIsUuid(target)) {
    target = fromUuidSync(target);
  }
  return target?.document ?? target;
}

export function stringIsUuid(inId) {
  return typeof inId === "string" && (inId.match(/\./g) || []).length && !inId.endsWith(".");
}

export function getUuid(target) {
  if (stringIsUuid(target)) {
    return target;
  }
  const document = getDocument(target);
  return document?.uuid ?? false;
}

export function getCompendiumCollectionSync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`CompendiumCollection is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof CompendiumCollection) {
    return targetTmp;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof CompendiumCollection) {
    return targetTmp;
  }
  // if (stringIsUuid(targetTmp)) {
  //   targetTmp = fromUuid(targetTmp);
  // } else {
  targetTmp = game.packs.get(targetTmp);
  if (!targetTmp && !ignoreName) {
    targetTmp = game.packs.getName(targetTmp);
  }
  // }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`CompendiumCollection is not found`, false, targetTmp);
      return;
    } else {
      throw error(`CompendiumCollection is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof CompendiumCollection)) {
    if (ignoreError) {
      warn(`Invalid CompendiumCollection`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid CompendiumCollection`, true, targetTmp);
    }
  }
  return targetTmp;
}

export async function getCompendiumCollectionAsync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`CompendiumCollection is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof CompendiumCollection) {
    return targetTmp;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof CompendiumCollection) {
    return targetTmp;
  }
  if (stringIsUuid(targetTmp)) {
    targetTmp = await fromUuid(targetTmp);
  } else {
    targetTmp = game.packs.get(targetTmp);
    if (!targetTmp && !ignoreName) {
      targetTmp = game.packs.getName(targetTmp);
    }
  }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`CompendiumCollection is not found`, false, targetTmp);
      return;
    } else {
      throw error(`CompendiumCollection is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof CompendiumCollection)) {
    if (ignoreError) {
      warn(`Invalid CompendiumCollection`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid CompendiumCollection`, true, targetTmp);
    }
  }
  return targetTmp;
}

export function getUserSync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`User is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof User) {
    return targetTmp;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof User) {
    return targetTmp;
  }
  if (stringIsUuid(targetTmp)) {
    targetTmp = fromUuidSync(targetTmp);
  } else {
    targetTmp = game.users.get(targetTmp);
    if (!targetTmp && !ignoreName) {
      targetTmp = game.users.getName(targetTmp);
    }
  }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`User is not found`, false, targetTmp);
      return;
    } else {
      throw error(`User is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof User)) {
    if (ignoreError) {
      warn(`Invalid User`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid User`, true, targetTmp);
    }
  }
  return targetTmp;
}

export function getActorSync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`Actor is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof Actor) {
    return targetTmp;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof Actor) {
    return targetTmp;
  }
  if (stringIsUuid(targetTmp)) {
    targetTmp = fromUuidSync(targetTmp);
  } else {
    targetTmp = game.actors.get(targetTmp);
    if (!targetTmp && !ignoreName) {
      targetTmp = game.actors.getName(targetTmp);
    }
  }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`Actor is not found`, false, targetTmp);
      return;
    } else {
      throw error(`Actor is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof Actor)) {
    if (ignoreError) {
      warn(`Invalid Actor`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid Actor`, true, targetTmp);
    }
  }
  return targetTmp;
}

export async function getActorAsync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`Actor is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof Actor) {
    return targetTmp;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof Actor) {
    return targetTmp;
  }
  if (stringIsUuid(targetTmp)) {
    targetTmp = await fromUuid(targetTmp);
  } else {
    targetTmp = game.actors.get(targetTmp);
    if (!targetTmp && !ignoreName) {
      targetTmp = game.actors.getName(targetTmp);
    }
  }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`Actor is not found`, false, targetTmp);
      return;
    } else {
      throw error(`Actor is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof Actor)) {
    if (ignoreError) {
      warn(`Invalid Actor`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid Actor`, true, targetTmp);
    }
  }
  return targetTmp;
}

export function getJournalSync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`Journal is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof Journal) {
    return targetTmp;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof Journal) {
    return targetTmp;
  }
  if (stringIsUuid(targetTmp)) {
    targetTmp = fromUuidSync(targetTmp);
  } else {
    targetTmp = game.journal.get(targetTmp);
    if (!targetTmp && !ignoreName) {
      targetTmp = game.journal.getName(targetTmp);
    }
  }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`Journal is not found`, false, targetTmp);
      return;
    } else {
      throw error(`Journal is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof Journal)) {
    if (ignoreError) {
      warn(`Invalid Journal`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid Journal`, true, targetTmp);
    }
  }
  return targetTmp;
}

export async function getJournalAsync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`Journal is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof Journal) {
    return targetTmp;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof Journal) {
    return targetTmp;
  }
  if (stringIsUuid(targetTmp)) {
    targetTmp = await fromUuid(targetTmp);
  } else {
    targetTmp = game.journal.get(targetTmp);
    if (!targetTmp && !ignoreName) {
      targetTmp = game.journal.getName(targetTmp);
    }
  }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`Journal is not found`, false, targetTmp);
      return;
    } else {
      throw error(`Journal is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof Journal)) {
    if (ignoreError) {
      warn(`Invalid Journal`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid Journal`, true, targetTmp);
    }
  }
  return targetTmp;
}

export function getMacroSync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`Macro is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof Macro) {
    return targetTmp;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof Macro) {
    return targetTmp;
  }
  if (stringIsUuid(targetTmp)) {
    targetTmp = fromUuidSync(targetTmp);
  } else {
    targetTmp = game.macros.get(targetTmp);
    if (!targetTmp && !ignoreName) {
      targetTmp = game.macros.getName(targetTmp);
    }
  }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`Macro is not found`, true, targetTmp);
      return;
    } else {
      throw error(`Macro is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof Macro)) {
    if (ignoreError) {
      warn(`Invalid Macro`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid Macro`, true, targetTmp);
    }
  }
  return targetTmp;
}

export async function getMacroAsync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`Macro is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof Macro) {
    return targetTmp;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof Macro) {
    return targetTmp;
  }
  if (stringIsUuid(targetTmp)) {
    targetTmp = await fromUuid(targetTmp);
  } else {
    targetTmp = game.macros.get(targetTmp);
    if (!targetTmp && !ignoreName) {
      targetTmp = game.macros.getName(targetTmp);
    }
  }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`Macro is not found`, true, targetTmp);
      return;
    } else {
      throw error(`Macro is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof Macro)) {
    if (ignoreError) {
      warn(`Invalid Macro`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid Macro`, true, targetTmp);
    }
  }
  return targetTmp;
}

export function getSceneSync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`Scene is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof Scene) {
    return targetTmp;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof Scene) {
    return targetTmp;
  }
  if (stringIsUuid(targetTmp)) {
    targetTmp = fromUuidSync(targetTmp);
  } else {
    targetTmp = game.scenes.get(targetTmp);
    if (!targetTmp && !ignoreName) {
      targetTmp = game.scenes.getName(targetTmp);
    }
  }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`Scene is not found`, true, targetTmp);
      return;
    } else {
      throw error(`Scene is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof Scene)) {
    if (ignoreError) {
      warn(`Invalid Scene`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid Scene`, true, targetTmp);
    }
  }
  return targetTmp;
}

export async function getSceneAsync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`Scene is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof Scene) {
    return targetTmp;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof Scene) {
    return targetTmp;
  }
  if (stringIsUuid(targetTmp)) {
    targetTmp = await fromUuid(targetTmp);
  } else {
    targetTmp = game.scenes.get(targetTmp);
    if (!targetTmp && !ignoreName) {
      targetTmp = game.scenes.getName(targetTmp);
    }
  }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`Scene is not found`, true, targetTmp);
      return;
    } else {
      throw error(`Scene is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof Scene)) {
    if (ignoreError) {
      warn(`Invalid Scene`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid Scene`, true, targetTmp);
    }
  }
  return targetTmp;
}

export function getItemSync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`Item is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof Item) {
    return targetTmp;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof Item) {
    return targetTmp;
  }
  if (stringIsUuid(targetTmp)) {
    targetTmp = fromUuidSync(targetTmp);
  } else {
    targetTmp = game.items.get(targetTmp);
    if (!targetTmp && !ignoreName) {
      targetTmp = game.items.getName(targetTmp);
    }
  }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`Item is not found`, false, targetTmp);
      return;
    } else {
      throw error(`Item is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof Item)) {
    if (ignoreError) {
      warn(`Invalid Item`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid Item`, true, targetTmp);
    }
  }
  return targetTmp;
}

export async function getItemAsync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`Item is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof Item) {
    return targetTmp;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof Item) {
    return targetTmp;
  }
  if (stringIsUuid(targetTmp)) {
    targetTmp = await fromUuid(targetTmp);
  } else {
    targetTmp = game.items.get(targetTmp);
    if (!targetTmp && !ignoreName) {
      targetTmp = game.items.getName(targetTmp);
    }
  }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`Item is not found`, false, targetTmp);
      return;
    } else {
      throw error(`Item is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof Item)) {
    if (ignoreError) {
      warn(`Invalid Item`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid Item`, true, targetTmp);
    }
  }
  return targetTmp;
}

export function getPlaylistSoundPathSync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`PlaylistSound is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof PlaylistSound) {
    return targetTmp.path;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof PlaylistSound) {
    return targetTmp;
  }
  if (typeof targetTmp === "string" || targetTmp instanceof String) {
    return targetTmp;
  }
  if (stringIsUuid(targetTmp)) {
    targetTmp = fromUuidSync(targetTmp);
  } else {
    targetTmp = game.playlists.contents
      .flatMap((playlist) => playlist.sounds.contents)
      .find((playlistSound) => {
        return playlistSound.id === targetTmp || playlistSound.name === targetTmp;
      });
  }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`PlaylistSound is not found`, true, targetTmp);
      return;
    } else {
      throw error(`PlaylistSound is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof PlaylistSound)) {
    if (ignoreError) {
      warn(`Invalid PlaylistSound`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid PlaylistSound`, true, targetTmp);
    }
  }
  return targetTmp.path;
}

export async function getPlaylistSoundPathAsync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`PlaylistSound is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof PlaylistSound) {
    return targetTmp.path;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof PlaylistSound) {
    return targetTmp;
  }
  if (typeof targetTmp === "string" || targetTmp instanceof String) {
    return targetTmp;
  }
  if (stringIsUuid(targetTmp)) {
    targetTmp = await fromUuid(targetTmp);
  } else {
    targetTmp = game.playlists.contents
      .flatMap((playlist) => playlist.sounds.contents)
      .find((playlistSound) => {
        return playlistSound.id === targetTmp || playlistSound.name === targetTmp;
      });
  }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`PlaylistSound is not found`, true, targetTmp);
      return;
    } else {
      throw error(`PlaylistSound is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof PlaylistSound)) {
    if (ignoreError) {
      warn(`Invalid PlaylistSound`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid PlaylistSound`, true, targetTmp);
    }
  }
  return targetTmp.path;
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
