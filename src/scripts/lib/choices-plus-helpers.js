import API from "../api";
import CONSTANTS from "../constants";
import { isRealBooleanOrElseNull, isRealNumber, parseAsArray, tryToConvertToNumberSync } from "./lib";
import Logger from "./Logger";

export default class ChoicesPlusHelpers {
    /**
     * The utility for update the options the right way
     * @param {Object} options
     * @param {string} [options.title] The big title for the choice.
     * @param {string} [options.text] The little (and short), summary text for the choice. NOTE: You can use html core and document link on this text.
     * @param {string} [options.key=null] OPTIONAL: The explicit key identifier to associate to this choice it used on some chain event. If not key is given by default the 'title' is used instead.
     * @param {boolean} [options.main=false] OPTIONAL: true or false, determines if current choices is the main one. usually only one choice has the main value to true, if no main is set the first choice of the array is the one launched (default false).
     * @param {boolean} [options.fastClick=false] OPTIONAL: true or false, determines if to resolve a choice with the click instead to click a second time on the green button on the top right (default false).
     * @param {boolean} [options.multi=false] OPTIONAL: true or false, determines if multiple choices can be selected (default false).
     * @param {number} [options.time=0] OPTIONAL: The number of seconds for make a decision (default 0).
     * @param {string} [options.img=null] OPTIONAL: the path to the image to be displayed as the background (default null).
     * @param {boolean} [options.show=true] OPTIONAL: true or false, determines if show the active choice. Working in progress for a better behavior (default true).
     * @param {string|string[]} [options.player=null] OPTIONAL: a comma separated list on a string or just a array of strings of player names, if not provided all players will get to chose. NOTE: You can use user name, or id or uuid associated to a user.
     * @param {boolean} [options.democracy=true] OPTIONAL: true or false, determine if the choice with the highest votes will be picked (if true) or resolve the choice per player (if false) (default true).
     * @param {number} [options.default=0] OPTIONAL: the default choice if no choice is made (default 0 the first choice on the list). Working in progress for a better behavior (default 0).
     * @param {boolean} [options.displayResult=true] OPTIONAL: true or false, determine if the result will be output to chat after the choice is made (default true).
     * @param {boolean} [options.resolveGM=false] OPTIONAL: true or false, determine if the resolution of the choice should run on the gm side as well (default false).
     * @param {string|string[]} [options.portraits=null] OPTIONAL: a comma separated list on a string or just a array of strings of actor names, if not provided no portrait is show. NOTE: You can use actor name, or id or uuid associated to a actor.
     * @param {string} [options.textColor="#000000eb"] OPTIONAL: apply a text color as css on the choice (default #000000eb).
     * @param {string} [options.backgroundColor="#000000ff"] OPTIONAL: apply a background color as css on the choice (default #000000ff).
     * @param {string} [options.buttonColor="#ffffffd8"] OPTIONAL: apply a button color as css on the choice (default #ffffffd8).
     * @param {string} [options.buttonHoverColor="#c8c8c8d8"] OPTIONAL: apply a button color as css when hover on the choice (default  #c8c8c8d8).
     * @param {string} [options.buttonActiveColor="#838383d8"] OPTIONAL: apply a button color as css when set active on the choice (default #838383d8).
     * @param {boolean} [options.alwaysOnTop=false] OPTIONAL: true or false, determine if the choice will be on top of all other UI elements, i set with a valid boolean value it will override the module setting 'Always on top'.
     * @param {boolean} [options.chain=false] OPTIONAL: true or false, determine if the choice will call other choices.
     * @param {Choice[]} [options.choices=null] OPTIONAL: A array of choice child, every child is a button on the choice dialog.
     * @param {Record<string,Choice>} [options.dictionaryChoices=null] PRIVATE: The internal dictionary used for the chain mechanism.
     * @returns {{title: string; text: string; multi: boolean; time: number; img: string; show: boolean; player: string|string; democracy: boolean; default: number; displayResult: boolean; resolveGM: boolean; portraits: string|string[]; textcolor: string; backgroundcolor: string; buttoncolor: string; buttonhovercolor: string; buttonactivecolor: string; alwaysOnTop: boolean; choices: Choice[]; chain: boolean; key: string; main: boolean; fastClick: boolean; dictionaryChoices:Record<string,Choice>;}} Update options
     */
    static updateOptions(options) {
        let newOptions = {};
        if (!options) {
            options = {};
        }

        newOptions.title = options.title || "Title not present";
        newOptions.text = options.text || "";
        newOptions.key = options.key || options.title;
        newOptions.main = isRealBooleanOrElseNull(options.main) ? String(options.main) === "true" : false;
        newOptions.fastClick = isRealBooleanOrElseNull(options.fastClick)
            ? String(options.fastClick) === "true"
            : false;
        newOptions.multi = isRealBooleanOrElseNull(options.multi) ? String(options.multi) === "true" : false;
        newOptions.time = isRealNumber(options.time) ? options.time : tryToConvertToNumberSync(options.time, 0);
        newOptions.img = options.img || null;
        newOptions.show = isRealBooleanOrElseNull(options.show) ? String(options.show) === "true" : true;
        newOptions.player = options.player ? parseAsArray(options.player) : null;
        newOptions.democracy = isRealBooleanOrElseNull(options.democracy) ? String(options.democracy) === "true" : true;
        newOptions.default = isRealNumber(options.default)
            ? options.default
            : tryToConvertToNumberSync(options.default, 0);
        newOptions.displayResult = isRealBooleanOrElseNull(options.displayResult)
            ? String(options.displayResult) === "true"
            : true;
        newOptions.resolveGM = isRealBooleanOrElseNull(options.resolveGM)
            ? String(options.resolveGM) === "true"
            : false;
        newOptions.portraits = options.portraits ? parseAsArray(options.portraits) : null;
        newOptions.textcolor = options.textcolor || game.settings.get(CONSTANTS.MODULE_ID, "textcolor") || "#000000eb";
        newOptions.backgroundcolor =
            options.backgroundcolor || game.settings.get(CONSTANTS.MODULE_ID, "backgroundcolor") || "#000000ff";
        newOptions.buttoncolor =
            options.buttoncolor || game.settings.get(CONSTANTS.MODULE_ID, "buttoncolor") || "#ffffffd8";
        newOptions.buttonhovercolor =
            options.buttonhovercolor || game.settings.get(CONSTANTS.MODULE_ID, "buttonhovercolor") || "#c8c8c8d8";
        newOptions.buttonactivecolor =
            options.buttonactivecolor || game.settings.get(CONSTANTS.MODULE_ID, "buttonactivecolor") || "#838383d8";
        newOptions.alwaysOnTop = isRealBooleanOrElseNull(options.alwaysOnTop)
            ? String(options.alwaysOnTop) === "true"
            : false;

        newOptions.choices = [];
        const choicesTmp = options.choices || [];
        for (const choiceTmp of choicesTmp) {
            if (choiceTmp) {
                newOptions.choices.push(ChoicesPlusHelpers.updateOptions(choiceTmp));
            }
        }
        newOptions.chain = isRealBooleanOrElseNull(options.chain) ? String(options.chain) === "true" : false;

        newOptions.dictionaryChoices = options.dictionaryChoices || {};

        // NOTE: If data.content is present the call is from the chat behavior
        newOptions.content = newOptions.text ? newOptions.text : newOptions.content;

        return newOptions;
    }

    static registerClicks() {
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
            "Token.prototype._onClickRight",
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
    }

    // static _TokenPrototypeOnClickLeftTokenHandler(wrapped, ...args) {
    //     const token = this;
    //     if (token.actor) {
    //         return;
    //     }
    //     const isEi = token.actor.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.ENABLE) ?? false;
    //     const isItemPiles = game.modules.get("item-piles")?.active && game.itempiles.API.isValidItemPile(token);
    //     if (isEi && !game.user.isGM && !isItemPiles) {
    //         token.actor.choicesPlusExecuteMacro();
    //     } else {
    //         return wrapped(...args);
    //     }
    // }

    // static _TokenPrototypeOnClickRight2TokenHandlerOverride(event) {
    //     if ( !this._propagateRightClick(event) ) event.stopPropagation();
    //     const isEi = this.actor?.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.ENABLE) ?? false;
    //     //  const isItemPiles = game.modules.get("item-piles")?.active && game.itempiles.API.isValidItemPile(token);
    //     // if ( !this._propagateRightClick(event) ) event.stopPropagation();
    //     if ( this.isOwner && game.user.can("TOKEN_CONFIGURE") ) {
    //         return super._onClickRight2(event);
    //     }
    //     if (isEi && !game.user.isGM) {
    //         this.actor.choicesPlusExecuteMacro();
    //     }
    //     return this.setTarget(!this.targeted.has(game.user), {releaseOthers: !event.shiftKey});
    // }

    static _TokenPrototypeOnClickRight2TokenHandler(wrapped, ...args) {
        // if ( !this._propagateRightClick(event) ) event.stopPropagation();
        // if ( this.isOwner && game.user.can("TOKEN_CONFIGURE") ) return super._onClickRight2(event);
        // return this.setTarget(!this.targeted.has(game.user), {releaseOthers: !event.shiftKey});
        const token = this;
        const isEi = token.actor?.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.ENABLE) ?? false;
        //  const isItemPiles = game.modules.get("item-piles")?.active && game.itempiles.API.isValidItemPile(token);
        if (isEi && !game.user.isGM) {
            token.actor.choicesPlusExecuteMacro();
        }
        return wrapped(...args);
    }

    // static _NotePrototypeOnClickLeftHandler(wrapped, ...args) {
    //     const note = this;
    //     const isEi = note.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.ENABLE) ?? false;
    //     if (isEi && !game.user.isGM) {
    //         note.choicesPlusExecuteMacro();
    //     } else {
    //         return wrapped(...args);
    //     }
    // }

    static registerActor() {
        Actor.prototype.choicesPlusHasMacro = function () {
            let flag = this.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.MACRO);

            Logger.debug("Actor | choicesPlusHasMacro | ", { flag });
            return !!(flag?.command ?? flag?.data?.command);
        };

        Actor.prototype.choicesPlusGetMacro = function () {
            let hasMacro = this.choicesPlusHasMacro();
            let flag = this.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.MACRO);

            Logger.debug("Actor | choicesPlusGetMacro | ", { hasMacro, flag });

            if (hasMacro) {
                const command = !!flag?.command;
                return new Macro(command ? flag : flag?.data);
            }

            return new Macro({ img: this.img, name: this.name, scope: "global", type: "script" });
        };

        Actor.prototype.choicesPlusSetMacro = async function (macro) {
            let flag = this.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.MACRO);

            Logger.debug("Actor | choicesPlusSetMacro | ", { macro, flag });

            if (macro instanceof Macro) {
                const data = macro.toObject();
                return await this.setFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.MACRO, data);
            }
        };

        Actor.prototype.choicesPlusExecuteMacro = async function (...args) {
            if (!this.choicesPlusHasMacro()) {
                return;
            }
            const type = this.choicesPlusGetMacro()?.type;
            switch (type) {
                case "chat": {
                    //left open if chat macros ever become a thing you would want to do inside an actor?
                    break;
                }
                case "script": {
                    return await this._choicesPlusExecuteScript(...args);
                }
            }
        };

        Actor.prototype.ecuteScript = async function (...args) {
            //add variable to the evaluation of the scr_choicesPlusExipt

            const actor = this;
            const macro = actor.choicesPlusGetMacro();
            const speaker = ChatMessage.getSpeaker({ actor: actor });

            /* MMH@TODO Check the types returned by linked and unlinked */
            const token = canvas.tokens?.get(speaker.token);
            const character = game.user.character;
            const event = getEvent();

            Logger.debug("Actor | _choicesPlusExecuteScript | ", {
                macro,
                speaker,
                actor,
                token,
                character,
                event,
                args,
            });

            // if (ChoicesPlusHelpers.systemValidation(macro) === false) {
            //     return;
            // }

            // build script execution
            const command =
                `game.modules.get("choices-plus").api.showChoices([` + (macro.command ?? macro?.data?.command) + `]);`;
            const scriptFunction = Object.getPrototypeOf(async function () {}).constructor;
            const body = command;
            const fn = new scriptFunction("speaker", "actor", "token", "character", "event", "args", body);

            Logger.debug("Actor | _choicesPlusExecuteScript | ", { body, fn });

            // attempt script execution
            try {
                return await fn.bind(macro)(speaker, actor, token, character, event, args);
            } catch (err) {
                Logger.error(Logger.i18n("error.macroExecution"), true);
                Logger.error(err);
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
        };
    }

    static async waitFor(fn, m = 200, w = 100, i = 0) {
        while (!fn(i, (i * w) / 100) && i < m) {
            i++;
            await ChoicesPlusHelpers.wait(w);
        }

        return i !== m;
    }

    static async wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
