    // This puts a single firebase object in the global scope
    // Why? Instead of creating a firebase object whenever we need it (ex. to grab an API key), we just create it once and reuse it
    // Having multiple firebase objects in the global scope has lead to many issues
    // Plus, we need firebase globally anyways to push all the telemetry data
    // JACOB TODO: Store API key as global variable so we can cut out another step
    const firebaseConfig = {
        apiKey: "AIzaSyAkvl6HKgup1AofIrUU_Q7b4RlvhI2QTpc",
        authDomain: "kairos-test-eedd6.firebaseapp.com",
        projectId: "kairos-test-eedd6",
        storageBucket: "kairos-test-eedd6.appspot.com",
        messagingSenderId: "34445244935",
        appId: "1:34445244935:web:b4ed7e9be70c16251d88a2",
        measurementId: "G-M1BXTKSG3B",
    };
    firebase.initializeApp(firebaseConfig);
    const firestore = firebase.firestore();
