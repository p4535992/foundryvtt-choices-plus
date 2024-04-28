import API from "../api";
import CONSTANTS from "../constants";

export default class ChoicesPlusTokenHUD {
    /**
     * cache of module settings
     */
    static _cachedEnableHudButton = true;

    static buttonEventHandler(event, token) {
        let target = $(event.currentTarget).find(".choices-plus-dispositions");

        target.css("top", event.currentTarget.offsetTop - 53);
        target.css("visibility", "visible");

        const isEi = token.actor.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.ENABLE) ?? false;
        if (isEi) {
            token.actor.choicesPlusExecuteMacro(event);
        }
    }

    static dispositionChangeEventHandler(event, token, disposition) {
        let eventTarget = $(event.currentTarget.parentElement);
        eventTarget.css("visibility", "hidden");

        const isEi = token.actor.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.ENABLE) ?? false;
        if (isEi) {
            token.actor.choicesPlusExecuteMacro(event);
        }

        eventTarget
            .closest(".choices-plus-toggle-disposition")
            .children("i")
            .removeClass()
            .addClass("fas")
            .addClass(this.getIconForDisposition(disposition));
        event.stopPropagation();
    }

    static getIconForDisposition(disposition) {
        switch (disposition) {
            case "merchant": {
                return "fa-solid fa-comments-dollar";
            }
            case "quest": {
                return "fa-solid fa-message-smile";
            }
            default: {
                return "fa-solid fa-comments";
            }
        }
    }

    static getTooltipForDisposition(disposition) {
        switch (disposition) {
            case "merchant": {
                return "Merchant"; // "toggle-token-disposition.disposition.friendly";
            }
            case "quest": {
                return "Quest"; // "toggle-token-disposition.disposition.neutral";
            }
            default: {
                return "Talk"; // "toggle-token-disposition.disposition.hostile";
            }
        }
    }

    static getTokenActor(token) {
        return game.actors.get(token.actorId);
    }

    static createDispositionButtons(token) {
        let buttons = document.createElement("div");
        buttons.classList.add("choices-plus-dispositions");

        //buttons.append(this.createDispositionChangeButton("", token));
        buttons.append(this.createDispositionChangeButton("merchant", token));
        buttons.append(this.createDispositionChangeButton("quest", token));
        buttons.append(this.createDispositionChangeButton("", token));

        return buttons;
    }

    static createDispositionChangeButton(disposition, token) {
        let button = this.createButton(disposition);

        $(button)
            .click((event) => this.dispositionChangeEventHandler(event, token, disposition))
            .contextmenu((event) => this.dispositionChangeEventHandler(event, token, disposition));

        return button;
    }

    static createButton(disposition, overrideTooltipKey) {
        let button = document.createElement("div");

        button.classList.add("control-icon");
        button.classList.add("choices-plus-toggle-disposition");
        button.innerHTML = `<i class="${this.getIconForDisposition(disposition)}"></i>`;
        button.title = game.i18n.localize(
            overrideTooltipKey ? overrideTooltipKey : this.getTooltipForDisposition(disposition),
        );

        return button;
    }

    static prepTokenHUD(hud, html, token) {
        const isEi = hud.object?.document?.actor?.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.ENABLE) ?? false;
        if (!isEi) {
            return;
        }
        // check setting, early out if hud button is disabled
        if (!this._cachedEnableHudButton) {
            return;
        }

        const tokenButton = this.createButton(hud.object.document.disposition, "Choices Plus"); // "toggle-token-disposition.tooltiptext");

        // tokenButton.append(this.createDispositionButtons(hud.object.document));

        $(tokenButton)
            .click((event) => this.buttonEventHandler(event, hud.object.document))
            .contextmenu((event) => this.buttonEventHandler(event, hud.object.document));

        html.find("div.left").append(tokenButton);
    }
}
