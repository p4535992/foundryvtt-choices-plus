import API from "../api";
import CONSTANTS from "../constants";
import Logger from "./Logger";

export default class ChoicesPlusHelpers {
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

    static _TokenPrototypeOnClickLeftTokenHandler(wrapped, ...args) {
        const token = this;
        const isEi = token.actor.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.ENABLE) ?? false;
        // Prevent deselection of currently controlled token when clicking environment token
        if (isEi) {
            const macro = token.actor.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.MACRO);
            if (game.user.isGM) {
                new Dialog({
                    title: "Choices Plus",
                    content: "",
                    buttons: {
                        confirm: {
                            icon: '<i class="fas fa-check"></i>',
                            label: "Show Choices",
                            callback: async () => {
                                API.showChoicesFromMacro(macro);
                            },
                        },
                        cancel: {
                            icon: '<i class="fas fa-times"></i>',
                            label: "Open Sheet",
                            callback: async () => {
                                return wrapped(...args);
                            },
                        },
                    },
                    default: "cancel",
                });
            } else {
                API.showChoicesFromMacro(macro);
            }
        } else {
            return wrapped(...args);
        }
    }

    static _NotePrototypeOnClickLeftHandler(wrapped, ...args) {
        const note = this;
        const isEi = note.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.ENABLE) ?? false;
        if (isEi) {
            const macro = note.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.MACRO);
            API.showChoicesFromMacro(macro);
        } else {
            return wrapped(...args);
        }
    }

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

        Actor.prototype._choicesPlusExecuteScript = async function (...args) {
            //add variable to the evaluation of the script

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

            //build script execution
            const scriptFunction = Object.getPrototypeOf(async function () {}).constructor;
            const body = macro.command ?? macro?.data?.command;
            const fn = new scriptFunction("speaker", "actor", "token", "character", "event", "args", body);

            Logger.debug("Actor | _choicesPlusExecuteScript | ", { body, fn });

            //attempt script execution
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
