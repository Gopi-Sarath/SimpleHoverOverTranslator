const jpRegex = /[\u3040-\u30ff\u4e00-\u9faf]+/g;

const tooltip = document.createElement("div");
tooltip.id = "translation-tooltip";
document.body.appendChild(tooltip);

function wrapJapanese(node){

  if(node.nodeType === 3){

    const text = node.nodeValue;

    if(jpRegex.test(text)){

      const span = document.createElement("span");

      span.className = "translate-me";
      span.textContent = text;

      node.replaceWith(span);

    }

  } else {

    node.childNodes.forEach(wrapJapanese);

  }

}

wrapJapanese(document.body);

document.addEventListener("mouseover", e => {

  if(e.target.classList.contains("translate-me")){

    const text = e.target.textContent;

    tooltip.textContent = "Translating...";
    tooltip.style.display = "block";

    const r = e.target.getBoundingClientRect();

    tooltip.style.left = r.left + window.scrollX + "px";
    tooltip.style.top = r.bottom + window.scrollY + 8 + "px";

    chrome.runtime.sendMessage({ text }, res => {

      if(res){
        tooltip.textContent = res.translation;
      }

    });

  }

});

document.addEventListener("mouseout", () => {

  tooltip.style.display = "none";

});
