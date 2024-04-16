import CONSTANTS from "../constants";
import Logger from "./Logger";

export default class ChoicesPlusHelpers {
    static registerActor() {
        Actor.prototype.hasChoicesPlusMacro = function () {
            let flag = this.getFlag(CONSTANTS.MODULE_ID, `macro`);

            Logger.debug("Actor | hasChoicesPlusMacro | ", { flag });
            return !!(flag?.command ?? flag?.data?.command);
        };

        Actor.prototype.getChoicesPlusMacro = function () {
            let hasMacro = this.hasChoicesPlusMacro();
            let flag = this.getFlag(CONSTANTS.MODULE_ID, `macro`);

            Logger.debug("Actor | getChoicesPlusMacro | ", { hasMacro, flag });

            if (hasMacro) {
                const command = !!flag?.command;
                return new Macro(command ? flag : flag?.data);
            }

            return new Macro({ img: this.img, name: this.name, scope: "global", type: "script" });
        };

        Actor.prototype.setChoicesPlusMacro = async function (macro) {
            let flag = this.getFlag(CONSTANTS.MODULE_ID, `macro`);

            Logger.debug("Actor | setChoicesPlusMacro | ", { macro, flag });

            if (macro instanceof Macro) {
                const data = macro.toObject();
                return await this.setFlag(CONSTANTS.MODULE_ID, `macro`, data);
            }
        };

        Actor.prototype.executeChoicesPlusMacro = async function (...args) {
            if (!this.hasChoicesPlusMacro()) {
                return;
            }
            const type = this.getChoicesPlusMacro()?.type;
            switch (type) {
                case "chat": {
                    //left open if chat macros ever become a thing you would want to do inside an actor?
                    break;
                }
                case "script": {
                    return await this._executeChoicesPlusScript(...args);
                }
            }
        };

        Actor.prototype._executeChoicesPlusScript = async function (...args) {
            //add variable to the evaluation of the script

            const actor = this;
            const macro = actor.getChoicesPlusMacro();
            const speaker = ChatMessage.getSpeaker({ actor: actor });

            /* MMH@TODO Check the types returned by linked and unlinked */
            const token = canvas.tokens?.get(speaker.token);
            const character = game.user.character;
            const event = getEvent();

            Logger.debug("Actor | _executeChoicesPlusScript | ", {
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

            Logger.debug("Actor | _executeChoicesPlusScript | ", { body, fn });

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
