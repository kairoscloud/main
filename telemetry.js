// What does it do?
// - It overrides the global console.log function, putting each message onto a stack
// - It gathers telemetry data (browser name, version, platform, etc.) to create a unique telemetryID (think of it as a tracking ID, unique to each session)
// - All browser data/settings that may be important is gathered and pushed to Firebase Firestore
// - Every 1 minute (we can change this), it pushes the log stack to Firebase. You can see it here: https://console.firebase.google.com/u/3/project/kairos-test-eedd6/firestore/databases/-default-/data/~2Ftelemetry~2FChrome-126-MacIntel-2fc67107
// - To fetch the log stack from firebase, use getLogStackFromFirebase()
// JACOB TODO: Comment this more thoroughly. Also override console.error, console.warn, etc.

    // Override console.log function
    const logStack = [];
    (function () {
        const originalLog = console.log; // keep the old console.log function, so we can still use it
        console.log = function (...args) {
            const timestamp = new Date().toLocaleTimeString("en-US", {
                hour12: false,
            });
            const message = `${timestamp}: ${args.join(" ")}`; // put a timestamp in front of the message. I thought this would probably be useful
            logStack.push(message);
            originalLog.apply(console, args);
        };
    })();

    const baseTelemetryData = getTelemetryData();
    const osInfo = `${baseTelemetryData.platform}`;
    const telemetryStartedHash = hashString(baseTelemetryData.telemetryStarted);
    const telemetryID = `${baseTelemetryData.browserName}-${baseTelemetryData.browserVersion}-${osInfo}-${telemetryStartedHash}`;
    // the telemetryID is as such: browserName-browserVersion-osInfo-hashOfStartTimestamp
    console.log("test! This is being logged in Firebase!");

    pushTelemetryDataToFirebase(getTelemetryData());
    pushLogStackToFirebase();
    setInterval(pushLogStackToFirebase(), 60000); // push every minute
    // get the logStack by using getLogStackFromFirebase()

    // Function to generate a hash of the timestamp
    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32bit integer
            hash = Math.abs(hash);
        }
        return hash.toString(16);
    }

    // Function to push telemetry data to Firebase Firestore with custom document name
    function pushTelemetryDataToFirebase(data) {
        const docName = telemetryID;

        firestore
            .collection("telemetry")
            .doc(docName)
            .set(data)
            .then(() => {})
            .catch((error) => {
                console.error(
                    "Error writing telemetry data to Firestore: ",
                    error,
                );
            });
    }

    // Function to get browser name and version
    function getBrowserInfo() {
        const ua = navigator.userAgent;
        let temp;
        let match =
            ua.match(
                /(opera|chrome|safari|firefox|msie|trident(?:\/| )?rv:?)\/?\s*(\d+)/i,
            ) || [];
        if (/trident/i.test(match[1])) {
            temp = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return { name: "IE", version: temp[1] || "" };
        }
        if (match[1] === "Chrome") {
            temp = ua.match(/\b(OPR|Edg)\/(\d+)/);
            if (temp !== null) {
                return {
                    name: temp[1]
                        .replace("OPR", "Opera")
                        .replace("Edg", "Edge"),
                    version: temp[2],
                };
            }
        }
        match = match[2]
            ? [match[1], match[2]]
            : [navigator.appName, navigator.appVersion, "-?"];
        if ((temp = ua.match(/version\/(\d+)/i)) !== null) {
            match.splice(1, 1, temp[1]);
        }
        return {
            name: match[0],
            version: match[1],
        };
    }

    // Function to gather telemetry data
    function getTelemetryData() {
        const browserInfo = getBrowserInfo();
        const telemetryData = {
            telemetryStarted: new Date().toLocaleString("en-US", {
                hour12: true,
            }),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            cookiesEnabled: navigator.cookieEnabled,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            windowSize: `${window.innerWidth}x${window.innerHeight}`,
            referrer: document.referrer,
            startingURL: window.location.href,
            javaEnabled: navigator.javaEnabled(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            colorDepth: window.screen.colorDepth,
            deviceMemory: navigator.deviceMemory || "Not available",
            hardwareConcurrency:
                navigator.hardwareConcurrency || "Not available",
            browserName: browserInfo.name,
            browserVersion: browserInfo.version,
            connectionType: navigator.connection
                ? navigator.connection.effectiveType
                : "Not available",
        };

        return telemetryData;
    }

    function pushLogStackToFirebase() {
        const timestamp = new Date().toLocaleString("en-US", { hour12: true });
        const currentUrl = window.location.href;
        const currentTitle = document.title;

        console.log("Pushing telemetry to Firebase!");
        console.log(`Timestamp: ${timestamp}`);
        console.log(`Current URL: ${currentUrl}`);
        console.log(`Title: ${currentTitle}`);

        // Convert logStack array to a single string with newlines
        const logStackString = logStack.join("\n");

        firestore
            .collection("telemetry")
            .doc(telemetryID)
            .set(
                {
                    logStack: logStackString,
                },
                { merge: true },
            )
            .then(() => {
                console.log("Telemetry data successfully pushed to Firestore!");
            })
            .catch((error) => {
                console.error(
                    "Error pushing telemetry data to Firestore: ",
                    error,
                );
            });
    }

    function retrieveLogStackFromFirebase() {
        firestore
            .collection("telemetry")
            .doc(telemetryID)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    const retrievedLogStack = data.logStack || [];
                    console.log(
                        "Retrieved logStack from Firestore:",
                        retrievedLogStack,
                    );
                    // Optionally update the local logStack or perform other actions with the retrieved data
                } else {
                    console.log("No such document found in Firestore.");
                }
            })
            .catch((error) => {
                console.error(
                    "Error retrieving logStack from Firestore:",
                    error,
                );
            });
    }
