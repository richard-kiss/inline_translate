# Inline Translator

Translate selected text inline and collect/export your translation history.

## Usage

1. **Select Text**: Highlight any text on a webpage.
2. **Trigger Translation**: Hold the **Alt** key (on Windows/Linux) or the **Option** key (on macOS) while selecting usage.
   - *Note*: You must be holding the key when you release the mouse button.
3. **View Translation**: A small bubble will appear above the text with the translation.
4. **Manage History**: Click the extension icon to view your word collection, export history, or clear it.

## Configuration

Click the extension icon in the toolbar to access settings:
- **Target Language**: Choose your preferred language for translation.

## Fair Usage & API Limitations

This extension utilizes a public Google Translate API endpoint (`client=gtx`) that is generally intended for internal or low-volume use.

*   **Rate Limiting**: Excessive usage in a short period may result in temporary IP blocks or request failures (HTTP 429 Too Many Requests).
*   **Intended Use**: This tool is designed for personal, lightweight translation tasks (e.g., learning new words, occasional sentence translation). It is not suitable for bulk translation or heavy automated usage.
*   **Privacy**: While the extension only sends the selected text to Google for translation, please be aware of Google's terms of service regarding data usage when using their services.

## Installation

1. Clone this repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked**.
5. Select the directory containing the extension files (`manifest.json`, `background.js`, etc.).

## Contributing

I cannot provide official support or fixes, but Pull Requests are welcome! Please feel free to submit a PR if you'd like to contribute.

## Disclaimer

This software is provided "as is", without warranty of any kind. The author is not responsible for any damages that may arise from the use of this extension.
