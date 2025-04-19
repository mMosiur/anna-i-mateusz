export function updateWeddingInfo(data) {
    if (!data) {
        hideAllContent();
        showNoAccessMessage();
        return;
    }

    hideNoAccessMessage();
    showAllContent();
    setWeddingInfo(data);
}

function setWeddingInfo(data) {
    // Update greeting
    document.querySelector('#greeting-text').textContent = data.guests.greeting;

    // Update about-us section
    document.querySelector('#about-us-content-wrapper').innerHTML = data.aboutUsSection;

    // Update locations
    document.querySelector('#ceremony-location-line').textContent = data.ceremony.locationLine;
    document.querySelector('#reception-location-line').textContent = data.reception.locationLine;

    // Update maps
    document.querySelector('#reception-map').src = data.reception.locationMapsLink;
    document.querySelector('#church-map').src = data.ceremony.locationMapsLink;

    // Update phone numbers
    const groomPhone = document.querySelector('#groom-phone-number');
    groomPhone.querySelector('.phone-number').textContent = data.groomPhoneNumber;
    groomPhone.href = `tel:${data.groomPhoneNumber}`;
    const bridePhone = document.querySelector('#bride-phone-number');
    bridePhone.querySelector('.phone-number').textContent = data.bridePhoneNumber;
    bridePhone.href = `tel:${data.bridePhoneNumber}`;
}

function hideAllContent() {
    const elementsToHide = [
        '#greeting-text',
        '.welcome-text',
        '.locations-container',
        '.calendar-section',
        '.confirmation-section',
        '.flower-divider',
        '.gift-suggestions-section',
        '.about-us-section',
        '.disclaimer'
    ];

    elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.add('hide');
        });
    });
}

function showAllContent() {
    const elementsToShow = [
        '#greeting-text',
        '.welcome-text',
        '.locations-container',
        '.calendar-section',
        '.confirmation-section',
        '.flower-divider',
        '.gift-suggestions-section',
        '.about-us-section',
        '.disclaimer'
    ];

    elementsToShow.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.remove('hide');
        });
    });
}

function showNoAccessMessage() {
    const noKeyText = document.querySelector('#no-key-text');
    if (noKeyText) {
        noKeyText.textContent = 'Aby zobaczyć szczegóły wydarzenia, proszę użyć kodu QR z zaproszenia.';
        noKeyText.classList.remove('hide');
    }
}

function hideNoAccessMessage() {
    const noKeyText = document.querySelector('#no-key-text');
    if (noKeyText) {
        noKeyText.textContent = '';
        noKeyText.classList.add('hide');
    }
}
