
  // 1. Define the Default JSON Data
  // We format this as a string so it can be inserted into the editor
  const defaultJson = JSON.stringify({
    type: 'ContactTagUpdate',
    locationId: 'owNEzpbrfBjp4weSARXD',
    versionId: '65d907b2cca7ce7d6cbd8dae',
    appId: '65d907b2cca7ce7d6cbd8dae',
    id: 'r8r3HUYCrFlp8OmmuPpW',
    firstName: 'Mauricio',
    lastName: 'Jara',
    email: 'maujaraar7@gmail.com',
    additionalEmails: [],
    phone: '+18038395112',
    additionalPhones: [],
    source: 'jostens alerts',
    tags: ['manteno high school', 'student'],
    country: 'US',
    dateAdded: '2025-09-10T13:12:14.480Z',
    customFields: [],
    timezone: 'America/New_York',
    timestamp: '2026-01-19T00:08:04.764Z',
    webhookId: '665e4b20-c56c-4c62-b60a-f17c4021a73a',
  }, null, 2); // Indented with 2 spaces

  // 2. Define Styles and HTML Structure
  const styles = `
    <style>
      :root {
        --bg-color: #ffffff;
        --border-color: #d1d5db;
        --text-color: #374151;
        --header-text: #111827;
        --btn-bg: #f3f4f6;
        --btn-hover: #e5e7eb;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        margin: 0;
        padding: 40px;
        background-color: var(--bg-color);
        color: var(--text-color);
        height: 100vh;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }
      h1 {
        font-size: 1.5rem;
        margin-bottom: 20px;
        color: var(--header-text);
        font-weight: 500;
      }
      .workspace {
        display: flex;
        gap: 20px;
        flex: 1;
        min-height: 0; /* Important for flex child scrolling */
      }
      .panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        overflow: hidden;
      }
      .panel-header {
        background-color: #f9fafb;
        padding: 10px 15px;
        border-bottom: 1px solid var(--border-color);
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--header-text);
      }
      #editor {
        flex: 1;
        font-size: 14px;
      }
      #response-container {
        flex: 1;
        padding: 0;
        margin: 0;
        overflow: auto;
        background-color: #ffffff;
        position: relative;
      }
      #response-output {
        padding: 15px;
        margin: 0;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
        font-size: 13px;
        white-space: pre-wrap;
        color: var(--text-color);
      }
      .controls {
        margin-top: 20px;
        display: flex;
        justify-content: flex-start;
      }
      #send-btn {
        background-color: var(--btn-bg);
        border: 1px solid var(--border-color);
        color: var(--header-text);
        padding: 10px 24px;
        font-size: 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
        font-weight: 500;
      }
      #send-btn:hover {
        background-color: var(--btn-hover);
      }
      #send-btn:active {
        background-color: #d1d5db;
      }
      .status-line {
        margin-bottom: 10px;
        font-weight: bold;
        color: #000;
      }
    </style>
  `;

  const html = `
    ${styles}
    <h1>Webhook Endpoint Tester</h1>
    <div class="workspace">
      <!-- Left Panel: Request Body -->
      <div class="panel">
        <div class="panel-header">Request Body (JSON)</div>
        <div id="editor"></div>
      </div>

      <!-- Right Panel: Response -->
      <div class="panel">
        <div class="panel-header">Response</div>
        <div id="response-container">
            <pre id="response-output">Ready to send...</pre>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="controls">
      <button id="send-btn">Send POST Request</button>
    </div>
  `;

  // 3. Write HTML to Document
  document.write(html);

  // 4. Load Ace Editor Script Dynamically
  const aceScript = document.createElement('script');
  aceScript.src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.3/ace.js";
  aceScript.onload = initApp; // Run initApp when script loads
  document.head.appendChild(aceScript);

  // 5. Main Logic (Runs after Ace loads)
  function initApp() {
    // Initialize Ace Editor
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/chaos");; // Light/Neutral theme
    editor.session.setMode("ace/mode/json");
    editor.setValue(defaultJson, -1); // -1 moves cursor to start
    editor.setShowPrintMargin(false);

    // Get Elements
    const btn = document.getElementById('send-btn');
    const output = document.getElementById('response-output');
    const targetUrl = 'https://handletagwebhook.jacob-9f8.workers.dev/';

    // Handle Click
    btn.addEventListener('click', async () => {
      // UI Loading State
      btn.textContent = 'Sending...';
      btn.disabled = true;
      output.textContent = 'Sending request...';

      const requestBody = editor.getValue();

      // Validate JSON locally before sending
      try {
        JSON.parse(requestBody);
      } catch (e) {
        output.textContent = "Error: Invalid JSON in request body.\n" + e.message;
        resetButton();
        return;
      }

      try {
        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: requestBody
        });

        const statusText = `Status: ${response.status} ${response.statusText}\n\n`;
        let responseText = await response.text();

        // Try to pretty print JSON response if possible
        try {
          const jsonRes = JSON.parse(responseText);
          responseText = JSON.stringify(jsonRes, null, 2);
        } catch (e) {
          // Response wasn't JSON, keep as text
        }

        output.textContent = statusText + responseText;

      } catch (error) {
        output.textContent = "Network Error:\n" + error.message + "\n\n(Check console for CORS details if the server does not allow browser requests)";
      } finally {
        resetButton();
      }
    });

    function resetButton() {
      btn.textContent = 'Send POST Request';
      btn.disabled = false;
    }
  }
