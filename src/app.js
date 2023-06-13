const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');

let debug = true;

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
    if (debug)
        console.log("API endpoint: " + endpoint + ".");

    // Phrase https request (they are all GET for now, so URI encoding suffices)
    const uriSuffix = new URLSearchParams(params).toString();
    const uri = "https://api.atlasapprox.org/v1/" + endpoint + "?" + uriSuffix;

    if (debug)
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

    return {
        intent: intent,
        endpoint: endpoint,
        params: params,
        data: data,
        answer: answer,
    };
}

(async () => {

    // Prepare nlp library
    const container = await containerBootstrap();
    container.use(Nlp);
    container.use(LangEn);
    const manager = container.get('nlp');

    // Get data from URL (gist)
    const modelUrl = "https://gist.githubusercontent.com/iosonofabio/c42d91f7297c949eff0168078940af2d/raw/55e6f38b8189f762518476f6d6919bde859a71ab/model.nlp";
    let response = await fetch(modelUrl);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    let data = await response.text();
    
    // Import the model into manager
    await manager.import(data);

    // Create a function to interact with the bot
    async function ask(question, context = {}) {
        let response = await manager.process("en", question, context);

        if (debug)
            console.log(response);

        // Check if there are slotFill, in which case the question is not well posed
        if (response.slotFill) {
            return {
                answer: response.answer,
                complete: false,
            };
        }

        if (debug)
            console.log("calling API...");
        let APIAnswer = await callAPI(response.intent, response.entities);
        APIAnswer.complete = true;
        response.answer = APIAnswer.answer;

        return APIAnswer;
    }

    window.ask = ask
    window.nlp = manager;

})();
