let bubble = null;

document.addEventListener('mouseup', (event) => {
    // Only proceed if Alt key (Option on macOS) is held down
    if (!event.altKey) {
        removeBubble();
        return;
    }

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 0) {
        // Get the position for the bubble
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Calculate absolute position including scroll
        const top = rect.top + window.scrollY - 10; // 10px above the selection
        const left = rect.left + window.scrollX + (rect.width / 2);

        translateAndShow(selectedText, top, left);
    } else {
        removeBubble();
    }
});

// Also close on simple click without alt, or keydown
document.addEventListener('mousedown', (event) => {
    if (bubble && !bubble.contains(event.target)) {
        removeBubble();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        removeBubble();
    }
});

function translateAndShow(text, top, left) {
    showBubble("Translating...", top, left);

    // Check if chrome.runtime is available
    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
        try {
            chrome.runtime.sendMessage({ action: 'translate', text: text }, (response) => {
                if (chrome.runtime.lastError) {
                    updateBubble("Error: " + chrome.runtime.lastError.message);
                    return;
                }
                if (response && response.success) {
                    updateBubble(response.translation, response.phonetic);
                } else {
                    updateBubble("Error: " + (response ? response.error : "Unknown error"));
                }
            });
        } catch (error) {
            updateBubble("Error: Connection lost. Please reload the page.");
        }
    } else {
        updateBubble("Error: Extension context invalidated. Reload page.");
    }
}

function showBubble(text, top, left) {
    removeBubble(); // Remove existing if any

    bubble = document.createElement('div');
    bubble.id = 'inline-translate-bubble';
    bubble.style.position = 'absolute';
    bubble.style.zIndex = '10000';
    bubble.style.backgroundColor = 'white';
    bubble.style.border = '1px solid #ccc';
    bubble.style.padding = '8px';
    bubble.style.borderRadius = '4px';
    bubble.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    bubble.style.maxWidth = '300px';
    bubble.style.fontFamily = 'Arial, sans-serif';
    bubble.style.fontSize = '14px';
    bubble.style.color = '#333';

    // Initial simple text content
    bubble.textContent = text;

    document.body.appendChild(bubble);

    // Send calculations to center the bubble
    const bubbleRect = bubble.getBoundingClientRect();
    const bubbleHeight = bubbleRect.height;
    const bubbleWidth = bubbleRect.width;

    bubble.style.top = `${top - bubbleHeight}px`; // Position above
    bubble.style.left = `${left - (bubbleWidth / 2)}px`; // Center horizontally
}

function updateBubble(translation, phonetic) {
    if (bubble) {
        // Clear current content
        bubble.innerHTML = '';
        bubble.style.color = '#333';

        // Container for translation
        const translationDiv = document.createElement('div');
        translationDiv.style.marginBottom = '5px';
        translationDiv.textContent = translation;
        bubble.appendChild(translationDiv);

        // If we have phonetic text
        if (phonetic) {
            const extraInfoDiv = document.createElement('div');
            extraInfoDiv.style.display = 'flex';
            extraInfoDiv.style.alignItems = 'center';
            extraInfoDiv.style.gap = '8px';
            extraInfoDiv.style.fontSize = '0.9em';
            extraInfoDiv.style.color = '#666';
            extraInfoDiv.style.borderTop = '1px solid #eee';
            extraInfoDiv.style.paddingTop = '4px';

            const phoneticSpan = document.createElement('span');
            phoneticSpan.textContent = `[ ${phonetic} ]`;
            phoneticSpan.style.fontStyle = 'italic';
            extraInfoDiv.appendChild(phoneticSpan);

            bubble.appendChild(extraInfoDiv);
        }
    }
}

function removeBubble() {
    if (bubble) {
        bubble.remove();
        bubble = null;
    }
}