chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'translate') {
        const { text } = request;

        chrome.storage.local.get(['targetLanguage'], (result) => {
            const targetLang = result.targetLanguage || 'en';
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&dt=rm&dt=bd&dt=md&q=${encodeURIComponent(text)}`;

            fetch(url).then(res => res.json())
                .then(data => {
                    if (data && data[0]) {
                        const translatedText = data[0].map(segment => segment[0]).join('');

                        // Phonetic information
                        let phoneticText = '';

                        // Function to extract phonetic from data[0]
                        const extractPhonetic = (d) => {
                            if (d && d[0] && Array.isArray(d[0])) {
                                for (let i = d[0].length - 1; i >= 0; i--) {
                                    const segment = d[0][i];
                                    if (Array.isArray(segment) && segment.length >= 3 && segment[0] === null && segment[1] === null) {
                                        if (segment[3]) return segment[3];
                                        if (segment[2]) return segment[2];
                                    }
                                }
                            }
                            return '';
                        };

                        phoneticText = extractPhonetic(data);

                        // Define finalize helper
                        const finalize = () => {
                            // Save to history if unique
                            chrome.storage.local.get(['translationHistory'], (historyResult) => {
                                const history = historyResult.translationHistory || [];
                                // Check for duplicates
                                const isDuplicate = history.some(item => item.original === text && item.translated === translatedText);

                                if (!isDuplicate) {
                                    history.push({
                                        original: text,
                                        translated: translatedText,
                                        date: new Date().toISOString()
                                    });
                                    chrome.storage.local.set({ translationHistory: history });
                                }

                                sendResponse({ success: true, translation: translatedText, phonetic: phoneticText });
                            });
                        };

                        // Fallback: If no phonetic found, try to find base form in dictionary (data[1]) or definitions (data[11/12+])
                        let baseForm = '';

                        // 1. Try dictionary data (dt=bd) at index 1
                        if (!phoneticText && data[1] && Array.isArray(data[1])) {
                            for (const dictEntry of data[1]) {
                                if (Array.isArray(dictEntry) && dictEntry.length >= 4 && typeof dictEntry[3] === 'string') {
                                    const candidate = dictEntry[3];
                                    if (candidate && candidate.toLowerCase() !== text.toLowerCase()) {
                                        baseForm = candidate;
                                        break;
                                    }
                                }
                            }
                        }

                        // 2. If no base form found yet, try definitions (dt=md)
                        // Iterate through the array to find a definition-like structure
                        // Definition structure usually: [POS, [definitions...], "base_word", confidence]
                        // It often appears at higher indices
                        if (!phoneticText && !baseForm) {
                            for (let i = 2; i < data.length; i++) {
                                // Definitions block starts with a POS string like "noun", "verb" etc.
                                // data[i] is an array. data[i][0] is the first definition entry.
                                // entry format: [POS_string, definition_array, base_word_string, confidence_number]
                                if (Array.isArray(data[i]) && data[i].length > 0) {
                                    const entries = data[i];
                                    // Check if it's a definition block
                                    // We expect entries[0] to be an array or string? Usually entries is the block.
                                    // wait, data[1] is array of arrays.
                                    // data[12] is array of arrays.
                                    // data[12][0] is ["noun", [...], "child", 1]
                                    const firstEntry = entries[0];
                                    if (Array.isArray(firstEntry) && firstEntry.length >= 3 &&
                                        typeof firstEntry[0] === 'string' &&
                                        typeof firstEntry[2] === 'string' &&
                                        ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition'].includes(firstEntry[0])) {

                                        const candidate = firstEntry[2];
                                        if (candidate && candidate.toLowerCase() !== text.toLowerCase()) {
                                            baseForm = candidate;
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        // Helper to try fetching IPA from dictionaryapi.dev for English source
                        const finalizeWithIPA = () => {
                            // Only attempt if source seems to be English
                            const detectedLang = data[2]; // e.g., "en"

                            if (detectedLang === 'en') {
                                // Try fetching standard IPA
                                const wordToSearch = baseForm || text;
                                // Clean word (remove punctuation)
                                const cleanWord = wordToSearch.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();

                                fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`)
                                    .then(res => res.json())
                                    .then(dictData => {
                                        if (Array.isArray(dictData) && dictData.length > 0) {
                                            const entry = dictData[0];
                                            if (entry.phonetic) {
                                                phoneticText = entry.phonetic; // e.g. /həˈləʊ/
                                            } else if (entry.phonetics && entry.phonetics.length > 0) {
                                                const p = entry.phonetics.find(ph => ph.text);
                                                if (p) phoneticText = p.text;
                                            }
                                        }
                                        finalize();
                                    })
                                    .catch(() => finalize());
                            } else {
                                finalize();
                            }
                        };

                        if (baseForm && baseForm.toLowerCase() !== text.toLowerCase()) {
                            // Fetch phonetic for the base form from Google
                            const baseUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&dt=rm&q=${encodeURIComponent(baseForm)}`;
                            fetch(baseUrl).then(res2 => res2.json()).then(data2 => {
                                const basePhonetic = extractPhonetic(data2);
                                if (basePhonetic) {
                                    phoneticText = basePhonetic; // Use base form phonetic
                                }
                                finalizeWithIPA();
                            }).catch(() => finalizeWithIPA());
                            return; // Async handling
                        }

                        finalizeWithIPA();
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