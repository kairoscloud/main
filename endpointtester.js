// 1. Define the Default JSON Data (New Payload)
  const defaultJsonData = {
    "type": "ContactCreate",
    "locationId": "owNEzpbrfBjp4weSARXD",
    "versionId": "65d907b2cca7ce7d6cbd8dae",
    "appId": "65d907b2cca7ce7d6cbd8dae",
    "id": "OQRFtg6by4tGq3j7AUwF",
    "firstName": "Mauricio",
    "lastName": "Jara",
    "email": "maujaraar7@gmail.com",
    "phone": "+18038395112",
    "source": "jostens alerts",
    "tags": [
      "new sample campaign"
    ],
    "country": "US",
    "dateAdded": "2026-01-19T14:20:54.465Z",
    "customFields": [],
    "timezone": "America/New_York",
    "timestamp": "2026-01-19T14:21:41.282Z",
    "webhookId": "f739024f-8674-4db3-819d-627b6b0a70d6"
  };

  // 2. Define Styles and HTML Structure
  const styles = `
    <style>
      :root {
        --bg-body: #f8fafc;
        --bg-panel: #ffffff;
        --border-color: #e2e8f0;
        --text-primary: #1e293b;
        --text-secondary: #64748b;
        --accent-color: #3b82f6;
        --accent-hover: #2563eb;
        --success-bg: #dcfce7;
        --success-text: #166534;
        --error-bg: #fee2e2;
        --error-text: #991b1b;
        --font-mono: 'Menlo', 'Monaco', 'Courier New', monospace;
        --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      * { box-sizing: border-box; }
      body {
        font-family: var(--font-sans);
        margin: 0;
        padding: 0;
        background-color: var(--bg-body);
        color: var(--text-primary);
        height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 30px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      
      /* Header Section */
      header { margin-bottom: 25px; }
      h1 {
        font-size: 1.75rem;
        margin: 0 0 8px 0;
        font-weight: 700;
        letter-spacing: -0.025em;
      }
      .webhook-url {
        font-family: var(--font-mono);
        font-size: 0.9rem;
        color: var(--text-secondary);
        background: #f1f5f9;
        padding: 6px 10px;
        border-radius: 4px;
        display: inline-block;
      }

      /* Workspace Layout */
      .workspace {
        display: flex;
        gap: 20px;
        flex: 1;
        min-height: 0; /* Important for flex scrolling */
      }
      .panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: var(--bg-panel);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        overflow: hidden;
      }
      .panel-header {
        background-color: #f8fafc;
        padding: 12px 15px;
        border-bottom: 1px solid var(--border-color);
        font-weight: 600;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-secondary);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      /* Status Badge */
      .status-badge {
        font-size: 0.75rem;
        padding: 2px 8px;
        border-radius: 12px;
        font-weight: 700;
        display: none; /* Hidden by default */
      }
      .status-badge.success { background: var(--success-bg); color: var(--success-text); display: inline-block; }
      .status-badge.error { background: var(--error-bg); color: var(--error-text); display: inline-block; }

      /* Editors */
      #editor { flex: 1; font-size: 14px; }
      
      #response-container {
        flex: 1;
        overflow: auto;
        padding: 15px;
        font-family: var(--font-mono);
        font-size: 13px;
        color: var(--text-primary);
        line-height: 1.5;
        background-color: var(--bg-panel);
      }
      
      /* Response Syntax Highlighting */
      .log-line { display: block; }
      .log-error { 
        color: #ef4444; 
        font-weight: bold;
        background: #fef2f2;
        padding: 0 4px;
        border-radius: 2px;
      }

      /* Controls */
      .controls {
        margin-top: 20px;
        display: flex;
        justify-content: flex-start;
      }
      #send-btn {
        background-color: var(--accent-color);
        color: white;
        border: none;
        padding: 10px 24px;
        font-size: 0.95rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 600;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }
      #send-btn:hover { background-color: var(--accent-hover); transform: translateY(-1px); }
      #send-btn:active { transform: translateY(0); }
      #send-btn:disabled { background-color: #cbd5e1; cursor: not-allowed; transform: none; }

      /* Footer Links */
      footer {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid var(--border-color);
        display: flex;
        gap: 20px;
        font-size: 0.9rem;
        flex-wrap: wrap;
      }
      .footer-link {
        color: var(--text-secondary);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: color 0.2s;
      }
      .footer-link:hover { color: var(--accent-color); }
      .footer-link strong { font-weight: 600; color: var(--text-primary); }
    </style>
  `;

  const html = `
    ${styles}
    <div class="container">
      <header>
        <h1>Endpoint Tester</h1>
        <div class="webhook-url">https://handletagwebhook.jacob-9f8.workers.dev/</div>
      </header>

      <div class="workspace">
        <!-- Left Panel: Request Body -->
        <div class="panel">
          <div class="panel-header">Request Body (JSON)</div>
          <div id="editor"></div>
        </div>

        <!-- Right Panel: Response -->
        <div class="panel">
          <div class="panel-header">
            <span>Response</span>
            <span id="status-badge" class="status-badge"></span>
          </div>
          <div id="response-container">Ready to send...</div>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls">
        <button id="send-btn">Send POST Request</button>
      </div>

      <!-- Footer Links -->
      <footer>
        <a href="https://dash.cloudflare.com/39f813d96e6f94a26bf77d29ab28be6c/workers/services/view/handletagwebhook/production/observability/logs?workers-observability-view=invocations" target="_blank" class="footer-link">
          <strong>Observability</strong>
        </a>
        <a href="https://dash.cloudflare.com/39f813d96e6f94a26bf77d29ab28be6c/workers/services/edit/handletagwebhook/production" target="_blank" class="footer-link">
          <strong>Edit Worker</strong>
        </a>
        <a href="https://marketplace.gohighlevel.com/app-settings/65d907b2cca7ce7d6cbd8dae/version/65d907b2cca7ce7d6cbd8dae/advanced/webhooks" target="_blank" class="footer-link">
          <strong>Plug into GHL</strong>
        </a>
      </footer>
    </div>
  `;

  // 3. Write HTML to Document
  document.write(html);

  // 4. Load Ace Editor Script Dynamically
  const aceScript = document.createElement('script');
  aceScript.src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.3/ace.js";
  aceScript.onload = initApp; 
  document.head.appendChild(aceScript);

  // 5. Main Logic
  function initApp() {
    const STORAGE_KEY = 'endpoint_tester_content';
    const targetUrl = 'https://handletagwebhook.jacob-9f8.workers.dev/';

    // --- State Management (LocalStorage) ---
    let initialContent;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // Use stored if exists, otherwise default
      initialContent = stored ? stored : JSON.stringify(defaultJsonData, null, 2);
    } catch (e) {
      initialContent = JSON.stringify(defaultJsonData, null, 2);
    }

    // --- Initialize Editor ---
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/chrome"); // Clean light theme
    editor.session.setMode("ace/mode/json");
    editor.setValue(initialContent, -1);
    editor.setShowPrintMargin(false);
    editor.setOptions({
      fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
      fontSize: "13px"
    });

    // Save on change
    editor.session.on('change', () => {
      localStorage.setItem(STORAGE_KEY, editor.getValue());
    });

    // --- DOM Elements ---
    const btn = document.getElementById('send-btn');
    const responseContainer = document.getElementById('response-container');
    const statusBadge = document.getElementById('status-badge');

    // --- Formatting Logic ---
    function formatOutput(text) {
      // 1. Try to format as JSON first
      try {
        const json = JSON.parse(text);
        const prettyJson = JSON.stringify(json, null, 2);
        // If it's pure JSON, simple escape
        return `<pre style="margin:0;">${escapeHtml(prettyJson)}</pre>`;
      } catch (e) {
        // 2. If not JSON, treat as text/logs and highlight Errors
        const lines = text.split('\n');
        const formattedLines = lines.map(line => {
          const escapedLine = escapeHtml(line);
          if (line.trim().startsWith('ERROR:')) {
            return `<span class="log-line log-error">${escapedLine}</span>`;
          }
          return `<span class="log-line">${escapedLine}</span>`;
        });
        return formattedLines.join('');
      }
    }

    function escapeHtml(text) {
      if (!text) return text;
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function updateStatus(status, text) {
      statusBadge.textContent = `${status} ${text}`;
      statusBadge.style.display = 'inline-block';
      
      // 200-299 is success
      if (status >= 200 && status < 300) {
        statusBadge.className = 'status-badge success';
      } else {
        statusBadge.className = 'status-badge error';
      }
    }

    // --- Event Listener ---
    btn.addEventListener('click', async () => {
      // UI Loading State
      btn.textContent = 'Sending...';
      btn.disabled = true;
      responseContainer.innerHTML = '<span style="color:#94a3b8">Waiting for response...</span>';
      statusBadge.style.display = 'none';

      const requestBody = editor.getValue();

      // Validate JSON locally
      try {
        JSON.parse(requestBody);
      } catch (e) {
        responseContainer.innerHTML = `<span class="log-error">Error: Invalid JSON in request body.</span>\n${e.message}`;
        updateStatus(400, "Bad Request");
        resetButton();
        return;
      }

      try {
        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody
        });

        const responseText = await response.text();
        
        updateStatus(response.status, response.statusText);
        responseContainer.innerHTML = formatOutput(responseText);

      } catch (error) {
        updateStatus(0, "Network Error");
        responseContainer.innerHTML = `<span class="log-error">Network Error: ${error.message}</span>\n\n(Check console for CORS details)`;
      } finally {
        resetButton();
      }
    });

    function resetButton() {
      btn.textContent = 'Send POST Request';
      btn.disabled = false;
    }
  }
