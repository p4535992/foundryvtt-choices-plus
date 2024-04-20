import { parseAsArray, runMacro, runMacroCommand } from "./lib/lib.js";
import { VisualNovelDialog } from "./VisualNovelDialog.js";
import { ChoicesSocket } from "./socket.js";
import Logger from "./lib/Logger.js";
import { RetrieveHelpers } from "./lib/retrieve-helpers.js";
import CONSTANTS from "./constants.js";

const API = {
    // VisualNovelDialog: {},

    /**
     * The utility API method for show the choice scene
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
     * @param {Choice[]} [options.choices=null] OPTIONAL: A array of choice child, every child is a button on the choice dialog.
     * @param {Record<string,Choice>} [options.dictionaryChoices=null] PRIVATE: The internal dictionary used for the chain mechanism.
     * @returns {Promise<void>} Nothing to return.
     */
    async showChoices(options) {
        //ui.sidebar.collapse();
        //ui.nav.collapse();

        // This is the old chat functionality
        if (typeof options === "string" || options instanceof String) {
            new VisualNovelDialog({
                content: options.trim(),
            }).render();
        }
        // This is the old chat functionality
        // else if (options.content) {
        //     new VisualNovelDialog({
        //         content: options.content,
        //     }).render();
        //     // The sharing here is done with the chat command
        // }
        else if (Array.isArray(options)) {
            let objChoiceMains = options.filter((choice) => {
                return choice.main === true;
            });
            if (objChoiceMains?.length > 1) {
                Logger.error(
                    `You can't have more than a main choice on the macro. Please correct this.`,
                    true,
                    options,
                );
                return;
            }
            if (options?.length === 0) {
                Logger.error(`You must have at least a choice on the macro. Please correct this.`, true, options);
                return;
            }
            let objChoiceMain = options.find((choice) => {
                return choice.main === true;
            });
            if (!objChoiceMain) {
                // If no main is defined we get teh first of the array
                objChoiceMain = options[0];
            }
            const dictionaryChoices = {};
            for (const choice of options) {
                const id = choice.key || choice.title || null;
                if (id) {
                    dictionaryChoices[id] = choice;
                } else {
                    Logger.debug(`Attention you didn't have set a key or title for this choice`, choice);
                }
            }
            // objChoiceMain.dictionaryChoices = dictionaryChoices;
            this.showChoices(objChoiceMain);
        } else if (typeof options === "object") {
            if (options.player?.length > 0) {
                const recipients = [];
                let players = parseAsArray(options.player);
                for (let userRef of players) {
                    let user = RetrieveHelpers.getUserSync(userRef, true, true);
                    if (user?.id) {
                        recipients.push(user.id);
                    }
                }
                ChoicesSocket.executeForUsers("render", recipients, options);
            } else {
                // If is GM execute the dialog for everyone
                if (game.user.isGM) {
                    ChoicesSocket.executeForEveryone("render", options);
                }
                // If is not a gm launch the dialog for himself
                else {
                    options.launchAsPlayer = true;
                    if (options.player?.length > 0) {
                        let players = parseAsArray(options.player);
                        players.push(game.user.id);
                        options.player = players;
                    } else {
                        options.player = [game.user.id];
                    }
                    this.render(options);
                }
            }
        } else {
            throw Logger.error("showChoices | inAttributes must be of type array of choices ora single object choice");
        }
    },

    /**
     * The utility API method for show the choice scene
     * @param {Object} inAttributes
     * @param {string} [inAttributes.title] The big title for the choice.
     * @param {string} [inAttributes.text] The little (and short), summary text for the choice. NOTE: You can use html core and document link on this text.
     * @param {string} [inAttributes.key=null] OPTIONAL: The explicit key identifier to associate to this choice it used on some chain event. If not key is given by default the 'title' is used instead.
     * @param {boolean} [inAttributes.main=false] OPTIONAL: true or false, determines if current choices is the main one. usually only one choice has the main value to true, if no main is set the first choice of the array is the one launched (default false).
     * @param {boolean} [inAttributes.fastClick] OPTIONAL: true or false, determines if to resolve a choice with the click instead to click a second time on the green button on the top right (default false).
     * @param {boolean} [inAttributes.multi=false] OPTIONAL: true or false, determines if multiple choices can be selected (default false).
     * @param {number} [inAttributes.time=0] OPTIONAL: The number of seconds for make a decision (default 0).
     * @param {string} [inAttributes.img=null] OPTIONAL: the path to the image to be displayed as the background (default null).
     * @param {boolean} [inAttributes.show=true] OPTIONAL: true or false, determines if show the active choice. Working in progress for a better behavior (default true).
     * @param {string|string[]} [inAttributes.player=null] OPTIONAL: a comma separated list on a string or just a array of strings of player names, if not provided all players will get to chose. NOTE: You can use user name, or id or uuid associated to a user.
     * @param {boolean} [inAttributes.democracy=true] OPTIONAL: true or false, determine if the choice with the highest votes will be picked (if true) or resolve the choice per player (if false) (default true).
     * @param {number} [inAttributes.default=0] OPTIONAL: the default choice if no choice is made (default 0 the first choice on the list). Working in progress for a better behavior (default 0).
     * @param {boolean} [inAttributes.displayResult=true] OPTIONAL: true or false, determine if the result will be output to chat after the choice is made (default true).
     * @param {boolean} [inAttributes.resolveGM=false] OPTIONAL: true or false, determine if the resolution of the choice should run on the gm side as well (default false).
     * @param {string|string[]} [inAttributes.portraits=null] OPTIONAL: a comma separated list on a string or just a array of strings of actor names, if not provided no portrait is show. NOTE: You can use actor name, or id or uuid associated to a actor.
     * @param {string} [inAttributes.textColor="#000000eb"] OPTIONAL: apply a text color as css on the choice (default #000000eb).
     * @param {string} [inAttributes.backgroundColor="#000000ff"] OPTIONAL: apply a background color as css on the choice (default #000000ff).
     * @param {string} [inAttributes.buttonColor="#ffffffd8"] OPTIONAL: apply a button color as css on the choice (default #ffffffd8).
     * @param {string} [inAttributes.buttonHoverColor="#c8c8c8d8"] OPTIONAL: apply a button color as css when hover on the choice (default  #c8c8c8d8).
     * @param {string} [inAttributes.buttonActiveColor="#838383d8"] OPTIONAL: apply a button color as css when set active on the choice (default #838383d8).
     * @param {boolean} [inAttributes.alwaysOnTop=false] OPTIONAL: true or false, determine if the choice will be on top of all other UI elements, i set with a valid boolean value it will override the module setting 'Always on top'.
     * @param {Choice[]} [inAttributes.choices=null] OPTIONAL: A array of choice child, every child is a button on the choice dialog.
     * @param {Record<string,Choice>} [inAttributes.dictionaryChoices=null] PRIVATE: The internal dictionary used for the chain mechanism.
     * @returns {Promise<void>} Nothing to return.
     */
    async render(inAttributes) {
        if (typeof inAttributes !== "object") {
            throw Logger.error("render | inAttributes must be of type object");
        }

        // Only one choice at the time ?
        if (game.VisualNovelDialog) {
            await this.cancelVote(inAttributes);
            game.VisualNovelDialog = null;
        }

        new VisualNovelDialog({
            title: inAttributes.title,
            text: inAttributes.text,
            multi: inAttributes.multi,
            time: inAttributes.time,
            img: inAttributes.img,
            show: inAttributes.show,
            player: inAttributes.player,
            democracy: inAttributes.democracy,
            default: inAttributes.default,
            displayResult: inAttributes.displayResult,
            resolveGM: inAttributes.resolveGM,
            portraits: inAttributes.portraits,
            textcolor: inAttributes.textcolor,
            backgroundcolor: inAttributes.backgroundColor,
            buttoncolor: inAttributes.buttonColor,
            buttonhovercolor: inAttributes.buttonHoverColor,
            buttonactivecolor: inAttributes.buttonActiveColor,
            alwaysOnTop: inAttributes.alwaysOnTop,
            choices: inAttributes.choices,
            chain: inAttributes.chain,
            key: inAttributes.key,
            main: inAttributes.main,
            fastClick: inAttributes.fastClick,
            dictionaryChoices: inAttributes.dictionaryChoices,
        });
        const launchAsPlayer = String(inAttributes.launchAsPlayer) === "true" ? true : false;
        await game.VisualNovelDialog.render(launchAsPlayer);
    },

    // /**
    //  * Update the chocie with the user session
    //  * @param {Object} inAttributes
    //  * @param {string} [inAttributes.userId] The user id associate to the update.
    //  * @param {Choice[]} [inAttributes.choices] A array of choice child, every child is a button on the choice dialog.
    //  * @returns {Promise<void>} Nothing to return.
    //  */
    // async sendChoice(inAttributes) {
    //     return await this.sendAndUpdateChoices(inAttributes);
    // },

    /**
     * Update the chocie with the user session
     * @param {Object} inAttributes
     * @param {string} [inAttributes.userId] The user id associate to the update.
     * @param {Choice[]} [inAttributes.choices] A array of choice child, every child is a button on the choice dialog.
     * @returns {Promise<void>} Nothing to return.
     */
    async sendAndUpdateChoices(inAttributes) {
        if (typeof inAttributes !== "object") {
            throw Logger.error("sendChoice | inAttributes must be of type object");
        }
        if (!inAttributes.userId) {
            throw Logger.error("sendChoice | inAttributes.userId must be set");
        }
        // if (!inAttributes.choices?.length > 0) {
        //     throw Logger.error("sendChoice | inAttributes.choices must be set");
        // }
        return await game.VisualNovelDialog.updateChoices(inAttributes.userId, inAttributes.choices);
    },

    /**
     * Resolve a vote.
     * @returns {Promise<void>} Nothing to return.
     */
    async resolveVote() {
        return await game.VisualNovelDialog.resolveVote();
    },

    /**
     * Cancel a vote.
     * @returns {Promise<void>} Nothing to return.
     */
    async cancelVote() {
        return await game.VisualNovelDialog.cancelVote();
    },
};

export default API;
