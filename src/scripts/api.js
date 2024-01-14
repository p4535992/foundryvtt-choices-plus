import { error, getUserSync, parseAsArray } from "./lib/lib.js";
import { VisualNovelDialog } from "./VisualNovelDialog.js";
import { ChoicesSocket } from "./socket.js";

const API = {
  // VisualNovelDialog: {},

  async showChoices(inAttributes) {
    //ui.sidebar.collapse();
    //ui.nav.collapse();

    // This is the old chat functionality
    if (typeof inAttributes === "string" || inAttributes instanceof String) {
      new VisualNovelDialog({
        content: inAttributes.trim(),
      }).render();
    }
    // This is the old chat functionality
    else if (inAttributes.content) {
      new VisualNovelDialog({
        content: inAttributes.content,
      }).render();
      // The sharing here is done with the chat command
    } else {
      if (typeof inAttributes !== "object") {
        throw new error("showChoices | inAttributes must be of type object");
      }
      if (inAttributes.player?.length > 0) {
        const recipients = [];
        let players = parseAsArray(inAttributes.player);
        for (let userRef of players) {
          let user = getUserSync(userRef, true, true);
          if (user?.id) {
            recipients.push(user.id);
          }
        }
        ChoicesSocket.executeForUsers("render", recipients, inAttributes);
      } else {
        // If is GM execute the dialog for everyone
        if (game.user.isGM) {
          ChoicesSocket.executeForEveryone("render", inAttributes);
        }
        // If is not a gm launch the dialog for himself
        else {
          inAttributes.launchAsPlayer = true;
          if (inAttributes.player?.length > 0) {
            let players = parseAsArray(inAttributes.player);
            players.push(game.user.id);
            inAttributes.player = players;
          } else {
            inAttributes.player = [game.user.id];
          }
          this.render(inAttributes);
        }
      }
    }
  },

  async render(inAttributes) {
    if (typeof inAttributes !== "object") {
      throw new error("render | inAttributes must be of type object");
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
    });
    const launchAsPlayer = String(inAttributes.launchAsPlayer) === "true" ? true : false;
    await game.VisualNovelDialog.render(launchAsPlayer);
  },

  async sendAndUpdateChoices(inAttributes) {
    if (typeof inAttributes !== "object") {
      throw new error("sendChoice | inAttributes must be of type object");
    }
    return await game.VisualNovelDialog.updateChoices(inAttributes.userId, inAttributes.choices);
  },

  async resolveVote(inAttributes) {
    return await game.VisualNovelDialog.resolveVote();
  },

  async cancelVote(inAttributes) {
    return await game.VisualNovelDialog.cancelVote();
  },
};

export default API;
