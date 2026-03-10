import { pipeline, env } from "./libs/transformers.js";

env.backends.onnx.wasm.numThreads = 1;
env.allowLocalModels = false;
env.useBrowserCache = true;

let translator = null;

async function getTranslator() {

  if (!translator) {

    console.log("Loading model...");

    translator = await pipeline(
      "translation",
      "Xenova/opus-mt-ja-en"
    );

    console.log("Model ready");

  }

  return translator;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (!request.text) return;

  (async () => {

    try {

      const t = await getTranslator();

      const result = await t(request.text);

      sendResponse({
        translation: result[0].translation_text
      });

    } catch (err) {

      console.error(err);

      sendResponse({
        translation: "Translation error"
      });

    }

  })();

  return true;

});
