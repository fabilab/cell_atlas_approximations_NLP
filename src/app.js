// containerBootstrap is needed for webpack and similar browser envs
// dock works in nodejs though. The hierarchy of objects is a little
// fuzzy from the nlpjs v4 docs, so let's leave this as is for now.
const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');
const modelString = require('./modelString.js');

let debug = true;


const preProcess = (utterance) => {
  // list of features with ", " -> remove the space
  utterance = utterance.replaceAll(", ", ",");

  // cell types with space require attention
  const compositeCelltypes = [
    [/(smooth|striated) muscle/i, "$1_muscle"],
    [/(\w+) progenitor/i, "$1_progenitor"],
  ];
  for (let i = 0; i < compositeCelltypes.length; i++) {
    let patterns = compositeCelltypes[i];
    utterance = utterance.replace(patterns[0], patterns[1]);
  }

  return utterance;
};


const postProcess = (response) => {
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

  let entitiesForDeletion = [];

  // smooth muscle et al.: the "muscle" gets recognised as an organ. Fix that
  for (let i = 0; i < response.entities.length; i++) {
    const entity = response.entities[i];
    if ((entity['entity'] == "celltype") && (entity['sourceText'].includes("muscle"))) {
      entitiesForDeletion.push("organ");
      break
  } else if ((entity['entity'] == "celltype")) {
     //console.log(entity);
    }
  };

  let newEntities = [];
  for (let i = 0; i < response.entities.length; i++) {
    const entity = response.entities[i];
    let keep = true;
    for (let j = 0; j < entitiesForDeletion.length; j++) {
      if (entity['entity'] == entitiesForDeletion[j]) {
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

    // Pre-process request for quirky situations (e.g. smooth muscle)
    question = preProcess(question);

    let response = await manager.process("en", question, this.context);

    // Post-process response for the same reason as above
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
