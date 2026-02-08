chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'translate') {
        const { text } = request;

        chrome.storage.local.get(['targetLanguage'], (result) => {
            const targetLang = result.targetLanguage || 'en';
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

            fetch(url).then(res => res.json())
                .then(data => {
                    if (data && data[0]) {
                        const translatedText = data[0].map(segment => segment[0]).join('');

                        // Save to history
                        chrome.storage.local.get(['translationHistory'], (historyResult) => {
                            const history = historyResult.translationHistory || [];
                            history.push({
                                original: text,
                                translated: translatedText,
                                date: new Date().toISOString()
                            });
                            chrome.storage.local.set({ translationHistory: history });
                        });

                        sendResponse({ success: true, translation: translatedText });
                    } else {
                        sendResponse({ success: false, error: 'Invalid response format' });
                    }
                })
                .catch(error => {
                    sendResponse({ success: false, error: error.message });
                });
        });

        return true;
    }
});