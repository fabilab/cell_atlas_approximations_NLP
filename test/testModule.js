let { AtlasApproxNlp } = require("@fabilab/atlasapprox-nlp");
let { questionsGroups } = require("./testQuestions.js");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

let nlp = new AtlasApproxNlp();

(async () => {

  await nlp.initialise();
  console.log("Module loaded");

  async function testGroup(
    questions, 
    intent,
    reset_context = false,
    debug = false,
  ) {
    if (typeof questions === 'string' || questions instanceof String) {
      questions = [questions];
    }
    if (reset_context)
      nlp.reset();

    if (debug)
      console.log("--------------------------------------------");
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      if (debug)
        console.log("question:" + question);
      // This is the response from our package, not the manager
      let response = await nlp.ask(question);
      if (response.intent != intent) {
        if (debug) {
          console.log(response);
          console.log("WRONG INTENT: not " + intent);
          console.log("--------------------------------------------");
        }
        return false;
      }
      if ((!response.complete) && (i == questions.length - 1)) {
        if (debug) {
          console.log(response);
          console.log("--------------------------------------------");
          console.log("SLOTS NOT FILLED");
        }
        return false;
      }
    }
    return true;
  }


  // Ask and answer questions
  let exit = false;
  for (let k = 0; k < questionsGroups.length; k++) {
    console.log("############################################");
    console.log("Group" + (k+1));
    // Each question group resets the context
    let context = {};
    let { questions, intent } = questionsGroups[k];
    exit = !await testGroup(questions, intent, reset_context = false, debug = true);
    if (!exit) {
      console.log("--------------------------------------------");
      console.log("OK");
    } else {
      console.log("############################################");
      break;
    }
  }

})();
