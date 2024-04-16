import CONSTANTS from "../constants.js";
import Logger from "./Logger.js";

import CodeJar from "./improved-macro-editor/codejar.min.js";
import highlight from "./improved-macro-editor/highlight.min.js";
import javascript from "./improved-macro-editor/languages/javascript.min.js";

export class ActorChoicesPlusMacroConfig extends MacroConfig {
    /** @override */
    static get defaultOptions() {
        const windowSizes = {
            small: { width: 900, height: 650 },
            medium: { width: 1500, height: 1000 },
            large: { width: 1800, height: 1200 },
        };

        const size = windowSizes[game.settings.get(CONSTANTS.MODULE_ID, "windowSizeMacroEditor")];

        return mergeObject(super.defaultOptions, {
            template: `modules/${CONSTANTS.MODULE_ID}/templates/choices-plus-macro-config.html`,
            classes: ["macro-sheet", "sheet"],
            width: size.width,
            height: size.height,
            left: (window.innerWidth - size.width) / 2,
            top: (window.innerHeight - size.height) / 2,
        });
    }

    /** @override */
    getData(options = {}) {
        const context = super.getData();
        context.data.img = options.actor.img;
        context.data.name = "Choices Plus : " + context.data.name;
        context.data.enable = foundry.utils.getProperty(
            options.actor,
            `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.ENABLE}`,
        );
        return context;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        highlight.registerLanguage("javascript", javascript);
        highlight.configure({
            ignoreUnescapedHTML: true,
        });

        const textarea = html.find('textarea[name="command"]'); // this._element[0].querySelectorAll("textarea")[0] || html.find('textarea[name="command"]');
        const code = textarea.val();
        textarea.after('<code class="choices-plus-improved-macro-editor hljs language-javascript"></code>');
        textarea.parent().css({ position: "relative" });
        // textarea.after('<div class="editor-container"><code class="choices-plus-improved-macro-editor hljs language-javascript"></code></div>');
        textarea.hide();

        const editorElement = html.find(".choices-plus-improved-macro-editor")[0];

        const jar = CodeJar(editorElement, highlight.highlightElement, {
            tab: " ".repeat(4),
        });
        jar.updateCode(code);
        jar.onUpdate((code) => {
            textarea.val(code);
        });
    }

    /** @override */
    _onEditImage(event) {
        Logger.debug("ActorChoicesPlusMacroConfig | _onEditImage  | ", { event });
        return ui.notifications.error(Logger.i18n("error.editImage"));
    }

    /** @override */
    async _updateObject(event, formData) {
        Logger.debug("ActorChoicesPlusMacroConfig | _updateObject  | ", { event, formData });
        await this.updateMacro(mergeObject(formData, { type: "script" }));
    }

    /** @override */
    async _onExecute(event) {
        event.preventDefault();
        let actor = this.options.actor;
        let command = this._element[0].querySelectorAll("textarea")[0].value;
        let enable = this._element[0].querySelectorAll("input")[1].checked;
        let type = this._element[0].querySelectorAll("select")[1].value?.toLowerCase();

        Logger.debug("ActorChoicesPlusMacroConfig | _onExecute  | ", { event, actor, command, type });

        await this.updateMacro({ command, enable, type });
        actor.choicesPlusExecuteMacro(event);
    }

    async updateMacro({ command, enable, type }) {
        let actor = this.options.actor;
        let macro = actor.choicesPlusGetMacro();

        Logger.debug("ActorChoicesPlusMacroConfig | updateMacro  | ", { command, type, actor, macro });

        if (macro.command != command) {
            await actor.choicesPlusSetMacro(
                new Macro({
                    name: actor.name,
                    type,
                    scope: "global",
                    command,
                    author: game.user.id,
                }),
            );
        }

        await actor.setFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.ENABLE, enable);
    }

    static _init(app, html, data) {
        Logger.debug("ActorChoicesPlusMacroConfig | _init  | ", { app, html, data });

        if ((game.settings.get(CONSTANTS.MODULE_ID, "visibility") && app.object.isOwner) || game.user.isGM) {
            let openButton = $(
                `<a class="open-${CONSTANTS.MODULE_ID}" title="${CONSTANTS.MODULE_ID}">
                    <i class="fa-solid fa-comments"></i>${game.settings.get(CONSTANTS.MODULE_ID, "icon") ? "" : "Choices Plus"}
                </a>`,
            );
            openButton.click(async (event) => {
                let macroTmp = null;
                let actorTmp = await fromUuid(app.document.uuid);

                for (let key in app.document.apps) {
                    let obj = app.document.apps[key];
                    if (obj instanceof ActorChoicesPlusMacroConfig) {
                        macroTmp = obj;
                        break;
                    }
                }
                if (!macroTmp) {
                    macroTmp = new ActorChoicesPlusMacroConfig(actorTmp.choicesPlusGetMacro(), { actor: actorTmp });
                }
                macroTmp.render(true);

                Logger.debug("ActorMacroConfig | _init click  | ", { event, macro: macroTmp, actor: actorTmp });
            });
            html.closest(".app").find(`.open-${CONSTANTS.MODULE_ID}`).remove();
            let titleElement = html.closest(".app").find(".window-title");
            openButton.insertAfter(titleElement);
        }
    }
}
