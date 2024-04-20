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
        // // NOTE: If data.content is present the call is from the chat behavior
        // this.content = data.text ? data.text : data.content;
        // this._initColors(data);
        // this._getDefaults(data);

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

        this.textcolor = newOptions.textcolor;
        this.backgroundcolor = newOptions.backgroundcolor;
        this.buttoncolor = newOptions.buttoncolor;
        this.buttonhovercolor = newOptions.buttonhovercolor;
        this.buttonactivecolor = newOptions.buttonactivecolor;

        this.fastClick = newOptions.fastClick;

        const colors = {
            text: this.textcolor,
            background: this.backgroundcolor,
            button: this.buttoncolor,
            buttonHover: this.buttonhovercolor,
            buttonActive: this.buttonactivecolor,
        };
        let root = document.documentElement;
        root.style.setProperty("--choices-plus-font-color", colors.text);
        root.style.setProperty("--choices-plus-background-color", colors.background);
        root.style.setProperty("--choices-plus-button-color", colors.button);
        root.style.setProperty("--choices-plus-button-hover-color", colors.buttonHover);
        root.style.setProperty("--choices-plus-button-active-color", colors.buttonActive);

        // // NOTE: If data.content is present the call is from the chat behavior
        // if (data.content) {
        //     this._parseDataFromChat();
        // } else {
        //     this.choices = data.choices ?? [];
        // }

        // // NOTE: The title is after because the _parseData method delete that field
        // if (data.content) {
        //     this.title = this.title?.content ? this.title?.content : "Title not present";
        // } else {
        //     this.title = data.title ? data.title : "Title not present";
        //     this.text = data.text;
        // }

        this.choices = newOptions.choices;
        this.title = newOptions.title;
        this.text = newOptions.text;

        const choicesContainer = $(`<div class="choices-plus-container"></div>`);
        this.element = $(`<div id="choices-plus-dialog"></div>`);
        this.element.append(choicesContainer);
        this.containerHTML = choicesContainer;
        game.VisualNovelDialog = this;
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

    // _parseDataFromChat() {
    //     //splt the content by lines
    //     this.lines = this.content.split("\n");
    //     //remove empty lines
    //     this.lines = this.lines.filter((line) => line.length > 0);
    //     //store first line as the title
    //     this.title = this._processLineFromChat(this.lines[0]);
    //     for (let [k, v] of Object.entries(this.title)) {
    //         this[k] = v;
    //     }
    //     //remove the title from the lines
    //     this.lines.shift();
    //     //store the lines as the choices
    //     this.choices = this.lines;
    //     //process the choices
    //     this.choices = this.choices.map((choice) => this._processLineFromChat(choice));
    //     // delete this.title;
    //     delete this.lines;
    //     Logger.log("", this);
    // }

    // _processLineFromChat(line) {
    //     //match all text between square brackets
    //     let matches = line.match(/\[(.*?)\]/g);
    //     //if there are no matches, return the line
    //     if (matches === null) {
    //         return {
    //             content: line.trim(),
    //         };
    //     }
    //     //store all non matching text as the content
    //     let content = line.replace(/\[(.*?)\]/g, "");
    //     //remove leading and trailing whitespace
    //     content = content.trim();
    //     let result = {
    //         content: content,
    //     };
    //     //loop through all matches
    //     for (let match of matches) {
    //         //remove the square brackets
    //         match = match.replace(/\[|\]/g, "");
    //         //split the match by the equals sign
    //         let parts = match.split("=");
    //         //store the first part as the key
    //         let key = parts[0].toLowerCase();
    //         //store the second part as the value
    //         let value = parts[1];
    //         //add the key and value to the result
    //         result[key] = value;
    //     }
    //     return result;
    // }

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

    updateChoices(userId, choicesIndexes) {
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
        // const img = user.character?.img ?? user.avatar;
        const img = getUserCharacter(user)?.img ?? user.avatar;
        this.choices.forEach((choice, index) => {
            const choiceChosen = choice.element.find(".choice-plus-chosen");

            choiceChosen.find(`[data-userid=${userId}]`).remove();
            if (choicesIndexes.includes(index)) {
                choice.element
                    .find(".choice-plus-chosen")
                    .append(
                        `<img src=${img} data-userid=${userId} style="background-color:${game.users.get(userId)?.color};">`,
                    );
            }
            if (choice.element.find("img").length > 0) {
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
        });
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
            Logger.info(`this.player && !this.isPlayer() => true`);
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
        for (let choice of this.choices) {
            let styleToAdd = `style="`;
            let hasStyleBackgroundImage = false;
            let isDisable = choice.disable;
            if (choice.backgroundColor) {
                let styleForButtonChoice1 = `background-color: ${choice.backgroundColor};`;
                styleToAdd = styleToAdd + styleForButtonChoice1;
            }
            if (choice.backgroundImage && isValidImage(choice.backgroundImage)) {
                // let styleForButtonChoice2 = `
                //   background-image: url('${choice.backgroundImage}');
                //   `;
                // styleToAdd = styleToAdd + styleForButtonChoice2;
                hasStyleBackgroundImage = true;
            }
            styleToAdd = styleToAdd + `"`;
            // NOTE: If choice.content is present the call is from the chat behavior
            //create a choice element
            let choiceElement;
            if (hasStyleBackgroundImage) {
                choiceElement = $(
                    `<div class="choice-plus choice-plus-with-background ${isDisable ? `choice-plus-disable` : ``}" ${styleToAdd}>
            ${
                choice.portraits?.length > 0
                    ? `<div class="choice-plus-portraits-container">${this._renderPortraitsChoice(
                          choice.portraits,
                      ).html()}</div>`
                    : ""
            }
            <div class="choice-plus-chosen"></div>
            <img
              class="choice-plus-image"
              src="${choice.backgroundImage}"
              alt=""
            ></img>
            <div class="choice-plus-text">
            ${isDisable ? `<span class="crossed-out">` : ``}
            ${choice.text ? choice.text : choice.content}
            ${isDisable ? `</span>` : ``}
            </div>
          </div>`,
                );
            } else {
                choiceElement = $(
                    `<div class="choice-plus ${isDisable ? `choice-plus-disable` : ``}" ${styleToAdd}>
            ${
                choice.portraits?.length > 0
                    ? `<div class="choice-plus-portraits-container">${this._renderPortraitsChoice(
                          choice.portraits,
                      ).html()}</div>`
                    : ""
            }
            <div class="choice-plus-chosen"></div>
            <div class="choice-plus-text">
            ${isDisable ? `<span class="crossed-out">` : ``}
            ${choice.text ? choice.text : choice.content}
            ${isDisable ? `</span>` : ``}
            </div>
          </div>`,
                );
            }
            //add the choice element to the choices element
            choicesHTML.append(choiceElement);
            choiceElement.find(".choice-plus-chosen").hide();
            choice.element = choiceElement;
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
                `<div class="choice-plus-summary">
          <div class="choice-plus-summary-text">${textHTML}</div>
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
        this.choices.forEach((choice) => {
            choice.element.click((e) => {
                const isSelected = $(e.currentTarget).hasClass("choice-plus-active");
                const isDisable = $(e.currentTarget).hasClass("choice-plus-disable");
                if (isDisable) {
                    Logger.warn(`VisualNovelDialog | ${this.title} | You cannot choose this option!`, true);
                    return;
                }
                if (!_this.multi) {
                    _this.choices.forEach((choice) => choice.element.removeClass("choice-plus-active"));
                }
                $(e.currentTarget).toggleClass("choice-plus-active", isSelected);
                $(e.currentTarget).toggleClass("choice-plus-active");
                if (!_this.show) {
                    Logger.info(
                        `VisualNovelDialog | ${this.title} | Show is disabled the active choice`,
                        false,
                        _this.choices,
                    );
                    return;
                }
                let chosenIndex = [];
                _this.choices.forEach((choice, index) => {
                    if (choice.element.hasClass("choice-plus-active")) {
                        chosenIndex.push(index);
                    }
                });
                ChoicesSocket.executeForEveryone("sendChoice", game.user.id, chosenIndex);
            });
        });
    }

    _renderPortraits() {
        let portraitsHTML = $(`<div class="portraits-container"></div>`);
        let images = [];

        for (let portrait of this.portraits) {
            const actor = RetrieveHelpers.getActorSync(portrait, true, true);
            // TODO add integration for token image
            let img = actor?.img ?? portrait;
            // Integration module theatre
            if (actor && game.modules.get("theatre")?.active) {
                const theatrePortrait = actor.getFlag("theatre", "baseinsert");
                img = theatrePortrait ?? img;
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
            let img = actor?.img ?? portrait;
            // Integration module theatre
            if (actor && game.modules.get("theatre")?.active) {
                const theatrePortrait = actor.getFlag("theatre", "baseinsert");
                img = theatrePortrait ?? img;
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

    // _getDefaults(data) {
    //     this.multi = data?.multi || false;
    //     if (isRealNumber(data?.time) && data?.time > 0) {
    //         this.time = data?.time;
    //     } else {
    //         this.time = 0;
    //     }
    //     this.img = data?.img || null;
    //     this.show = data?.show || true;
    //     if (data?.player) {
    //         this.player = parseAsArray(data?.player);
    //     } else {
    //         this.player = undefined;
    //     }
    //     this.democracy = data?.democracy || true;
    //     this.default = data?.default || 0;
    //     this.displayResult = data?.displayResult || true;
    //     this.resolveGM = data?.resolveGM || false;
    //     if (data?.portraits) {
    //         this.portraits = parseAsArray(data?.portraits);
    //     } else {
    //         this.portraits = undefined;
    //     }
    //     if (isRealBoolean(data?.alwaysOnTop)) {
    //         this.alwaysOnTop = data?.alwaysOnTop;
    //     } else {
    //         this.alwaysOnTop = false;
    //     }
    // }

    // _initColors(data) {
    //     this.textcolor = data?.textcolor || game.settings.get(CONSTANTS.MODULE_ID, "textcolor");
    //     this.backgroundcolor = data?.backgroundcolor || game.settings.get(CONSTANTS.MODULE_ID, "backgroundcolor");
    //     this.buttoncolor = data?.buttoncolor || game.settings.get(CONSTANTS.MODULE_ID, "buttoncolor");
    //     this.buttonhovercolor = data?.buttonhovercolor || game.settings.get(CONSTANTS.MODULE_ID, "buttonhovercolor");
    //     this.buttonactivecolor = data?.buttonactivecolor || game.settings.get(CONSTANTS.MODULE_ID, "buttonactivecolor");

    //     const colors = {
    //         text: this.textcolor,
    //         background: this.backgroundcolor,
    //         button: this.buttoncolor,
    //         buttonHover: this.buttonhovercolor,
    //         buttonActive: this.buttonactivecolor,
    //     };
    //     let root = document.documentElement;
    //     root.style.setProperty("--choices-plus-font-color", colors.text);
    //     root.style.setProperty("--choices-plus-background-color", colors.background);
    //     root.style.setProperty("--choices-plus-button-color", colors.button);
    //     root.style.setProperty("--choices-plus-button-hover-color", colors.buttonHover);
    //     root.style.setProperty("--choices-plus-button-active-color", colors.buttonActive);
    // }

    resolveVote() {
        let choice = this.choices[this.default];
        if (this.democracy) {
            //find the choice with the highest number of votes
            let max = 0;
            this.choices.forEach((c, index) => {
                const votes = c.element.find("img").length;
                if (votes > max) {
                    max = votes;
                    choice = c;
                }
            });
        } else {
            //find the choice made by the user
            const userId = game.user.id;
            this.choices.forEach((c, index) => {
                if (c.element.find(`[data-userid=${userId}]`).length > 0) {
                    choice = c;
                }
            });
        }
        if (choice) {
            this.resolve(choice);
        } else {
            this.resolveNull();
        }

        this.democracy ? this.outputResultMultiple() : this.outputResultSingle();

        this.close();
    }

    resolve(choice) {
        if (game.user.isGM && !this.resolveGM) {
            Logger.warn("VisualNovelDialog | ${this.title} | The gm cannot resolve this choice", true);
            return;
        }
        if (choice.scene) {
            const scene = RetrieveHelpers.getSceneSync(choice.scene, true, true);
            scene?.view();
        }
        if (choice.sound) {
            const playListSound = RetrieveHelpers.getPlaylistSoundPathSync(choice.sound, true, true);
            AudioHelper.play({ src: playListSound, volume: 0.5, loop: false }, false);
        }
        if (choice.chain) {
            const c = choice;
            API.showChoices(c);
        }
        if (choice.macro) {
            const args = parseAsArray(choice.macro);
            runMacro(args[0], args.slice(1));
        }
    }

    resolveNull() {}

    outputResultMultiple() {
        if (!this.displayResult || !game.user.isGM) {
            Logger.info(`VisualNovelDialog | ${this.title} | !this.displayResult || !game.user.isGM => true`);
            return;
        }
        let results = [];
        this.choices.forEach((choice) => {
            // NOTE: If choice.content is present the call is from the chat behavior
            results.push({
                content: choice.text ? choice.text : choice.content,
                votes: choice.element.find("img").length,
            });
        });
        //sort the results by votes
        results.sort((a, b) => b.votes - a.votes);
        //create chat message string
        let message = "<hr>";
        results.forEach((result) => {
            message += `${result.content}: ${result.votes}<hr>`;
        });
        ChatMessage.create({ content: message });
    }

    outputResultSingle() {
        if (!this.displayResult || !game.user.isGM) {
            Logger.info(`VisualNovelDialog | ${this.title} | !this.displayResult || !game.user.isGM  => true`);
            return;
        }
        let results = [];
        this.choices.forEach((choice) => {
            //get user ids
            let userIds = [];
            if (choice.element.find("img").length <= 0) {
                Logger.info(`VisualNodelDialog | choice.element.find("img").length <= 0  => true`);
                userIds = [game.user.id];
            } else {
                for (const img of choice.element.find("img")) {
                    const userId = $(img).data("userid");
                    userIds.push(userId);
                }
            }
            // NOTE: If choice.content is present the call is from the chat behavior
            results.push({
                content: choice.text ? choice.text : choice.content,
                users: userIds,
            });
        });
        //create chat message string
        let message = "<hr>";
        results.forEach((result) => {
            let users = result.users.map((u) => {
                return game.users.get(u)?.name;
            });
            let usersMsg = users?.length > 0 ? ": " + users.join(", ") : "";
            message += `${result.content}${usersMsg}<hr>`;
        });
        ChatMessage.create({ content: message });
    }

    close() {
        this.choiceSound?.stop();
        this.element.remove();
    }

    cancelVote() {
        this.close();
    }
}
