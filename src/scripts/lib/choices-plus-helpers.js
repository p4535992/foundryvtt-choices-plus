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
                    //left open if chat macros ever become a thing you would want to do inside an item?
                    break;
                }
                case "script": {
                    return await this._executeChoicesPlusScript(...args);
                }
            }
        };

        Actor.prototype._executeChoicesPlusScript = async function (...args) {
            //add variable to the evaluation of the script
            /*
          const item = this;
          const macro = Actor.getChoicesPlusMacro();
          const speaker = ChatMessage.getSpeaker({actor : Actor.actor});
          const actor = Actor.actor ?? game.actors.get(speaker.actor);
          */
            const actor = this;
            const macro = Actor.getChoicesPlusMacro();
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
                return await fn.bind(macro)(item, speaker, actor, token, character, event, args);
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

    // static systemHandler() {
    //     let sheetHooks = ChoicesPlusHelpers.getSheetHooks();

    //     switch (game.system.id) {
    //         case "dnd5e": {
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "defaultmacro")) {
    //                 dnd5e.register_helper();
    //             }
    //             dnd5e.applyTidy5eCompatibility();
    //             break;
    //         }
    //         case "sfrpg": {
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "defaultmacro")) {
    //                 sfrpg.register_helper();
    //             }
    //             break;
    //         }
    //         case "swade": {
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "defaultmacro")) {
    //                 swade.register_helper();
    //             }
    //             break;
    //         }
    //         case "dungeonworld": {
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "defaultmacro")) {
    //                 dungeonworld.register_helper();
    //             }
    //             break;
    //         }
    //         case "ose": {
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "defaultmacro")) {
    //                 ose.register_helper();
    //             }
    //             break;
    //         }
    //         case "demonlord": {
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "defaultmacro")) {
    //                 demonlord.register_helper();
    //             }
    //             break;
    //         }
    //         case "cyberpunk-red-core": {
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "defaultmacro")) {
    //                 cyberpunk.register_helper();
    //             }
    //             break;
    //         }
    //         case "worldbuilding": {
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "defaultmacro")) {
    //                 worldbuilding.register_helper();
    //             }
    //             break;
    //         }
    //         case "wfrp4e": {
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "defaultmacro")) {
    //                 wfrp4e.register_helper();
    //             }
    //             break;
    //         }
    //     }

    //     if (sheetHooks) {
    //         Object.entries(sheetHooks).forEach(([preKey, obj]) => {
    //             if (obj instanceof Object)
    //                 Object.entries(obj).forEach(([key, str]) => {
    //                     Hooks.on(`${preKey}${key}`, (app, html, _data) => {
    //                         changeButtonExecution(app, html, str, sheetHooks.onChange);
    //                     });
    //                 });
    //         });
    //     }

    //     async function changeButtonExecution(app, html, str, onChange = []) {
    //         Logger.debug("changeButtonExecution : ", { app, html, str });

    //         if (ChoicesPlusHelpers.getSheetHooks().rendered[app.constructor.name] !== undefined) {
    //             await ChoicesPlusHelpers.waitFor(() => app.rendered);
    //         }

    //         if (app && !app.isEditable) {
    //             return;
    //         }
    //         let itemImages = html.find(str);

    //         Logger.debug("changeButtonExecution | ", { app, html, str, itemImages });

    //         for (let img of itemImages) {
    //             img = $(img);

    //             // @todo refactor into class-based systems with default parent method
    //             const itemTag = game.system.hasOwnProperty("itemTag") ? game.system.itemTag() : ".item";
    //             const li = img.parents(itemTag);
    //             const id = li.attr("data-item-id") ?? img.attr("data-item-id");

    //             if (!id) {
    //                 Logger.debug("Id Error | ", img, li, id);
    //                 continue;
    //             }

    //             const actor = app.actor;

    //             Logger.debug("changeButtonExecution | for | ", { img, li, id, item });

    //             if (!item.hasMacro()) {
    //                 continue;
    //             }

    //             if (game.settings.get(CONSTANTS.MODULE_ID, "click")) {
    //                 img.contextmenu((event) => {
    //                     actor.executeChoicesPlusMacro(event);
    //                 });
    //             } else {
    //                 img.off();
    //                 img.click((event) => {
    //                     Logger.debug("Img Click | ", img, event);
    //                     actor.executeChoicesPlusMacro(event);
    //                 });
    //             }
    //             onChange.forEach((fn) => fn(img, item, html));
    //         }
    //     }
    // }

    // static getSheetHooks() {
    //     switch (game.system.id) {
    //         case "dnd5e":
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "defaultmacro")) return dnd5e.sheetHooks();
    //             break;
    //         case "sfrpg":
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "charsheet")) return sfrpg.sheetHooks();
    //             break;
    //         case "swade":
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "charsheet")) return swade.sheetHooks();
    //             break;
    //         case "dungeonworld":
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "charsheet")) return dungeonworld.sheetHooks();
    //             break;
    //         case "ose":
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "charsheet")) return ose.sheetHooks();
    //             break;
    //         case "demonlord":
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "charsheet")) return demonlord.sheetHooks();
    //             break;
    //         case "cyberpunk-red-core":
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "charsheet")) return cyberpunk.sheetHooks();
    //             break;
    //         case "worldbuilding":
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "charsheet")) return worldbuilding.sheetHooks();
    //             break;
    //         case "wfrp4e":
    //             if (game.settings.get(CONSTANTS.MODULE_ID, "charsheet")) return wfrp4e.sheetHooks();
    //             break;
    //     }
    // }

    // static addContext(contextOptions, origin) {
    //     if (!game.user.isGM) return;
    //     Logger.info("Adding Context Menu Items.");
    //     contextOptions.push({
    //         name: settings.i18n("context.label"),
    //         icon: '<i class="fas fa-redo"></i>',
    //         condition: () => game.user.isGM,
    //         callback: (li) => updateMacros(origin, li?.data("entry-id")),
    //     });

    //     async function updateMacros(origin, _id) {
    //         Logger.info("Update Macros Called | ", origin, _id);
    //         let item = undefined,
    //             updateInfo = [];
    //         if (origin === "Directory") item = game.items.get(_id);
    //         //if(origin === "Compendium") /* No clue */

    //         let result = await Dialog.confirm({
    //             title: settings.i18n("context.confirm.title"),
    //             content: `${settings.i18n("context.confirm.content")} <br><table><tr><td> Name : <td> <td> ${item.name} </td></tr><tr><td> ID : <td><td> ${item.id} </td></tr><tr><td> Origin : <td> <td> Item ${origin} </td></tr></table>`,
    //         });

    //         let macro = item.getMacro();
    //         Logger.debug("updateMacros Info | ", item, macro, result);

    //         if (result) {
    //             //update game items
    //             for (let i of game.items.filter((e) => e.name === item.name && e.id !== item.id)) {
    //                 await updateItem({ item: i, macro, location: "Item Directory" });
    //             }

    //             //update actor items
    //             for (let a of game.actors) {
    //                 await updateActor({ actor: a, name: item.name, macro, location: `Actor Directory [${a.name}]` });
    //             }
    //             //update scene entities
    //             for (let s of game.scenes) {
    //                 for (let t of s.data.tokens.filter((e) => !e.actorLink)) {
    //                     let token = new Token(t, s);
    //                     await updateActor({
    //                         actor: token.actor,
    //                         name: item.name,
    //                         macro,
    //                         location: `Scene [${s.name}] Token [${t.name}]`,
    //                     });
    //                 }
    //             }

    //             await Dialog.prompt({
    //                 title: settings.i18n("context.prompt.title"),
    //                 content: `${settings.i18n("context.prompt.content")}<hr>${updateInfo.reduce((a, v) => (a += `<table><tr><td> Actor : <td> <td> ${v.actor} </td></tr><tr><td> Token : <td> <td> ${v.token} </td></tr><tr><td> Item : <td> <td> ${v.item} </td></tr><tr><td> Location : <td> <td> ${v.location} </td></tr></table>`), ``)}`,
    //                 callback: () => {},
    //                 options: { width: "auto", height: "auto" },
    //             });
    //         }

    //         async function updateActor({ actor, name, macro, location }) {
    //             Logger.debug("Attempting Actor Update | ", actor, name, macro);
    //             for (let item of actor?.items?.filter((i) => i.data.name === name) || [])
    //                 await updateItem({ item, macro, location });
    //         }
    //         async function updateItem({ item, macro, location }) {
    //             Logger.debug("Attempting Item Update | ", item, macro);
    //             await item.setMacro(macro);
    //             updateInfo.push({
    //                 actor: item?.actor.id,
    //                 token: item?.actor?.token?.id,
    //                 item: item.id,
    //                 location,
    //             });
    //         }
    //     }
    // }

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

    // static systemValidation(macro) {
    //     switch (game.system.id) {
    //         case "dnd5e":
    //             return dnd5e.systemValidation(macro);
    //         default:
    //     }

    //     return true;
    // }
}
