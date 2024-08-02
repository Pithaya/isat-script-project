const customElementName = 'text-translated';

class Translated extends HTMLElement {

    originalText = this.innerText;

    constructor() {
        super();
    }
  
    connectedCallback() {
        this.innerHTML = '';
    }
}

customElements.define(customElementName, Translated);

/**
 * Change the current language.
 * @param {string} lang Either 'ja' or 'en'.
 */
function changeLang(lang){
    i18next.changeLanguage(lang);
}

/**
 * Update all localized texts.
 */
function updateLocalizedTexts() {
    const elements = document.querySelectorAll(customElementName);

    for(const element of elements) {
        element.textContent = i18next.t(element.originalText);
    }
}

async function initializeLocalization() {
    // Get japanese translations
    const fetchResult = await fetch("./i18n/isat/ja.json");
    const json = await fetchResult.json();

    await i18next.init({
        lng: 'ja',
        ns: ['translations'],
        defaultNS: 'translations',
        debug: true,
        nsSeparator: false,
        keySeparator: false,
        fallbackLng: false,
        resources: {
            ja: {
                translations: {
                    ...json
                }
            }
        }
    });

    i18next.on('languageChanged', function(lng) {
        updateLocalizedTexts();
    });
    
    // Update once after init
    updateLocalizedTexts();
}

initializeLocalization();