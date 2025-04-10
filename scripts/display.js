export function updateWeddingInfo(data) {
    if (!data) {
        hideAllContent();
        showNoAccessMessage();
        return;
    }

    showAllContent();
    setWeddingInfo(data);
}

function setWeddingInfo(data) {
    // Update greeting
    document.querySelector('#greeting-text').textContent = data.guests.greeting;

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
        '.hero',
        '.locations-container',
        '.calendar-section',
        '.confirmation-section',
        '.flower-divider',
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
        '.hero',
        '.locations-container',
        '.calendar-section',
        '.confirmation-section',
        '.flower-divider',
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
    const welcomeText = document.querySelector('.welcome-text');
    if (welcomeText) {
        welcomeText.textContent = 'Aby zobaczyć szczegóły wydarzenia, proszę użyć kodu QR z zaproszenia.';
        welcomeText.style.color = '#95a5a6';
    }
}