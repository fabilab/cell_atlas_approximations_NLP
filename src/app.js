// containerBootstrap is needed for webpack and similar browser envs
// dock works in nodejs though. The hierarchy of objects is a little
// fuzzy from the nlpjs v4 docs, so let's leave this as is for now.
const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');
const modelString = require('./modelString.js');

let debug = true;


const preProcess = (utterance) => {
  // list of features with ", " -> remove the space and remove multiple spaces
  utterance = utterance.replaceAll(" and ", ",")
                       .replaceAll(",,", ",")
                       .replaceAll(", ", ",")
                       .replaceAll(/ +/g, " ");

  // cell types with space are taken care of in the corpus

  return utterance;
}


const postProcess = (response) => {
  let newEntities;

  // organism has a fallback regex, which is a little too generic
  if (response.intent.startsWith("explore.organism")) {
    newEntities = [];
    let organismEntities = []
    for (let i = 0; i < response.entities.length; i++) {
      const entity = response.entities[i];
      if (entity['entity'] === "organism") {
        if (entity["alias"] === undefined) {
          newEntities.push(entity);
        } else if (entity["option"] !== undefined) {
          newEntities.push(entity);
        }
      } else {
        newEntities.push(entity);
      }
    }
    response.entities = newEntities;
  }

  // highest expressor with a specific organ becomes average expression in that organ
  // NOTE: I tried to do this by training but it's hard, good enough for now
  if (response.intent.startsWith("highest_measurement")) {
    for (let i = 0; i < response.entities.length; i++) {
      const entity = response.entities[i];
      if (entity['entity'] == "organ") {
        response.intent = response.intent.replace("highest_measurement", "average");
        break;
      }
    }
  }

  // celltype and celltypeEnum are the same entity, it's just a hack
  let foundCelltypeEnum = false;
  for (let i = 0; i < response.entities.length; i++) {
    const entity = response.entities[i];
    if (entity['entity'] === "celltypeEnum") {
      entity['entity'] = "celltype";
      foundCelltypeEnum = true;
      break;
    }
  }
  if (foundCelltypeEnum) {
    for (let i = 0; i < response.entities.length; i++) {
      const entity = response.entities[i];
      if ((entity['entity'] == "celltype") && (entity['type'] === 'regex')) {
        response.entities.splice(i, i);
        break;
      }
    }
  }

  // Sometimes people write "radial glia cells" but they just mean "radial glia", cut " cells"
  for (let i = 0; i < response.entities.length; i++) {
    const entity = response.entities[i];
    if ((entity['entity'] == "celltype") && (entity['type'] === 'regex') && (entity['sourceText'].endsWith(" cells"))) {
      const ctlength = entity['sourceText'].length;
      entity['sourceText'] = entity['sourceText'].slice(0, ctlength - (" cells").length);
    }
  }

  // smooth muscle et al.: the "muscle" gets recognised as an organ. Fix that
  let entitiesForDeletion = [];
  newEntities = [];
  for (let i = 0; i < response.entities.length; i++) {
    const entity = response.entities[i];
    if ((entity['entity'] == "celltype") && (entity['sourceText'].includes("muscle"))) {
      entitiesForDeletion.push(["organ", "muscle"]);
      break
  } else if ((entity['entity'] == "celltype")) {
     //console.log(entity);
    }
  };
  for (let i = 0; i < response.entities.length; i++) {
    const entity = response.entities[i];
    let keep = true;
    for (let j = 0; j < entitiesForDeletion.length; j++) {
      let keyFD = entitiesForDeletion[j][0];
      let valueFD = entitiesForDeletion[j][1];
      if ((entity['entity'] == keyFD) && (entity['sourceText'] == valueFD)) {
        keep = false;
        break;
      }
    };
    if (keep)
      newEntities.push(entity);
  }
  response.entities = newEntities;
}


// This is a method class in the CommonJS module, because it needs the manager
async function ask(question) {

    // This function is only used after window.nlpManager has been set
    const manager = this.nlpManager || window.nlpManager;

    // Pre-process request (remove spaces after comma, etc)
    question = preProcess(question);

    let response = await manager.process("en", question, this.context);

    // Post-process response in a few cases
    postProcess(response);

    if (debug)
        console.log(response);

    // Check if there are slotFill, in which case the question is not complete
    if (response.slotFill) {
        return {
            complete: false,
            intent: response.intent,
            followUpQuestion: response.answer,
        };
    }

    // Otherwise, the question is complete, ready for API call by the caller
    return {
        complete: true,
        intent: response.intent,
        entities: response.entities,
    }
};


function AtlasApproxNlp(context = {}) {
  this.initialised = false;
  this.context = context;
}

AtlasApproxNlp.prototype = {
  async initialise() {
    if (this.initialised == true)
      return this;

    // Initialise nlpjs
    const container = await containerBootstrap();
    container.use(Nlp);
    container.use(LangEn);
    const manager = container.get('nlp');
    //manager.forceNER = true;
    
    // Import the model into manager
    // NOTE: this is a horrible hack, but hey
    await manager.import(modelString);

    this.nlpManager = manager;
    this.ask = ask.bind(this);

    this.initialised = true;

    return this;
  },

  reset() {
    this.context = {};
    return this;
  }
}


module.exports = {
  AtlasApproxNlp,
}
