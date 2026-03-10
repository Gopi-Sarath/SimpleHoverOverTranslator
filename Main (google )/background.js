chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request.text) return;

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=${encodeURIComponent(request.text)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // The API returns an array of segments; we join them in case of multiple sentences
      const translation = data[0].map(x => x[0]).join(' ');
      sendResponse({ translation: translation });
    })
    .catch(error => {
      console.error(error);
      sendResponse({ translation: "Translation failed" });
    });

  return true; 
});