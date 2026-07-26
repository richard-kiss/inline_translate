const languages = [
    { code: "af", name: "Afrikaans" },
    { code: "sq", name: "Albanian" },
    { code: "am", name: "Amharic" },
    { code: "ar", name: "Arabic" },
    { code: "hy", name: "Armenian" },
    { code: "az", name: "Azerbaijani" },
    { code: "eu", name: "Basque" },
    { code: "be", name: "Belarusian" },
    { code: "bn", name: "Bengali" },
    { code: "bs", name: "Bosnian" },
    { code: "bg", name: "Bulgarian" },
    { code: "ca", name: "Catalan" },
    { code: "ceb", name: "Cebuano" },
    { code: "ny", name: "Chichewa" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
    { code: "zh-TW", name: "Chinese (Traditional)" },
    { code: "co", name: "Corsican" },
    { code: "hr", name: "Croatian" },
    { code: "cs", name: "Czech" },
    { code: "da", name: "Danish" },
    { code: "nl", name: "Dutch" },
    { code: "en", name: "English" },
    { code: "eo", name: "Esperanto" },
    { code: "et", name: "Estonian" },
    { code: "tl", name: "Filipino" },
    { code: "fi", name: "Finnish" },
    { code: "fr", name: "French" },
    { code: "fy", name: "Frisian" },
    { code: "gl", name: "Galician" },
    { code: "ka", name: "Georgian" },
    { code: "de", name: "German" },
    { code: "el", name: "Greek" },
    { code: "gu", name: "Gujarati" },
    { code: "ht", name: "Haitian Creole" },
    { code: "ha", name: "Hausa" },
    { code: "haw", name: "Hawaiian" },
    { code: "iw", name: "Hebrew" },
    { code: "hi", name: "Hindi" },
    { code: "hmn", name: "Hmong" },
    { code: "hu", name: "Hungarian" },
    { code: "is", name: "Icelandic" },
    { code: "ig", name: "Igbo" },
    { code: "id", name: "Indonesian" },
    { code: "ga", name: "Irish" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "jw", name: "Javanese" },
    { code: "kn", name: "Kannada" },
    { code: "kk", name: "Kazakh" },
    { code: "km", name: "Khmer" },
    { code: "ko", name: "Korean" },
    { code: "ku", name: "Kurdish (Kurmanji)" },
    { code: "ky", name: "Kyrgyz" },
    { code: "lo", name: "Lao" },
    { code: "la", name: "Latin" },
    { code: "lv", name: "Latvian" },
    { code: "lt", name: "Lithuanian" },
    { code: "lb", name: "Luxembourgish" },
    { code: "mk", name: "Macedonian" },
    { code: "mg", name: "Malagasy" },
    { code: "ms", name: "Malay" },
    { code: "ml", name: "Malayalam" },
    { code: "mt", name: "Maltese" },
    { code: "mi", name: "Maori" },
    { code: "mr", name: "Marathi" },
    { code: "mn", name: "Mongolian" },
    { code: "my", name: "Myanmar (Burmese)" },
    { code: "ne", name: "Nepali" },
    { code: "no", name: "Norwegian" },
    { code: "ps", name: "Pashto" },
    { code: "fa", name: "Persian" },
    { code: "pl", name: "Polish" },
    { code: "pt", name: "Portuguese" },
    { code: "pa", name: "Punjabi" },
    { code: "ro", name: "Romanian" },
    { code: "ru", name: "Russian" },
    { code: "sm", name: "Samoan" },
    { code: "gd", name: "Scots Gaelic" },
    { code: "sr", name: "Serbian" },
    { code: "st", name: "Sesotho" },
    { code: "sn", name: "Shona" },
    { code: "sd", name: "Sindhi" },
    { code: "si", name: "Sinhala" },
    { code: "sk", name: "Slovak" },
    { code: "sl", name: "Slovenian" },
    { code: "so", name: "Somali" },
    { code: "es", name: "Spanish" },
    { code: "su", name: "Sundanese" },
    { code: "sw", name: "Swahili" },
    { code: "sv", name: "Swedish" },
    { code: "tg", name: "Tajik" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "th", name: "Thai" },
    { code: "tr", name: "Turkish" },
    { code: "uk", name: "Ukrainian" },
    { code: "ur", name: "Urdu" },
    { code: "uz", name: "Uzbek" },
    { code: "vi", name: "Vietnamese" },
    { code: "cy", name: "Welsh" },
    { code: "xh", name: "Xhosa" },
    { code: "yi", name: "Yiddish" },
    { code: "yo", name: "Yoruba" },
    { code: "zu", name: "Zulu" }
];

document.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.getElementById('exportBtn');
    const clearBtn = document.getElementById('clearBtn');
    const statsDiv = document.getElementById('stats');
    const targetLangSelect = document.getElementById('targetLang');
    const addWordForm = document.getElementById('addWordForm');
    const manualWordsList = document.getElementById('manualWordsList');

    // Populate languages
    targetLangSelect.innerHTML = '';
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        targetLangSelect.appendChild(option);
    });

    // Load and display manual words
    const loadManualWords = () => {
        chrome.storage.local.get(['manualWords'], (result) => {
            const manualWords = result.manualWords || [];
            manualWordsList.innerHTML = '';

            if (manualWords.length === 0) {
                manualWordsList.innerHTML = '<p style="color: #999; font-size: 12px; margin: 0;">No manual words added yet.</p>';
                return;
            }

            manualWords.forEach((word) => {
                const wordDiv = document.createElement('div');
                wordDiv.className = 'manual-word-item';
                wordDiv.innerHTML = `
                    <div class="word-text">
                        <div>
                            <div class="word-source">${escapeHtml(word.source)}</div>
                            <div class="word-translation">${escapeHtml(word.translation)}</div>
                        </div>
                    </div>
                    ${word.phonetic ? `<div class="word-phonetic">${escapeHtml(word.phonetic)}</div>` : ''}
                `;
                manualWordsList.appendChild(wordDiv);
            });
        });
    };

    // Helper to escape HTML
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    // Load saved settings
    const updateStats = () => {
        chrome.storage.local.get(['translationHistory', 'targetLanguage', 'manualWords'], (result) => {
            const history = result.translationHistory || [];
            const manualWords = result.manualWords || [];
            const totalItems = history.length + manualWords.length;
            statsDiv.textContent = `Collected items: ${totalItems} (Auto: ${history.length}, Manual: ${manualWords.length})`;

            // Set from storage if available, else default to English
            if (result.targetLanguage) {
                targetLangSelect.value = result.targetLanguage;
            } else {
                targetLangSelect.value = 'en';
                chrome.storage.local.set({ targetLanguage: 'en' });
            }
        });
    };

    // Save on change
    targetLangSelect.addEventListener('change', () => {
        chrome.storage.local.set({ targetLanguage: targetLangSelect.value });
    });

    // Handle form submission
    addWordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const sourceWord = document.getElementById('sourceWord').value.trim();
        const translatedWord = document.getElementById('translatedWord').value.trim();
        const phoneticWord = document.getElementById('phoneticWord').value.trim();

        if (!sourceWord || !translatedWord) {
            alert('Please fill in both source and translation fields.');
            return;
        }

        chrome.storage.local.get(['manualWords'], (result) => {
            const manualWords = result.manualWords || [];

            // Check for duplicates
            const isDuplicate = manualWords.some(word =>
                word.source.toLowerCase() === sourceWord.toLowerCase() &&
                word.translation.toLowerCase() === translatedWord.toLowerCase()
            );

            if (isDuplicate) {
                alert('This word/phrase already exists in your collection.');
                return;
            }

            manualWords.push({
                source: sourceWord,
                translation: translatedWord,
                phonetic: phoneticWord || '',
                date: new Date().toISOString()
            });

            chrome.storage.local.set({ manualWords }, () => {
                // Clear form
                addWordForm.reset();
                loadManualWords();
                updateStats();
            });
        });
    });

    updateStats();
    loadManualWords();

    exportBtn.addEventListener('click', () => {
        chrome.storage.local.get(['translationHistory', 'manualWords'], (result) => {
            const history = result.translationHistory || [];
            const manualWords = result.manualWords || [];

            if (history.length === 0 && manualWords.length === 0) {
                statsDiv.textContent = "No history to export.";
                setTimeout(updateStats, 2000);
                return;
            }

            let markdown = '# Translation History\n\n';
            markdown += '## Auto-Collected Translations\n\n';
            markdown += '| Original | Translation | Date |\n';
            markdown += '| --- | --- | --- |\n';

            history.forEach(item => {
                const original = (item.original || '').replace(/[\r\n]+/g, ' ').replace(/\|/g, '\\|');
                const translated = (item.translated || '').replace(/[\r\n]+/g, ' ').replace(/\|/g, '\\|');
                const date = new Date(item.date).toLocaleString();
                markdown += `| ${original} | ${translated} | ${date} |\n`;
            });

            if (manualWords.length > 0) {
                markdown += '\n## Manually Added Words\n\n';
                markdown += '| Original | Translation | Phonetic | Date |\n';
                markdown += '| --- | --- | --- | --- |\n';

                manualWords.forEach(item => {
                    const original = (item.source || '').replace(/[\r\n]+/g, ' ').replace(/\|/g, '\\|');
                    const translated = (item.translation || '').replace(/[\r\n]+/g, ' ').replace(/\|/g, '\\|');
                    const phonetic = (item.phonetic || '').replace(/[\r\n]+/g, ' ').replace(/\|/g, '\\|');
                    const date = new Date(item.date).toLocaleString();
                    markdown += `| ${original} | ${translated} | ${phonetic} | ${date} |\n`;
                });
            }

            const blob = new Blob([markdown], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'word_collection.md';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    });

    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all collected words?')) {
            chrome.storage.local.set({ translationHistory: [] }, () => {
                updateStats();
                statsDiv.textContent = "History cleared.";
                setTimeout(updateStats, 2000);
            });
        }
    });
});