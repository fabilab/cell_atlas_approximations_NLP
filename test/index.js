const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');

// Construct an answer given the API has provided the requested information
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
    } else if (intent == "celltypes") {
        answer = "The cell types in " + data.organism + " " + data.organ + " are: " + _chainList(
        data.celltypes, ", ", ".");
    } else if (intent == "average.geneExpression") {
        answer = "The average expression of " + data.features + " in " + data.organism + " " + data.organ + " is: " + data.average;
    } else if (intent == "fraction_detected.geneExpression") {
        answer = "The fraction of cells expressing " + data.features + " in " + data.organism + " " + data.organ + " is: " + data.fractions;
    }
    return answer;
}

// Call the REST API for Cell Atlas Approximations and build an answer
async function callAPI(intent, entities) {
    // Convert entities in request parameters
    let params = {};
    for (let i=0; i < entities.length; i++) {
        const entity = entities[i];
        let param;
        if (entity.type == "enum") {
            param = entity.option;
        } else {
            param = entity.utteranceText;
        }
        params[entity.entity] = param;
    }

    // intent and endpoint are not exactly the same
    let endpoint = intent.split(".")[0];

    // Some verbosity for debug
    console.log("API endpoint: " + endpoint + ".");
    //console.log("Request parameters: " + JSON.stringify(params));

    // Phrase https request (they are all GET for now, so URI encoding suffices)
    const uriSuffix = new URLSearchParams(params).toString();
    const uri = "https://api.atlasapprox.org/v1/" + endpoint + "?" + uriSuffix;

    console.log("API URI: " + uri)

    let response = await fetch(uri);

    // Check response
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    // NOTE: response.body is a stream, so it can be processed only ONCE
    let data = await response.json();

    // Construct a NL answer from the data. This might be better outsourced to nlpjs.
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
        const modelUrl = "https://gist.githubusercontent.com/iosonofabio/c42d91f7297c949eff0168078940af2d/raw/6bc612f2f96925c3cd75767c949a6de58ed4ee6d/model.nlp";

        let response = await fetch(modelUrl);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        data = await response.text();
    }
    
    // Import the model into manager
    await manager.import(data);

    // Create a function to interact with the bot
    async function ask(question, context = {}) {
        let response = await manager.process("en", question, context);

        console.log(response);

        // Check if there are slotFill, in which case the question is not well posed
        if (response.slotFill) {
            return response.answer;
        }

        console.log("calling API...");
        let answer = await callAPI(response.intent, response.entities);
        response.answer = answer;

        return response.answer;
    }

    if (usingNode) {
        exports.ask = ask;
        exports.nlp = manager;
        if (process.argv.length >= 2) {
            //const question = process.argv[2];
            const context = {};
            let questionsGroups = [
                //["what cell types are available?", "in mouse", "lung"],
                ["what is the expression of Col1a1 in mouse heart"],
                //["what is the expression of Col1a1?", "in mouse", "in heart"],
            ];
            for (let k = 0; k < questionsGroups.length; k++) {
                let questions = questionsGroups[k];
                console.log("############################################");
                console.log("--------------------------------------------");
                for (let i = 0; i < questions.length; i++) {
                    let question = questions[i];
                    console.log(question);
                    console.log(await ask(question, context));
                    console.log("--------------------------------------------");
                }
                console.log("############################################");
            }

        }
    } else {
        window.ask = ask
        window.nlp = manager;
    }

})();
