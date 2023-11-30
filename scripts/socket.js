import API from "./api.js";

export let ChoicesSocket;

export function registerSocket() {

	if (ChoicesSocket) {
		return ChoicesSocket;
	}

    ChoicesSocket = socketlib.registerModule("choices");
    ChoicesSocket.register("showChoices", ChoicesSocketFunctions.showChoices);
    ChoicesSocket.register("sendChoice", ChoicesSocketFunctions.sendChoice);
    ChoicesSocket.register("resolve", ChoicesSocketFunctions.resolve);
    ChoicesSocket.register("cancel", ChoicesSocketFunctions.cancel);
    ChoicesSocket.register("render", ChoicesSocketFunctions.render);

    // Set socket
    const data = game.modules.get("choices");
    data.socket = ChoicesSocket;

	return ChoicesSocket;
}

class ChoicesSocketFunctions {
    static showChoices(data) {
      //ui.sidebar.collapse();
      //ui.nav.collapse();
    //   new VisualNovelDialog(data).render();
      API.showChoices(data)
    }
  
    static sendChoice(userId, choices) {
    //   game.VisualNovelDialog.updateChoices(userId, choices);
       API.sendAndUpdateChoices({userId:userId, choices:choices});
    }
  
    static resolve() {
    //   game.VisualNovelDialog.resolveVote();
        API.resolveVote();
    }
  
    static cancel() {
    //   game.VisualNovelDialog.cancelVote();
        API.cancelVote();
    }

    static render(data) {
      API.render(data);
    }
}