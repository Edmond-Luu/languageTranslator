const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const selectTag = document.querySelectorAll("select");
const switchIcon = document.querySelector(".switch");
const translateBtn = document.querySelector("button");
const icons = document.querySelectorAll(".row i");
const speedFrom = document.querySelector("#speedFrom");
const speedTo = document.querySelector("#speedTo");
const speakFromBtn = document.querySelector("#fromSpeech");
const speakToBtn = document.querySelector("#toSpeech");


selectTag.forEach((tag, id) => {
    for (const country_code in countries) {
        let selected;
        if (id == 0 && country_code == "en-GB") {
            selected = "selected";
        } else if (id == 1 && country_code == "ru-RU") {
            selected = "selected";
        }
        let language = countries[country_code];
        let option = `<option value="${country_code}" ${selected}>${language}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

switchIcon.addEventListener("click", () => {
    let tempText = fromText.value;
    let tempSel = selectTag[0].value;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempSel;
    fromText.value = toText.value;
    toText.value = tempText;
});

translateBtn.addEventListener("click", () => {
    let text = fromText.value;
    translateFrom = selectTag[0].value;
    translateTo = selectTag[1].value;
    if (!text) return;
    toText.setAttribute("placeholder", "Translating...")
    let apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`
    fetch(apiURL).then(res => res.json())
        .then(data => {
            toText.value = data.responseData.translatedText;
            toText.setAttribute("placeholder", "Translation");
        });
});


icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (target.classList.contains("bi-clipboard-fill")) {
            if (target.id == "fromCopy") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {

            let utterance;
            let rateFrom = speedFrom.value;
            let rateTo = speedTo.value;
            if (target.id == "fromSpeech") {
                if (speechSynthesis.speaking) {
                    speechSynthesis.cancel(); //This will stop all speech if the speech button is pressed while it is talking.
                } else {
                    utterance = new SpeechSynthesisUtterance(fromText.value);
                    utterance.rate = rateFrom;
                    utterance.lang = selectTag[0].value;
                }
            } else {
                if (speechSynthesis.speaking) {
                    speechSynthesis.cancel(); //This will stop all speech if the speech button is pressed while it is talking.
                } else {
                    utterance = new SpeechSynthesisUtterance(toText.value);
                    utterance.rate = rateTo;
                    utterance.lang = selectTag[1].value;
                }
            }
            speechSynthesis.speak(utterance);
        }
    });
});
