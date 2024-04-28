import CONSTANTS from "../constants.js";
import { RetrieveHelpers } from "./retrieve-helpers.js";
import Logger from "./Logger.js";

// ==========================================

export async function runMacroCommand(macro, command, options = {}) {
    const { speaker, actor, token, character, event, args } = options;

    const scriptFunction = Object.getPrototypeOf(async function () {}).constructor;
    const body = command;
    const fn = new scriptFunction("speaker", "actor", "token", "character", "event", "args", body);

    Logger.debug("runMacroCommand | ", { body, fn });

    //attempt script execution
    try {
        return await fn.bind(macro)(speaker, actor, token, character, event, args);
    } catch (err) {
        Logger.error(Logger.i18n("error.macroExecution"), true);
        Logger.error(err);
    }
}

export async function runMacro(macroReference, ...macroData) {
    let macroFounded = await RetrieveHelpers.getMacroAsync(macroReference, false, true);
    if (!macroFounded) {
        throw Logger.error(`Could not find macro with reference "${macroReference}"`, true);
    }
    // Credit to Otigon, Zhell, Gazkhan and MrVauxs for the code in this section
    /*
    let macroId = macro.id;
    if (macroId.startsWith("Compendium")) {
      let packArray = macroId.split(".");
      let compendium = game.packs.get(`${packArray[1]}.${packArray[2]}`);
      if (!compendium) {
        throw Logger.error(`Compendium ${packArray[1]}.${packArray[2]} was not found`, true);
      }
      let findMacro = (await compendium.getDocuments()).find(m => m.name === packArray[3] || m.id === packArray[3])
      if (!findMacro) {
        throw Logger.error(`The "${packArray[3]}" macro was not found in Compendium ${packArray[1]}.${packArray[2]}`, true);
      }
      macro = new Macro(findMacro?.toObject());
      macro.ownership.default = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;
    } else {
      macro = game.macros.getName(macroId);
      if (!macro) {
        throw Logger.error(`Could not find macro with name "${macroId}"`, true);
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

            Logger.debug("runMacro | ", { macro, speaker, actor, token, character, event, args });

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

            Logger.debug("runMacro | ", { body, fn });

            //attempt script execution
            try {
                fn.call(macro, speaker, actor, token, character, event, args);
            } catch (err) {
                Logger.error(`error macro Execution`, true, err);
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
            Logger.warn(`Something is wrong a macro can be only a 'char' or a 'script'`, true);
        }
    } catch (err) {
        throw Logger.error(`Error when executing macro ${macroReference}!`, true, macroDataArr, err);
    }

    return result;
}

export function getOwnedCharacters(user = false) {
    user = user || game.user;
    return game.actors
        .filter((actor) => {
            return (
                actor.ownership?.[user.id] === CONST.DOCUMENT_PERMISSION_LEVELS.OWNER && actor.prototypeToken.actorLink
            );
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

// ==========================================

export function isEmptyObject(obj) {
    // because Object.keys(new Date()).length === 0;
    // we have to do some additional check
    if (obj === null || obj === undefined) {
        return true;
    }
    if (isRealNumber(obj)) {
        return false;
    }
    if (obj instanceof Object && Object.keys(obj).length === 0) {
        return true;
    }
    if (obj instanceof Array && obj.length === 0) {
        return true;
    }
    if (obj && Object.keys(obj).length === 0) {
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

export function isRealBooleanOrElseNull(inBoolean) {
    return isRealBoolean(inBoolean) ? inBoolean : null;
}

export function getSubstring(string, char1, char2) {
    return string.slice(string.indexOf(char1) + 1, string.lastIndexOf(char2));
}

/**
 * Parses the given object as an array.
 * If the object is a string, it splits it by commas and returns an array.
 * If the object is already an array, it returns the same array.
 * If the object is neither a string nor an array, it wraps it in an array and returns it.
 * @param {string|Array|any} obj - The object to be parsed as an array.
 * @returns {Array} - The parsed array.
 */
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

/**
 * Utility method to convert the element to a number
 * @param {number|string} elementToConvertToNumber
 * @returns {Promise<number>} The number representation of the element
 */
export async function tryToConvertToNumber(elementToConvertToNumber) {
    if (elementToConvertToNumber) {
        if (isRealNumber(elementToConvertToNumber)) {
            // DO NOTHING
        } else if (String(elementToConvertToNumber) === "0") {
            elementToConvertToNumber = 0;
        } else {
            let elementI = null;
            try {
                elementI = Number(elementToConvertToNumber);
            } catch (e) {}
            if (elementI && isRealNumber(elementI)) {
                elementToConvertToNumber = elementI;
            } else {
                elementToConvertToNumber = await tryRoll(elementToConvertToNumber, 0);
            }
        }
    } else {
        elementToConvertToNumber = 0;
    }
    return elementToConvertToNumber;
}

/**
 * Utility method to convert the element to a number
 * @param {number|string} elementToConvertToNumber
 * @returns {number} The number representation of the element
 */
export function tryToConvertToNumberSync(elementToConvertToNumber) {
    if (elementToConvertToNumber) {
        if (isRealNumber(elementToConvertToNumber)) {
            // DO NOTHING
        } else if (String(elementToConvertToNumber) === "0") {
            elementToConvertToNumber = 0;
        } else {
            let elementI = null;
            try {
                elementI = Number(elementToConvertToNumber);
            } catch (e) {}
            if (elementI && isRealNumber(elementI)) {
                elementToConvertToNumber = elementI;
            } else {
                elementToConvertToNumber = tryRollSync(elementToConvertToNumber, 0);
            }
        }
    } else {
        elementToConvertToNumber = 0;
    }
    return elementToConvertToNumber;
}

export async function tryRoll(rollFormula, defaultValue = 0) {
    try {
        const qtFormula = String(rollFormula);
        if (qtFormula == null || qtFormula === "" || qtFormula === "1") {
            return 1;
        } else {
            try {
                const qt = (await new Roll(qtFormula).roll({ async: true })).total || defaultValue;
                return qt;
            } catch (e) {
                Logger.debug(e.message, false, e);
                const qtRoll = Roll.create(qtFormula);
                const qt = (await qtRoll.evaluate({ async: true })).total || defaultValue;
                return qt;
            }
        }
    } catch (e) {
        Logger.error(e.message, false, e);
        return defaultValue;
    }
}

export function tryRollSync(rollFormula, defaultValue = 0) {
    try {
        const qtFormula = String(rollFormula);
        if (qtFormula == null || qtFormula === "" || qtFormula === "1") {
            return 1;
        } else {
            try {
                const qt = new Roll(qtFormula).roll({ async: false }).total || defaultValue;
                return qt;
            } catch (e) {
                Logger.debug(e.message, false, e);
                const qtRoll = Roll.create(qtFormula);
                const qt = qtRoll.evaluate({ async: false }).total || defaultValue;
                return qt;
            }
        }
    } catch (e) {
        Logger.error(e.message, false, e);
        return defaultValue;
    }
}
