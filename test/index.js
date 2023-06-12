const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');

function phraseAnswer(intent, data) {
    function _chainList(list, sep, end) {
        let text = "";
        for (let i=0; i < list.length; i++) {
            text += list[i];
            if (i != list.length - 1)
                text += sep;
            else
                text += end;
        }
        return text;
    }

    let answer;
    if (intent == "organisms") {
        answer = "The available organisms are: " + _chainList(
            data.organisms, ", ", ".");
    } else if (intent == "organs") {
        answer = "The available organs for " + data.organism + " are: " + _chainList(
            data.organs, ", ", ".");
        if ((data.organs.length == 1) && (data.organs[0] === "whole")) {
            answer += " The entire organism was dissociated at once and sequenced."
        }
    }
    return answer;
}

async function callAPI(intent, entities) {
    // Convert entities in request parameters
    let params = {};
    for (let i=0; i < entities.length; i++) {
        params[entities[i].entity] = entities[i].option;
    }

    // Phrase https request
    const uriSuffix = new URLSearchParams(params).toString();
    const uri = "https://api.atlasapprox.org/v1/" + intent + "?" + uriSuffix;
    let response = await fetch(uri);

    // Check response
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    let data = await response.json();
    const answer = phraseAnswer(intent, data);
    return answer;
}

(async () => {

    let usingNode = (typeof window === 'undefined');
    
    // Prepare nlp library
    const container = await containerBootstrap();
    container.use(Nlp);
    container.use(LangEn);
    const manager = container.get('nlp');

    // Retrieve model
    let data;
    if (usingNode) {
        // Get data from file
        data = require('fs').readFileSync('gists/model/model.nlp', 'utf8');
    } else {
        // Get data from URL (gist)
        const modelMockUrl = "https://gist.githubusercontent.com/iosonofabio/44f816c3ad8b82c3ccc1ba7b56906c4a/raw/e8e5bcba579ff3355923435fd88a0b62bda975ae/model.nlp";
        const modelUrl = "https://gist.githubusercontent.com/iosonofabio/c42d91f7297c949eff0168078940af2d/raw/f784bd8e77cc18706d1d8e98248106c303ed21f9/model.nlp";

        let response = await fetch(modelUrl);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        data = await response.text();
    }
    
    // Import the model into manager
    await manager.import(data);

    // Create a function to interact with the bot
    async function ask(question) {
        let response = await manager.process("en", question);
        console.log("calling API...");
        let answer = await callAPI(response.intent, response.entities);
        return answer;
    }

    if (usingNode) {
        exports.ask = ask;
        exports.nlp = manager;
        if (process.argv.length >= 2) {
            const question = process.argv[2];
            console.log(await ask(question));
        }
    } else {
        window.ask = ask
        window.nlp = manager;
    }

})();
