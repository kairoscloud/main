let urlparams = new URLSearchParams(window.location.search);
let txtHome = urlparams.get("text_home");
let campaignID = urlparams.get("campaignID");
let locationID = urlparams.get("locationID");
console.log("Campaign ID: " + campaignID);

let button = document.querySelector(".btn.btn-dark.button-element");
button.addEventListener("click", processClick);

init();
async function init() {
  console.log("Fetching campaign data...");
  let response = await fetch(
    `https://getcampaign.jacob-9f8.workers.dev/?locationID=${locationID}&campaignID=${campaignID}`,
  );
  window.campaignData = await response.json();
  let data = window.campaignData;
  console.log("Fetched campaign data:", data);

  // find-replace all instances of [[custom_field]] in the DOM HTML with their corresponding campaign data. Use this key:
  // [[school_name]] -> schoolName
  // [[school_location]] -> schoolLocation
  // [[school_mascot]] -> mascot
  // [[school_logo_link]] -> schoolLogoLink
  // [[jostens_website_link]] -> jostensWebsiteLink
  // [[landing_page_1]] -> landingPage1
  // [[landing_page_2]] -> landingPage2
  // [[order_due_date]] -> orderDueDate
  // [[campaign_name]] -> name
  let replacements = {
    "[[school_name]]": data.schoolName,
    "[[school_location]]": data.schoolLocation,
    "[[mascot]]": data.mascot,
    "[[school_logo_link]]": data.schoolLogo,
    "[[jostens_website_link]]": data.jostensWebsiteLink,
    "[[landing_page_1]]": data.landingPage1,
    "[[landing_page_2]]": data.landingPage2,
    "[[order_due_date]]": data.orderDueDate,
    "[[campaign_name]]": data.name,
  };
  // replace all instances of these in the DOM with their campaign data
  let elements = document.getElementsByTagName("*");
  for (let element of elements) {
    // Check and replace in attributes (e.g. links, images)
    for (let attr of element.attributes) {
      if (attr.value.includes("[[") || attr.value.includes("%5B%5B")) {
        let val = attr.value.replace(/%5B%5B/g, "[[").replace(/%5D%5D/g, "]]");
        for (let [key, value] of Object.entries(replacements)) {
          val = val.split(key).join(value || "");
        }
        attr.value = val;
      }
    }

    // Check and replace in text nodes
    for (let node of element.childNodes) {
      if (node.nodeType === 3 && node.nodeValue.includes("[[")) {
        let text = node.nodeValue;
        for (let [key, value] of Object.entries(replacements)) {
          text = text.split(key).join(value || "");
        }
        node.nodeValue = text;
      }
    }
  }
}

async function processClick() {
  if (!document.getElementsByName("terms_and_conditions")[0]?.checked) {
    return;
  }
  console.log("clicked");
  let firstName = document.getElementsByName("first_name")[0]?.value;
  let lastName = document.getElementsByName("last_name")[0]?.value;
  let name = firstName + " " + lastName;
  let email = document.getElementsByName("email")[0]?.value;
  let phone = removeAllNonNumericChars(
    document.getElementsByName("phone")[0]?.value,
  );

  let data = window.campaignData;

  let campaignName = data.name;
  let orderDueDate = data.orderDueDate;
  let jostensWebsiteLink = data.jostensWebsiteLink;
  let lastUpdated = data.lastUpdated;
  let landingPage1 = data.landingPage1;
  let landingPage2 = data.landingPage2;
  let schoolName = data.schoolName;
  let mascot = data.mascot;
  let schoolLocation = data.schoolLocation;
  let schoolLogoLink = data.schoolLogoLink;

  txtHome = txtHome
    .replace("_name_", name)
    .replace("_email_", email)
    .replace("_phone_", phone)
    .replace("_campaignName_", campaignName)
    .replace("_orderDueDate_", orderDueDate)
    .replace("_jostensWebsiteLink_", jostensWebsiteLink)
    .replace("_lastUpdated_", lastUpdated)
    .replace("_landingPage1_", landingPage1)
    .replace("_landingPage2_", landingPage2)
    .replace("_schoolName_", schoolName)
    .replace("_mascot_", mascot)
    .replace("_schoolLocation_", schoolLocation)
    .replace("_schoolLogoLink_", schoolLogoLink);

  console.log("Captured params:");
  let capturedParams = {
    name: name,
    email: email,
    phone: phone,
    orderDueDate: orderDueDate,
    jostensWebsiteLink: jostensWebsiteLink,
    lastUpdated: lastUpdated,
    landingPage1: landingPage1,
    landingPage2: landingPage2,
    schoolName: schoolName,
    mascot: mascot,
    schoolLocation: schoolLocation,
    schoolLogoLink: schoolLogoLink,
  };
  console.log(JSON.stringify(capturedParams, null, 2));

  console.log("Button clicked!");
  // insert phone number into text message
  txtHome =
    "sms:" +
    phone +
    "?&body=" +
    encodeSmsBody(txtHome.replace("sms:?&body=", ""));
  console.log("Text Home: " + txtHome);
  window.location.href = txtHome;
  //sms:{{phone}}?&body=Our class met with Jostens today about our grad products. I'm bringing the grad packet home tonight. Please watch the short "How-To" videos below. It includes everything we need to know to order my grad products.%0a%0aGRAD ORDER DUE DATE: {{order_due_date}}%0a%0aWatch the videos by clicking the link or mascot below:%0a%0a{{landing_page_2}}
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function encodeSmsBody(template) {
  return (
    encodeURIComponent(template)
      .replace(/\r\n|\r|\n/g, "\n")
      .replace(/%0A/g, "%0D%0A")
      // replace &, =, and ? with their encoded values
      .replace(/&/g, "%26")
      .replace(/=/g, "%3D")
      .replace(/\?/g, "%3F")
  );
}

function removeAllNonNumericChars(str) {
  return str.replace(/\D/g, "");
}
