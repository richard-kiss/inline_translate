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

    chrome.runtime.sendMessage({ action: 'translate', text: text }, (response) => {
        if (response && response.success) {
            updateBubble(response.translation);
        } else {
            updateBubble("Error: " + (response ? response.error : "Unknown error"));
        }
    });
}

function showBubble(text, top, left) {
    removeBubble(); // Remove existing if any

    bubble = document.createElement('div');
    bubble.id = 'inline-translate-bubble';
    bubble.textContent = text;

    document.body.appendChild(bubble);

    // Send calculations to center the bubble
    const bubbleRect = bubble.getBoundingClientRect();
    const bubbleHeight = bubbleRect.height;
    const bubbleWidth = bubbleRect.width;

    bubble.style.top = `${top - bubbleHeight}px`; // Position above
    bubble.style.left = `${left - (bubbleWidth / 2)}px`; // Center horizontally
}

function updateBubble(text) {
    if (bubble) {
        bubble.textContent = text;
    }
}

function removeBubble() {
    if (bubble) {
        bubble.remove();
        bubble = null;
    }
}