const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');

let debug = true;
const modelUrl = "https://gist.githubusercontent.com/iosonofabio/c42d91f7297c949eff0168078940af2d/raw/d3956c9e62b400a19530a5aa6bb9314b44a09683/model.nlp";

// Construct an answer given the API has provided the requested information
function buildAnswer(intent, data) {
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
        answer = "The average expression of " + data.features + " in " + data.organism + " " + data.organ + " is shown in the plot.";
    } else if (intent == "fraction_detected.geneExpression") {
        answer = "A dot plot of " + data.features + " in " + data.organism + " " + data.organ + " is shown in the plot.";
    } else if (intent == "markers.geneExpression") {
        answer = "The marker genes for " + data.celltype + " in " + data.organism + " " + data.organ + " are: " + data.markers;
    } else if (intent == "similar_features.genes") {
        answer = "The genes similar to " + data.feature + " in " + data.organism + + " " + organ + " are: " + data.similar_features;
    } else if (intent == "similar_celltypes") {
        answer = "The cell types similar to " + data.celltype + " in " + data.organism + " are: " + data.similar_celltypes;
    } else if (intent == "celltypexorgan") {
        answer = "The presence matrix of cell types in " + data.organism + " is shown in the plot.";
    }
    return answer;
}

function buildAPIParams(intent, entities) {
    // Extract endpoint from intent
    let endpoint = intent.split(".")[0];

    // Convert entities in request parameters
    let params = {};
    for (let i=0; i < entities.length; i++) {
        const entity = entities[i];
        let param;
        if (entity.type == "enum") {
            paramValue = entity.option;
        } else {
            paramValue = entity.sourceText;
        }
        // entity names and API parameter names are not exactly the same for clarity
        let paramName = entity.entity;
        if (["nFeatures", "nCelltypes"].includes(paramName))
            paramName = "number";

        params[paramName] = paramValue;
    }

    return {
        'endpoint': endpoint,
        'params': params,
    }
}

// Shortcut function to the API
async function callAPI(endpoint, params = {}) {
    // Phrase https request from params (they are all GET for now, so URI encoding suffices)
    let uri = "https://api.atlasapprox.org/v1/" + endpoint

    const uriSuffix = new URLSearchParams(params).toString();
    if (uriSuffix != "")
        uri += "?" + uriSuffix;

    if (debug)
        console.log("API URI: " + uri)

    let response = await fetch(uri);

    // Check response
    let data;
    if (!response.ok) {
        data = {
            error: "API call failed",
        }
    } else {
        // NOTE: response.body is a stream, so it can be processed only ONCE
        data = await response.json();
    }

    return data;
}

async function ask(question, context = {}) {

    // When this function is used, it's always after window.nlpManager has been set
    const manager = window.nlpManager;

    let response = await manager.process("en", question, context);

    if (debug)
        console.log(response);

    // Check if there are slotFill, in which case the question is not complete
    if (response.slotFill) {
        return {
            complete: false,
            followUpQuestion: response.answer,
        };
    }

    // Otherwise, the question is complete, ready for API call by the caller
    return {
        complete: true,
        intent: response.intent,
        entities: response.entities,
    }

    //if (debug)
    //    console.log("calling API...");

    //// Build API request parameters
    //let { endpoint, params } = buildAPIParams(response.intent, response.entities);

    //// Call API with endpoint and request parameters
    //let data = await callAPI(endpoint, params);

    //// Construct a NL answer from the data. This might be better outsourced to nlpjs.
    //const answer = buildAnswer(response.intent, data);

    //return {
    //    intent: response.intent,
    //    endpoint: endpoint,
    //    params: params,
    //    data: data,
    //    answer: answer,
    //};


    //APIAnswer.complete = true;
    //return APIAnswer;

};

// Prepare the nlp manager at loading time
(async () => {

    // Initialize nlpjs objects
    const container = await containerBootstrap();
    container.use(Nlp);
    container.use(LangEn);
    const manager = container.get('nlp');

    // Get data from URL (gist)
    let response = await fetch(modelUrl);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    let data = await response.text();
    
    // Import the model into manager
    await manager.import(data);

    window.nlpManager = manager;
    window.ask = ask;
    window.buildAPIParams = buildAPIParams;
    window.buildAnswer = buildAnswer;
})();
