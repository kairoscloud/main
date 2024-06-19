    // this script runs on all locations, regardless of if jostens or not
    // Note to jake: include after firebase/firestore inclusion on agency-refresh.js, but before directory.js
    // What does it do?
    //  - download list of fb locs
    //  - check if loc exists in list
    //  - if not, add entry to firebase with a new token for that location. Redownload list
    //  - check if URL has changed every 5 seconds (not urgent). If so, rerun everything

    console.log("Initializing newloc!");
    let globalLocationList = [];

    let firebaseConfig = {
        apiKey: "AIzaSyAkvl6HKgup1AofIrUU_Q7b4RlvhI2QTpc",
        authDomain: "kairos-test-eedd6.firebaseapp.com",
        projectId: "kairos-test-eedd6",
        storageBucket: "kairos-test-eedd6.appspot.com",
        messagingSenderId: "34445244935",
        appId: "1:34445244935:web:b4ed7e9be70c16251d88a2",
        measurementId: "G-M1BXTKSG3B",
    };

    let name1 = "primary" + Math.random();
    let name2 = "secondary" + Math.random();

    firebase.initializeApp(firebaseConfig, "primary");
    firebase.initializeApp(firebaseConfig, "secondary"); // Use a different name for a new instance, this forces it to update

    let prevLocationNL = "";
    let locationCheckInterval = setInterval(detectLocationChange, 5000);

    function detectLocationChange() {
        // let currentLocationNL = window.location.href.split("/")[5];
        let currentLocationNL = "vPGRw179FP3xMUXHoDWF"; // for testing
        if (currentLocationNL != prevLocationNL) {
            // if location changed
            checkIfLocationInFB();
        }
        prevLocationNL = currentLocationNL;
    }

    function checkIfLocationInFB() {
        // we encapsulate it in a function, so it doesn't interfere with firebase stuff in any other files

        let firestore = firebase.app("primary").firestore();
        // let locationNL = window.location.href.split("/")[5];
        let locationNL = "vPGRw179FP3xMUXHoDWF"; // for testing
        let agencyTokenNL = "";
        let inDB = false;

        firestore // check if location is in firebase
            .collection("tokens")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id == locationNL) {
                        inDB = true;
                    }
                    if (doc.id == "agency") {
                        agencyTokenNL = doc.data().agencyAccessToken;
                    }
                });
            })
            .then(() => {
                if (inDB == false) {
                    // if not in firebase
                    getLocationAccessToken(agencyTokenNL, locationNL).then(
                        // get a new one for the location
                        (result) => {
                            firestore.collection("tokens").doc(locationNL).set({
                                // and store it in a new entry
                                locationAccessToken: result,
                                isJostens: "false",
                            });
                        },
                    );
                }
            })
            .then(() => {
                // update global locations array. This array is for pages to check if they're a Jostens subaccount
                FBToArray();
            });

        async function getLocationAccessToken(accessTokenX, locationX) {
            const url =
                "https://services.leadconnectorhq.com/oauth/locationToken";
            const options = {
                method: "POST",
                headers: {
                    Version: "2021-07-28",
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/json",
                    Authorization: "Bearer " + accessTokenX,
                },
                body: new URLSearchParams({
                    companyId: "eRzyNWgO7fUGsvSQv7eR", // Kairos Cloud agency
                    locationId: locationX,
                }),
            };

            try {
                const response = await fetch(url, options);
                const data = await response.json();
                //console.log(data);
                return data.access_token;
            } catch (error) {
                console.error(error);
            }
        }
    }

    // puts the firebase contents into a global array
    function FBToArray() {
        setTimeout(() => {
            // allow a 1s delay for firebase to update with the new entry
            firebase
                .app("secondary")
                .firestore()
                .collection("tokens")
                .get()
                .then((querySnapshot) => {
                    const array = [];
                    querySnapshot.forEach((doc) => {
                        if (doc.id != "agency") {
                            // for all docs (except agency), add to array
                            array.push({
                                id: doc.id,
                                isJostens: doc.data().isJostens,
                            });
                        }
                    });
                    return array;
                })
                .then((array) => {
                    globalLocationList = array;
                    console.log(globalLocationList);
                });
        }, 1000);
    }
