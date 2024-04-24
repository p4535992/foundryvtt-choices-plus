import API from "./api.js";
import { ForienEasyPollsHelpers } from "./apps/fep-helpers.js";
import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";
import ChoicesPlusHelpers from "./lib/choices-plus-helpers.js";
import { getUserCharacter, isRealNumber, isRealBoolean, isValidImage, runMacro, parseAsArray } from "./lib/lib.js";
import { RetrieveHelpers } from "./lib/retrieve-helpers.js";
import { ChoicesSocket } from "./socket.js";

export class VisualNovelDialog {
    constructor(data) {
        const newOptions = ChoicesPlusHelpers.updateOptions(data);

        this.content = newOptions.content;

        this.multi = newOptions.multi;
        this.time = newOptions.time;
        this.img = newOptions.img;
        this.show = newOptions.show;
        this.player = newOptions.player;
        this.democracy = newOptions.democracy;
        this.default = newOptions.default;
        this.displayResult = newOptions.displayResult;
        this.resolveGM = newOptions.resolveGM;
        this.portraits = newOptions.portraits;
        this.alwaysOnTop = newOptions.alwaysOnTop;
        this.chain = newOptions.chain;

        this.textColor = newOptions.textColor;
        this.backgroundColor = newOptions.backgroundColor;
        this.textFontSize = newOptions.textFontSize;

        this.buttonColor = newOptions.buttonColor;
        this.buttonHoverColor = newOptions.buttonHoverColor;
        this.buttonActiveColor = newOptions.buttonActiveColor;

        this.fastClick = newOptions.fastClick;

        let root = document.documentElement;
        root.style.setProperty("--choices-plus-font-color", this.textColor);
        root.style.setProperty("--choices-plus-background-color", this.backgroundColor);
        // CHOICES STYLE
        root.style.setProperty("--choices-plus-button-color", this.buttonColor);
        root.style.setProperty("--choices-plus-button-hover-color", this.buttonHoverColor);
        root.style.setProperty("--choices-plus-button-active-color", this.buttonActiveColor);

        this.choices = newOptions.choices;
        this.title = newOptions.title;
        this.text = newOptions.text;

        const choicesContainer = $(`<div class="choices-plus-container"></div>`);
        this.element = $(`<div id="choices-plus-dialog"></div>`);
        this.element.append(choicesContainer);
        this.containerHTML = choicesContainer;
        game.VisualNovelDialog = this;
        Logger.debug(`VisualNovelDialog | ${this.title} | Build it`, { options: newOptions });
    }

    _addGMButtons() {
        const gmButtons = $(`<div class="gm-buttons"></div>`);
        const resolveButton = $(`<button class="gm-button"><i class="fas fa-check"></i></button>`);
        const closeButton = $(`<button class="gm-button"><i class="fas fa-times"></i></button>`);
        gmButtons.append(resolveButton);
        gmButtons.append(closeButton);
        this.element.append(gmButtons);
        resolveButton.click(() => ChoicesSocket.executeForEveryone("resolve"));
        closeButton.click(() => ChoicesSocket.executeForEveryone("cancel"));
    }

    _addPlayerButtons() {
        const playerButtons = $(`<div class="player-buttons"></div>`);
        const resolveButton = $(`<button class="player-button"><i class="fas fa-check"></i></button>`);
        const closeButton = $(`<button class="player-button"><i class="fas fa-times"></i></button>`);
        playerButtons.append(resolveButton);
        playerButtons.append(closeButton);
        this.element.append(playerButtons);
        resolveButton.click(() => ChoicesSocket.executeForEveryone("resolve"));
        closeButton.click(() => ChoicesSocket.executeForEveryone("cancel"));
    }

    async startTimer() {
        let timerElement = $(`<div class="timer"><div class="time"></div></div>`);
        timerElement.css("font-size", game.settings.get(CONSTANTS.MODULE_ID, "timerSize") + "em");
        this.containerHTML.prepend(timerElement);
        let seconds = parseInt(this.time);
        while (seconds > 0) {
            this.element.find(".time").text(seconds);
            seconds--;
            await this.sleep(1000);
            if (!$("#choices-plus-dialog").length) {
                return;
            }
        }
        if ($("#choices-plus-dialog").length) {
            this.resolveVote();
        }
    }

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async playSound() {
        if (!game.user.isGM) {
            return;
        }
        const playListSound = RetrieveHelpers.getPlaylistSoundPathSync(this.sound, true, true);
        this.choiceSound = await AudioHelper.play({ src: playListSound, volume: 0.5, loop: true }, true);
    }

    updateChoices(userId, choicesChildIndexes) {
        const user = game.users.get(userId);
        if (!user) {
            Logger.error(`VisualNovelDialog | ${this.title} | Cannot find user by id '${userId}'`, true);
            return;
        }
        if (this.choices?.length <= 0) {
            Logger.warn(`VisualNovelDialog | ${this.title} | this.choices?.length <= 0`, false);
            if (this.fastClick) {
                API.resolveVote();
            } else {
                return;
            }
        }
        // const img = user.character?.img || user.avatar;
        const img = getUserCharacter(user)?.img || user.avatar;
        for (const [index, choiceChild] of choices.entries()) {
            const choiceChosen = choiceChild.element.find(".choice-plus-chosen");

            choiceChosen.find(`[data-userid=${userId}]`).remove();
            if (choicesChildIndexes.includes(index)) {
                choiceChild.element
                    .find(".choice-plus-chosen")
                    .append(
                        `<img src=${img} data-userid=${userId} style="background-color:${game.users.get(userId)?.color};">`,
                    );
            }
            if (choiceChild.element.find("img").length > 0) {
                choiceChosen.show();
                if (ForienEasyPollsHelpers.isFepActive()) {
                    ForienEasyPollsHelpers.sendChoice(this.pool, choiceChosen.innerText, true, userId);
                }
            } else {
                choiceChosen.hide();
                if (ForienEasyPollsHelpers.isFepActive()) {
                    ForienEasyPollsHelpers.sendChoice(this.pool, choiceChosen.innerText, false, userId);
                }
            }
        }
        if (this.fastClick) {
            API.resolveVote();
        }
    }

    async render(launchAsPlayer = false) {
        if (ForienEasyPollsHelpers.isFepActive()) {
            this.pool = await ForienEasyPollsHelpers.createEasyPoolChoice(this.title, this.choices, {
                multiple: this.democracy ? "multiple" : "single",
                results: false,
                secrets: true,
            });
        }

        if (game.user.isGM) {
            this._addGMButtons();
        } else {
            if (launchAsPlayer && this.time <= 0) {
                this._addPlayerButtons();
            }
        }
        if (this.player && !this.isPlayer()) {
            Logger.debug(`VisualNovelDialog | ${this.title} | this.player && !this.isPlayer() => true`);
            return this.close();
        }
        const _this = this;
        if (game.settings.get(CONSTANTS.MODULE_ID, "alwaysontop") || this.alwaysOnTop) {
            // this.element.css("z-index", "9999");
            // NOTE: If there is a text with linked document too let the rendering of the document
            // visible we must set the z-index from 9999 to 100
            this.element.css("z-index", "100");
        } else {
            this.element.css("width", "calc(100vw - 300px)");
            this.element.css("z-index", "30");
            this.element.css("height", "calc(100vh - 65px)"); // do not hide the hotbar (at least the default one...)
        }
        //create the title element
        let title = $(`<h1>${this.title}</h1>`);
        //create the choices element
        let choicesHTML = $(`<div id="choices-plus"></div>`);
        //setup timer
        if (this.time) {
            this.startTimer();
        }
        if (this.sound) {
            this.playSound();
        }
        if (this.img) {
            let img = $(`<img class="choices-plus-bg" src="${this.img}">`);
            this.containerHTML.append(img);
        }
        //loop through all the choices
        for (let choiceChild of this.choices) {
            let styleToAdd = `style="`;
            let hasStyleBackgroundImage = false;
            let isDisable = choiceChild.disable;
            // Colored button
            if (choiceChild.backgroundColor) {
                let styleForButtonChoice1 = `background-color: ${choiceChild.backgroundColor};`;
                styleToAdd = styleToAdd + styleForButtonChoice1;
            } else if (this.buttonColor) {
                let styleForButtonChoice1 = `background-color: ${this.buttonColor};`;
                styleToAdd = styleToAdd + styleForButtonChoice1;
            }

            if (choiceChild.backgroundImage && isValidImage(choiceChild.backgroundImage)) {
                // let styleForButtonChoice2 = `
                //   background-image: url('${choice.backgroundImage}');
                //   `;
                // styleToAdd = styleToAdd + styleForButtonChoice2;
                hasStyleBackgroundImage = true;
            }

            styleToAdd = styleToAdd + `"`;
            // NOTE: If choice.content is present the call is from the chat behavior
            //create a choice element
            let choiceChildElement;
            if (hasStyleBackgroundImage) {
                choiceChildElement = $(
                    `<div class="choice-plus choice-plus-with-background ${isDisable ? `choice-plus-disable` : ``}" ${styleToAdd}>
            ${
                choiceChild.portraits?.length > 0
                    ? `<div class="choice-plus-portraits-container">${this._renderPortraitsChoice(
                          choiceChild.portraits,
                      ).html()}</div>`
                    : ""
            }
            <div class="choice-plus-chosen"></div>
            <img
              class="choice-plus-image"
              src="${choiceChild.backgroundImage}"
              alt=""
            ></img>
            <div class="choice-plus-text">
            ${isDisable ? `<span class="crossed-out">` : ``}
            ${choiceChild.text ? choiceChild.text : choiceChild.content}
            ${isDisable ? `</span>` : ``}
            </div>
          </div>`,
                );
            } else {
                choiceChildElement = $(
                    `<div class="choice-plus ${isDisable ? `choice-plus-disable` : ``}" ${styleToAdd}>
            ${
                choiceChild.portraits?.length > 0
                    ? `<div class="choice-plus-portraits-container">${this._renderPortraitsChoice(
                          choiceChild.portraits,
                      ).html()}</div>`
                    : ""
            }
            <div class="choice-plus-chosen"></div>
            <div class="choice-plus-text">
            ${isDisable ? `<span class="crossed-out">` : ``}
            ${choiceChild.text ? choiceChild.text : choiceChild.content}
            ${isDisable ? `</span>` : ``}
            </div>
          </div>`,
                );
            }
            //add the choice element to the choices element
            choicesHTML.append(choiceChildElement);
            choiceChildElement.find(".choice-plus-chosen").hide();
            choiceChild.element = choiceChildElement;
        }
        //add the title and choices element to the dialog element
        this.containerHTML.append(title);
        // add some little textfor help to understand the choices in this dialog
        // for now support only little portion of text
        if (this.text) {
            const textHTML = await TextEditor.enrichHTML(this.text, {
                secrets: false,
                documents: true,
                async: true,
            });
            let choiceSummaryElementHTML = $(
                `<div class="choice-plus-summary" style="background-color: ${this.backgroundColor};">
          <div class="choice-plus-summary-text" style="font-size:${this.textFontSize}">${textHTML}</div>
        </div>`,
            );
            this.containerHTML.append(choiceSummaryElementHTML);
        }
        this.containerHTML.append(choicesHTML);
        //process portraits
        if (this.portraits?.length > 0) {
            const portraitsHTML = this._renderPortraits();
            this.containerHTML.append(portraitsHTML);
        }
        //add the dialog element to the body
        $("body").append(this.element);
        //setup the click event for the choices
        for (const choiceChild of this.choices) {
            choiceChild.element.click((e) => {
                const isSelected = $(e.currentTarget).hasClass("choice-plus-active");
                const isDisable = $(e.currentTarget).hasClass("choice-plus-disable");
                if (isDisable) {
                    Logger.warn(`VisualNovelDialog | ${this.title} | You cannot choose this option!`, true);
                    return;
                }
                if (!_this.multi) {
                    for (const choiceInner of _this.choices) {
                        choiceInner.element.removeClass("choice-plus-active");
                    }
                }
                $(e.currentTarget).toggleClass("choice-plus-active", isSelected);
                $(e.currentTarget).toggleClass("choice-plus-active");
                if (!_this.show) {
                    Logger.debug(
                        `VisualNovelDialog | ${this.title} | Show is disabled the active choice`,
                        false,
                        _this.choices,
                    );
                    return;
                }
                let chosenIndex = [];
                for (const [index, choiceInner] of _this.choices.entries()) {
                    if (choiceInner.element.hasClass("choice-plus-active")) {
                        chosenIndex.push(index);
                    }
                }
                ChoicesSocket.executeForEveryone("sendChoice", game.user.id, chosenIndex);
            });
        }
    }

    _renderPortraits() {
        let portraitsHTML = $(`<div class="portraits-container"></div>`);
        let images = [];

        for (let portrait of this.portraits) {
            const actor = RetrieveHelpers.getActorSync(portrait, true, true);
            // TODO add integration for token image
            let img = actor?.img || portrait;
            // Integration module theatre
            if (actor && game.modules.get("theatre")?.active) {
                const theatrePortrait = actor.getFlag("theatre", "baseinsert");
                img = theatrePortrait || img;
            }
            if (isValidImage(img)) {
                images.push(img);
            }
        }
        for (let img of images) {
            let portrait = $(`<img class="portrait-image" src="${img}">`);
            portraitsHTML.append(portrait);
        }
        //this.containerHTML.append(portraitsHTML);
        return portraitsHTML;
    }

    _renderPortraitsChoice(portraits) {
        let portraitsHTML = $(`<div class="choice-plus-portraits-container"></div>`);
        let images = [];

        for (let portrait of portraits) {
            const actor = RetrieveHelpers.getActorSync(portrait, true, true);
            // TODO add integration for token image
            let img = actor?.img || portrait;
            // Integration module theatre
            if (actor && game.modules.get("theatre")?.active) {
                const theatrePortrait = actor.getFlag("theatre", "baseinsert");
                img = theatrePortrait || img;
            }
            if (isValidImage(img)) {
                images.push(img);
            }
        }
        for (let img of images) {
            let portrait = $(`<img class="portrait-image" src="${img}">`);
            portraitsHTML.append(portrait);
        }
        //this.containerHTML.append(portraitsHTML);
        return portraitsHTML;
    }

    isPlayer() {
        const name = game.user.name;
        const id = game.user.id;
        return this.player?.includes(name) || this.player?.includes(id);
    }

    resolveVote() {
        let choiceChosen = this.choices[this.default];
        if (this.democracy) {
            //find the choice with the highest number of votes
            let max = 0;
            for (const [index, choiceChild] of this.choices.entries()) {
                const votes = choiceChild.element.find("img").length;
                if (votes > max) {
                    max = votes;
                    choiceChosen = choiceChild;
                    break;
                }
            }
        } else {
            //find the choice made by the user
            const userId = game.user.id;
            for (const [index, choiceChild] of this.choices.entries()) {
                if (choiceChild.element.find(`[data-userid=${userId}]`).length > 0) {
                    choiceChosen = choiceChild;
                    break;
                }
            }
        }
        if (choiceChosen) {
            this.resolve(choiceChosen);
        } else {
            this.resolveNull();
        }

        this.democracy ? this.outputResultMultiple() : this.outputResultSingle();

        this.close();
    }

    resolve(choiceChosen) {
        Logger.debug(`VisualNovelDialog | ${this.title} | resolve()`, choiceChosen);
        if (game.user.isGM && !this.resolveGM) {
            Logger.warn(`VisualNovelDialog | ${this.title} | The gm cannot resolve this choice`, true);
            return;
        }
        if (choiceChosen.scene) {
            Logger.debug(`VisualNovelDialog | ${this.title} | choiceChosen.scene`, choiceChosen.scene);
            const scene = RetrieveHelpers.getSceneSync(choiceChosen.scene, true, true);
            scene?.view();
        }
        if (choiceChosen.sound) {
            Logger.debug(`VisualNovelDialog | ${this.title} | choiceChosen.sound`, choiceChosen.sound);
            const playListSound = RetrieveHelpers.getPlaylistSoundPathSync(choiceChosen.sound, true, true);
            AudioHelper.play({ src: playListSound, volume: 0.5, loop: false }, false);
        }
        if (choiceChosen.chain) {
            Logger.debug(`VisualNovelDialog | ${this.title} | choiceChosen.chain`);
            API.showChoices(choiceChosen);
        }
        if (choiceChosen.macro) {
            Logger.debug(`VisualNovelDialog | ${this.title} | choiceChosen.macro`, choiceChosen.macro);
            const args = parseAsArray(choiceChosen.macro);
            runMacro(args[0], args.slice(1));
        }
    }

    resolveNull() {
        Logger.debug(`VisualNovelDialog | ${this.title} | resolveNull()`);
    }

    outputResultMultiple() {
        Logger.debug(`VisualNovelDialog | ${this.title} | outputResultMultiple()`);
        if (!this.displayResult || !game.user.isGM) {
            Logger.debug(`VisualNovelDialog | ${this.title} | !this.displayResult || !game.user.isGM => true`);
            return;
        }
        let results = [];
        for (const choiceChild of this.choices) {
            // NOTE: If choice.content is present the call is from the chat behavior
            results.push({
                content: choiceChild.text ? choiceChild.text : choiceChild.content,
                votes: choiceChild.element.find("img").length,
            });
        }
        //sort the results by votes
        results.sort((a, b) => b.votes - a.votes);
        //create chat message string
        let message = "<hr>";
        for (const result of results) {
            message += `${result.content}: ${result.votes}<hr>`;
        }
        ChatMessage.create({ content: message });
    }

    outputResultSingle() {
        Logger.debug(`VisualNovelDialog | ${this.title} | outputResultSingle()`);
        if (!this.displayResult || !game.user.isGM) {
            Logger.debug(`VisualNovelDialog | ${this.title} | !this.displayResult || !game.user.isGM  => true`);
            return;
        }
        let results = [];
        for (const choiceChild of this.choices) {
            //get user ids
            let userIds = [];
            if (choiceChild.element.find("img").length <= 0) {
                Logger.debug(`VisualNodelDialog | choice.element.find("img").length <= 0  => true`);
                userIds = [game.user.id];
            } else {
                for (const img of choiceChild.element.find("img")) {
                    const userId = $(img).data("userid");
                    userIds.push(userId);
                }
            }
            // NOTE: If choice.content is present the call is from the chat behavior
            results.push({
                content: choiceChild.text ? choiceChild.text : choiceChild.content,
                users: userIds,
            });
        }
        //create chat message string
        let message = "<hr>";
        for (const result of results) {
            let users = result.users.map((u) => {
                return game.users.get(u)?.name;
            });
            let usersMsg = users?.length > 0 ? ": " + users.join(", ") : "";
            message += `${result.content}${usersMsg}<hr>`;
        }
        ChatMessage.create({ content: message });
    }

    close() {
        Logger.debug(`VisualNovelDialog | ${this.title} | close()`);
        this.choiceSound?.stop();
        this.element.remove();
    }

    cancelVote() {
        Logger.debug(`VisualNovelDialog | ${this.title} | cancelVote()`);
        this.close();
    }
}
