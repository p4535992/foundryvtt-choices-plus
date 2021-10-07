Hooks.once('init', async function() {

});

Hooks.once('ready', async function() {

});

Hooks.on("chatMessage", (ChatLog, content)=>{
    //debugger;
    if(content.toLowerCase().startsWith("/choice")){
        const data = content.replace("/choice", "")
        ChoicesSocket.executeForEveryone("showChoices", data);
        return false;
    }
});

let ChoicesSocket;

Hooks.once("socketlib.ready", () => {
	ChoicesSocket = socketlib.registerModule("choices");
	ChoicesSocket.register("showChoices", ChoicesSocketFunctions.showChoices);
    ChoicesSocket.register("sendChoice", ChoicesSocketFunctions.sendChoice);
    ChoicesSocket.register("resolve", ChoicesSocketFunctions.resolve);
    ChoicesSocket.register("cancel", ChoicesSocketFunctions.cancel);
});

class ChoicesSocketFunctions{
    static showChoices(data){
        new VisualNovelDialog(data).render();
    }

    static sendChoice(userId, choices){
        game.VisualNovelDialog.updateChoices(userId, choices);
    }

    static resolve(){
        game.VisualNovelDialog.resolveVote();
    }

    static cancel(){
        game.VisualNovelDialog.cancelVote();
    }
}