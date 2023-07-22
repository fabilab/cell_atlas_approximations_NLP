const { dockStart } = require('@nlpjs/basic');
let { questionsGroups } = require("./testQuestions.js");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

(async () => {
  const dock = await dockStart({
    settings: {
      nlp: {
        forceNER: true,
        languages: ['en'],
        corpora: ["src/corpus.json"],
      }
    },
    use: ['Basic', 'LangEn'],
  });

  const manager = dock.get('nlp');

  // Train the network
  await manager.train();


  // Create a function to interact with the bot
  async function ask(question, context = {}) {
    let response = await manager.process("en", question, context);

    let nAnswers = response.answers.length;
    if (nAnswers > 0) {
      response.answer = response.answers[getRandomInt(0, nAnswers)]["answer"];      
    }

    return response;

    // Check if there are slotFill, in which case the question is not well posed
    if (response.slotFill) {
        return response.answer;
    }

    return response.answer;
  }

  // If questions are put to the script, answer them. Otherwise use test questions
  if ((process.argv.length >= 3) && (process.argv[2] != "")) {
    questionsGroups = [
      {"questions": [process.argv[2]], "intent": process.argv[3]},
    ];
    console.log(process.argv);
  }

  async function testGroup(questions, intent, context = {}, debug = false) {
    if (typeof questions === 'string' || questions instanceof String) {
      questions = [questions];
    }
    if (debug)
      console.log("--------------------------------------------");
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      if (debug)
        console.log(question);
      let response = await ask(question, context);
      if (response.intent != intent) {
        if (debug) {
          console.log(response);
          console.log("WRONG INTENT: not " + intent);
          console.log("--------------------------------------------");
        }
        return false;
      }
      if ((response.slotFill) && (i == questions.length - 1)) {
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
    exit = !await testGroup(questions, intent, context, debug = true);
    if (!exit) {
      console.log("--------------------------------------------");
      console.log("OK");
    } else {
      console.log("############################################");
      break;
    }
  }

})();
