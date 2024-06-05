// DOM Import
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
var id = Math.random().toString(36).slice(2, 7);
var src = "https://fiverr.ghlbranding.com/drewderose/app.js?" + id;
script.setAttribute("id", "fiverr-custom-code");
script.src= src;
head.appendChild(script);

// RAW Code
import "./style.css";

const watcher = (selector, wait = 5, time = 300) =>
  new Promise((resolve) => {
    let count = 0;
    const max = 50;
    const location = window.location.href;
    const watch = setInterval(() => {
      const query = document.querySelectorAll(selector);
      if (query.length > 0) {
        count++;
      }
      if (count > wait) {
        clearInterval(watch);
        return resolve(query[0]);
      }
      if (count > max) {
        clearInterval(watch);
        throw "Maximum number of try exceeded";
      }
      if (location !== window.location.href) {
        clearInterval(watch);
        throw "Page has been changed";
      }
    }, time);
  });

const isAvailableContactListPage = () => {
  watcher(".bulk-actions-list", 8)
    .then(() => {
      addContactListPageButton(
        { title: "Paste School Settings", icon: "fas fa-paste" },
        () => {
          addTag("paste");
        }
      );
      addContactListPageButton(
        { title: "Copy School Settings", icon: "fas fa-copy" },
        () => {
          addTag("copy");
        }
      );
      addContactListPageButton(
        { title: "Add school Contact", icon: "fas fa-school" },
        () => {
          document.querySelector('[title="Add School Contact"]').click();
        }
      );

      watcher(".hl_controls--left button", 4)
        .then(() => {
          const buttons = document.querySelectorAll(
            ".hl_controls--left button"
          );
          buttons.forEach((element) => {
            element.addEventListener("click", (e) => {
              const parentElement = element.closest("span");
              const title = (
                parentElement.getAttribute("data-original-title") ??
                parentElement.getAttribute("title") ??
                ""
              ).trim();
              const proceed = [
                "Add to Campaign / Workflow",
                "Send SMS",
                "Send Email",
                "Send Review Requests",
              ];
              if (proceed.includes(title)) {
                watcher(".modal.fade.show", 1, 150).then(() => {
                  watcher(".modal-buttons .d-inline-flex button", 2).then(
                    (btn) => btn.click()
                  );
                });
                watcher(".py-1.text-nowrap", 1, 100).then((node) => {
                  node.setAttribute("style", "display: none !important;");
                  node.nextSibling.setAttribute(
                    "style",
                    "visibility: hidden !important;height: 1px !important;"
                  );
                  node.nextSibling
                    .querySelector("input")
                    .setAttribute("value", "Add to Campaign / Workflow");
                    node.nextSibling
                      .querySelector('input')
                      .dispatchEvent(
                        new MouseEvent("input", { bubbles: true }));
                });
              }
              const input = ["Add Tag", "Remove Tag"];
              if (input.includes(title)) {
                watcher(".vfm.vfm--inset.vfm--fixed:not(.hidden)", 1, 150).then(
                  () => {
                    watcher('[name="action"]', 1, 100).then((inp) => {
                      inp
                        .closest(".mt-2")
                        .querySelector("label")
                        .setAttribute("style", "display: none !important;");
                      inp.setAttribute(
                        "style",
                        "visibility: hidden !important;height: 1px !important;"
                      );
                      inp.setAttribute("value", "Add to Campaign / Workflow");
                      inp.dispatchEvent(
                        new MouseEvent("input", { bubbles: true })
                      );
                    });
                  }
                );
              }
            });
          });
        })
        .catch((error) => {
          logger(error);
        });
    })
    .catch((error) => {
      logger(error);
    });
};

const insertTextIntoExample = (text) => {
  document.querySelector(".text-gray-600.hl-text-sm-regular").innerText = text;
  document.getElementsByClassName(
    "custom-hidden items-center justify-start group-hover:flex"
  )[0].style.display = "none";
};

const isAvailableContactDetailPage = () => {
  watcher(
    '.hl_contact-details-new--wrap [protected_name="school_info"]',
    1,
    300
  )
    .then((node) => {
      console.clear();
      try {
        const fname = document.querySelector(
          '.hl_contact-details-new--wrap form [data-label="first name"] input'
        ).value;
        const lname = document.querySelector(
          '.hl_contact-details-new--wrap form [data-label="last name"] input'
        ).value;
        if (
          fname.toLowerCase().includes("school") ||
          lname.toLowerCase().includes("contact")
        ) {
          document.body.classList.add("schoolContact");
          node.click();
          window.ShortURL =
            document.getElementsByName("contact.short_url")[0]?.value;
          watcher(`[data-id="button_1701800376469"]`, 1, 100).then((btn) => {
            btn.addEventListener("click", () => {
              try {
                window.open(
                  window.ShortURL.toString().includes("http")
                    ? window.ShortURL
                    : "https://" + window.ShortURL
                );
              } catch (error) {
                console.log(window.ShortURL, error);
              }
            });
          });
          watcher(`[data-id="button_1708538695853"]`, 1, 100).then((btn) => {
            const schoolNmae = document.getElementsByName(
              "contact.school_name"
            );
            if (schoolNmae && schoolNmae.length > 0) {
              let oldUrl = btn.getAttribute("link") ?? "";
              const link = oldUrl.replace(
                "SCHOOL_NAME",
                encodeURIComponent(schoolNmae[0].value)
              );
              btn.setAttribute("link", link);
            }
          });
        }
      } catch (error) {}
    })
    .catch((error) => {
      logger(error);
    });
};

const isAvailableMessagingUsecase = () => {
  const nodes = document.querySelectorAll("#FormMessagingUsecase textarea");
  nodes[0].value =
    "This campaign will be used by our Jostens sales team to reach out to families who are ordering High School supplies for their students, including caps & gowns, class rings, letterman jackets, and more.";
  nodes[1].value =
    "Hi John! This is YOUR_NAME from Jostens. It's time to order graduation products for your Senior! Please take a moment and click the link below to watch a few short videos to learn about the ordering process! Click here: jostens.co/freestate. Reply STOP to unsubscribe.";
  nodes[2].value =
    "Hi Jane! This is YOUR_NAME from Jostens. It's time to start thinking about class rings for your Student! Please be watching your texts and email for more info in the days to come. Text or call me anytime with questions at YOUR_PHONE. Reply STOP to unsubscribe.";

  // Use Case Description example buttons
  document
    .getElementById("ExampleUsecaseDescription")
    .addEventListener("click", (e) => {
      insertTextIntoExample(
        "This campaign will be used by our Jostens sales team to reach out to families who are ordering High School supplies for their students, including caps & gowns, class rings, letterman jackets, and more."
      );
      document.querySelectorAll("#CopyTextBlock")[1].style.display = "none";
      document.querySelectorAll("#CopyTextBlock")[2].style.display = "none";
    });
  document
    .getElementById("ExampleSampleMessage1")
    .addEventListener("click", (e) => {
      insertTextIntoExample(
        "Hi John! This is YOUR_NAME from Jostens. It's time to order graduation products for your Senior! Please take a moment and click the link below to watch a few short videos to learn about the ordering process! Click here: jostens.co/freestate. Reply STOP to unsubscribe."
      );
      document.querySelectorAll("#CopyTextBlock")[1].style.display = "none";
    });
  document
    .getElementById("ExampleSampleMessage2")
    .addEventListener("click", (e) => {
      insertTextIntoExample(
        "Hi Jane! This is YOUR_NAME from Jostens. It's time to start thinking about class rings for your Student! Please be watching your texts and email for more info in the days to come. Text or call me anytime with questions at YOUR_PHONE. Reply STOP to unsubscribe."
      );
      document.querySelectorAll("#CopyTextBlock")[1].style.display = "none";
    });
};

const isAvailableExampleUserConsent = () => {
  document
    .getElementById("ExampleUserConsent")
    .addEventListener("click", (e) => {
      insertTextIntoExample(
        "End users opt-in through a form on our website (jostens.co/contact-form) or by personally providing us with their contact details after reviewing the consent language on our website. New contacts agree to receive order notifications & promotional messages from us when providing their contact details online, in-person, or otherwise. Additionally end users can also text START to YOUR_PHONE."
      );
    });
  document
    .getElementById("ExampleOptInMessage")
    .addEventListener("click", (e) => {
      insertTextIntoExample(
        "You have successfully opted-in to receive notification and promotional SMS from Jostens. Please reply STOP if you need to Opt-out in the future."
      );
    });
  watcher("#InputMessageConsent textarea", 1, 300).then((node) => {
    node.value =
      "End users opt-in through a form on our website (jostens.co/contact-form) or by personally providing us with their contact details after reviewing the consent language on our website. New contacts agree to receive order notifications & promotional messages from us when providing their contact details online, in-person, or otherwise. Additionally end users can also text START to YOUR_PHONE.";
    node.dispatchEvent(new Event("input", { bubbles: true }));
    node.dispatchEvent(new Event("change", { bubbles: true }));
  });
  watcher("#InputOptInMessage textarea", 1, 300).then((node) => {
    node.value =
      "You have successfully opted-in to receive notification and promotional SMS from Jostens. Please reply STOP if you need to Opt-out in the future.";
    node.dispatchEvent(new Event("input", { bubbles: true }));
    node.dispatchEvent(new Event("change", { bubbles: true }));
  });
};

const runObserver = () => {
  if (!document.body.classList.contains("jostensdem")) {
    return;
  }
  if (document.body.classList.contains("schoolContact")) {
    document.body.classList.remove("schoolContact");
  }

  // Contact Lists
  if (window.location.href.includes("/contacts/smart_list/All")) {
    const watcher = setInterval(() => {
      const classes = document.querySelectorAll(
        ".hl_controls.hl_smartlists--controls"
      );
      if (classes.length > 0) {
        isAvailableContactListPage();
        clearInterval(watcher);
      }
    }, 400);
  }

  // Contact Detail
  if (window.location.href.includes("/contacts/detail")) {
    const watcher = setInterval(() => {
      const wrapper = document.querySelector(".hl_contact-details-new--wrap");
      if (wrapper) {
        isAvailableContactDetailPage();
        clearInterval(watcher);
      }
    }, 400);
  }

  // Settings
  if (window.location.href.includes("settings/phone_number?tab=trust-center")) {
    const watcher = setInterval(() => {
      const MessagingUsecase = document.getElementById("FormMessagingUsecase");
      if (MessagingUsecase) {
        isAvailableMessagingUsecase();
        clearInterval(watcher);
      }
    }, 400);
    const watcher2 = setInterval(() => {
      const MessagingUsecase = document.getElementById("ExampleUserConsent");
      if (MessagingUsecase) {
        isAvailableExampleUserConsent();
        clearInterval(watcher2);
      }
    }, 400);
  }
};

window.addEventListener("routeChangeEvent", (e) => {
  runObserver();
});

runObserver();

const addTag = (action) => {
  watcher('[title="Add Tag"] button')
    .then((tagNode) => {
      document.body.classList.add("hide-tag-modal");
      tagNode.click();
      tagNode.dispatchEvent(new Event("click", { bubbles: true }));
    })
    .then(() => {
      watcher('.vfm.vfm--inset.vfm--fixed [placeholder="Add Tags"]').then(
        async (newTagNode) => {
          newTagNode.setAttribute(
            "value",
            action === "paste" ? "paste" : "copy"
          );
          newTagNode.dispatchEvent(new Event("input", { bubbles: true }));
          watcher('.vfm.vfm--inset.vfm--fixed ul li[role="option"]')
            .then((node) => {
              node.click();
              node.dispatchEvent(new Event("click", { bubbles: true }));
            })
            .then(() => {
              let actionInput = document.querySelector(
                '.vfm.vfm--inset.vfm--fixed [name="action"]'
              );
              actionInput.value =
                action === "paste"
                  ? "Paste school settings"
                  : "Copy school settings";
              actionInput.dispatchEvent(new Event("input", { bubbles: true }));
              const submitBtn = document.querySelector(
                ".vfm.vfm--inset.vfm--fixed div.flex-shrink-0 > button"
              );
              submitBtn.click();
              submitBtn.dispatchEvent(new Event("click", { bubbles: true }));
              setTimeout(() => {
                document.body.classList.remove("hide-tag-modal");
              }, 2000);
            });
        }
      );
    })
    .catch((error) => {
      logger(error);
    });
};

const addContactListPageButton = ({ title, icon }, callback) => {
  const id = title.replace(/a-zA-Z0-9\s/g, "-");
  const cloneNode = document
    .querySelectorAll(".bulk-actions-list span[data-tooltip='tooltip']")[0]
    .cloneNode(true);
  removeDataVAttributes(cloneNode);

  cloneNode.setAttribute("title", title);
  cloneNode.querySelector("button").setAttribute("data-original-title", title);
  cloneNode.querySelector("i").setAttribute("class", icon);
  cloneNode.querySelector("button").addEventListener("click", callback);
  cloneNode.setAttribute("id", id);
  cloneNode.classList.add("tp");
  const tip = document.createElement("span");
  tip.setAttribute("class", "tooltip");
  tip.innerText = title;
  tip.setAttribute(
    "style",
    "position:absolute; top:18.5%; left:8%; display:none;"
  );
  cloneNode.insertBefore(tip, cloneNode.children[0]);

  var list = document.getElementsByClassName("bulk-actions-list")[0];
  list.insertBefore(cloneNode, list.children[0]);
};

function removeDataVAttributes(node) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    var attributes = node.attributes;
    for (var i = 0; i < attributes.length; i++) {
      var attributeName = attributes[i].name;
      if (attributeName.startsWith("data-v")) {
        node.removeAttribute(attributeName);
      }
    }
    var children = node.childNodes;
    for (var j = 0; j < children.length; j++) {
      removeDataVAttributes(children[j]);
    }
  }
}
