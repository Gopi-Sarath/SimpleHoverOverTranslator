const jpRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]+/g;

// 1. Create Tooltip once
const tooltip = document.createElement('div');
tooltip.id = 'translation-tooltip'; // Matches your styles.css
document.body.appendChild(tooltip);

// 2. Safer Text Wrapping
function walkAndWrap(node) {
  // Skip script, style, and editable tags
  if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(node.tagName)) return;

  if (node.nodeType === 3) { // Text node
    const text = node.nodeValue;
    if (text.trim() && jpRegex.test(text)) {
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;

      // Reset regex index for safety
      jpRegex.lastIndex = 0; 

      while ((match = jpRegex.exec(text)) !== null) {
        // Add preceding plain text
        fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
        
        // Wrap Japanese text
        const span = document.createElement('span');
        span.className = 'translate-me';
        span.textContent = match[0];
        fragment.appendChild(span);
        
        lastIndex = jpRegex.lastIndex;
      }
      // Add remaining text
      fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      node.replaceWith(fragment);
    }
  } else {
    // Convert to array to avoid "live collection" issues during replacement
    Array.from(node.childNodes).forEach(walkAndWrap);
  }
}

// 3. Optimized Hover Logic
document.addEventListener('mouseover', (e) => {
  if (e.target.classList.contains('translate-me')) {
    const word = e.target.textContent;
    
    tooltip.textContent = "Translating...";
    tooltip.style.display = 'block';
    
    // Smart Positioning
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY + 8}px`;

    chrome.runtime.sendMessage({text: word}, response => {
      if (response && response.translation) {
        tooltip.textContent = response.translation;
      } else {
        tooltip.textContent = "Error loading translation";
      }
    });
  }
});

document.addEventListener('mouseout', (e) => {
  if (e.target.classList.contains('translate-me')) {
    tooltip.style.display = 'none';
  }
});

// Run
walkAndWrap(document.body);