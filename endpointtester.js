document.write(`
<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.2/ace.min.js"></script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  background: #ffffff;
  color: #333;
  padding: 20px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.panels {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.panel-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #666;
}

#editor {
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

#response {
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  background: #fafafa;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #333;
}

.button-container {
  display: flex;
  justify-content: center;
}

#sendBtn {
  padding: 12px 40px;
  font-size: 15px;
  font-weight: 500;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

#sendBtn:hover {
  background: #555;
}

#sendBtn:active {
  background: #222;
}

#sendBtn:disabled {
  background: #999;
  cursor: not-allowed;
}
</style>

<div class="container">
  <h1>Endpoint Tester</h1>
  <div class="panels">
    <div class="panel">
      <div class="panel-title">Request Body</div>
      <div id="editor"></div>
    </div>
    <div class="panel">
      <div class="panel-title">Response</div>
      <div id="response">Response will appear here...</div>
    </div>
  </div>
  <div class="button-container">
    <button id="sendBtn">Send Request</button>
  </div>
</div>
`);

const defaultJson = {
  type: "ContactTagUpdate",
  locationId: "owNEzpbrfBjp4weSARXD",
  versionId: "65d907b2cca7ce7d6cbd8dae",
  appId: "65d907b2cca7ce7d6cbd8dae",
  id: "r8r3HUYCrFlp8OmmuPpW",
  firstName: "Mauricio",
  lastName: "Jara",
  email: "maujaraar7@gmail.com",
  additionalEmails: [],
  phone: "+18038395112",
  additionalPhones: [],
  source: "jostens alerts",
  tags: ["manteno high school", "student"],
  country: "US",
  dateAdded: "2025-09-10T13:12:14.480Z",
  customFields: [],
  timezone: "America/New_York",
  timestamp: "2026-01-19T00:08:04.764Z",
  webhookId: "665e4b20-c56c-4c62-b60a-f17c4021a73a",
};

const editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/json");
editor.setValue(JSON.stringify(defaultJson, null, 2), -1);
editor.setOptions({
  fontSize: "13px",
  showPrintMargin: false,
  highlightActiveLine: true,
  showGutter: true,
});

const responseDiv = document.getElementById("response");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", async () => {
  const requestBody = editor.getValue();

  try {
    JSON.parse(requestBody);
  } catch (e) {
    responseDiv.textContent =
      "Error: Invalid JSON in request body\n\n" + e.message;
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";
  responseDiv.textContent = "Sending request...";

  try {
    const startTime = Date.now();
    const response = await fetch(
      "https://handletagwebhook.jacob-9f8.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      },
    );

    const duration = Date.now() - startTime;
    const responseText = await response.text();

    let output = `Status: ${response.status} ${response.statusText}\n`;
    output += `Duration: ${duration}ms\n`;
    output += `\nHeaders:\n`;
    response.headers.forEach((value, key) => {
      output += `  ${key}: ${value}\n`;
    });
    output += `\nBody:\n`;

    try {
      const jsonResponse = JSON.parse(responseText);
      output += JSON.stringify(jsonResponse, null, 2);
    } catch {
      output += responseText;
    }

    responseDiv.textContent = output;
  } catch (error) {
    responseDiv.textContent = "Error: " + error.message;
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Send Request";
  }
});
