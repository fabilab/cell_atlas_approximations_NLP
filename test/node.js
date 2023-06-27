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
        answer = "The fraction of cells expressing " + data.features + " in " + data.organism + " " + data.organ + " is: " + data.fraction_detected;
    } else if (intent == "markers.geneExpression") {
        answer = "The marker genes for " + data.celltype + " in " + data.organism + " " + data.organ + " are: " + data.markers;
    } else if (intent == "similar_features.genes") {
        answer = "The genes similar to " + data.feature + " in " + data.organism + + " " + organ + " are: " + data.similar_features;
    } else if (intent == "similar_celltypes") {
        answer = "The cell types similar to " + data.celltype + " in " + data.organism + " are: " + data.similar_celltypes;
    } else if (intent == "celltypexorgan") {
        answer = "The presence matrix for " + data.organism + " is: " + data.detected;
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

    // Prepare nlp library
    const container = await containerBootstrap();
    container.use(Nlp);
    container.use(LangEn);
    const manager = container.get('nlp');

    // Retrieve model
    let model = require('fs').readFileSync('gists/model/model.nlp', 'utf8');
    
    // Import the model into manager
    await manager.import(model);

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

    exports.ask = ask;
    exports.nlp = manager;

    // If questions are put to the script, answer them. Otherwise use test questions
    let questionsGroups = [];
    if ((process.argv.length >= 3) && (process.argv[2] != "")) {
        questionsGroups.push([process.argv[2]]);
    } else {
        questionsGroups = [
            //["what cell types are available?", "in mouse", "lung"],
            //["what are the markers for fibroblast in mouse lung"],
            //["what is the expression of Col1a1 in mouse heart"],
            //["what is the expression of Col1a1?", "in mouse", "in heart"],
            //["what are the 10 marker genes for fibroblast in murine lung?", "10"],
            //["who expresses Col1a1", "in mouse", "lung"],
            //["show genes similar to Pecam1", "10", "in mouse lung"],
            //["show cell types like fibroblast", "in mouse", "10"],
            //["make dotplot of Col1a1,Ptprc in mouse lung"],
            ["show the presence matrix of cell types in human"],
        ];
    }

    // Ask and answer questions
    for (let k = 0; k < questionsGroups.length; k++) {
        // Each question group resets the context
        let context = {};
        let questions = questionsGroups[k];
        console.log("############################################");
        console.log("Group" + (k+1));
        console.log("--------------------------------------------");
        for (let i = 0; i < questions.length; i++) {
            let question = questions[i];
            console.log(question);
            console.log(await ask(question, context));
            console.log("--------------------------------------------");
        }
        console.log("############################################");
    }

})();
