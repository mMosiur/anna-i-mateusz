const apiBaseUrl = 'https://anna-i-mateusz.azurewebsites.net';

document.addEventListener('DOMContentLoaded', () => {
    const gears = document.querySelectorAll('.gear');

    // Add hover effect to gears
    gears.forEach(gear => {
        gear.addEventListener('mouseover', () => {
            gear.style.animation = 'spin 1s linear infinite';
        });

        gear.addEventListener('mouseout', () => {
            gear.style.animation = 'spin 4s linear infinite';
        });
    });

    fetchWeddingInfo();
});

async function fetchWeddingInfo() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const apiKey = urlParams.get('key');

        let data = null;
        if (!!apiKey) {
            // Fetch wedding info from the server
            const response = await fetch(`${apiBaseUrl}/info`, {
                headers: {
                    'X-Api-Key': apiKey
                }
            });
            if (!!response.ok) {
                data = await response.json();
            } else {
                console.error('Network response was not ok:', response.statusText);
            }
        } else {
            console.warn('No API key provided in URL');
        }
        updateWeddingInfo(data);
    } catch (error) {
        console.error('Error fetching wedding info:', error);
    }
}

function updateWeddingInfo(data) {
    if (!!data) {
        setWeddingInfo(data);
    } else {
        clearWeddingInfo();
    }
}

function setWeddingInfo(data) {
    // Update DOM with received data
    // Remove class hide
    document.querySelector('#ceremony-date-info').classList.remove('hide');
    document.querySelector('#ceremony-location-info').classList.remove('hide');
    document.querySelector('#reception-location-info').classList.remove('hide');
    document.querySelector('#phone-numbers-section').classList.remove('hide');

    document.querySelector('#welcome h1').textContent = `Cześć ${data.guestsName}!`;
    var date = new Date(data.ceremonyDateAndTime);
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var formattedDate = date.toLocaleDateString('pl-PL', options);
    var formattedTime = date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    document.querySelector('#ceremony-date-info').textContent = `${formattedDate} o ${formattedTime}`;
    document.querySelector('#ceremony-location-line-1').textContent = data.ceremonyLocationLine1;
    document.querySelector('#ceremony-location-line-2').textContent = data.ceremonyLocationLine2;
    document.querySelector('#reception-location-line-1').textContent = data.receptionLocationLine1;
    document.querySelector('#reception-location-line-2').textContent = data.receptionLocationLine2;

    // phone number with link to call
    document.querySelector('#groom-phone-number').textContent = data.groomPhoneNumber;
    document.querySelector('#groom-phone-number').href = `tel:${data.groomPhoneNumber}`;
    document.querySelector('#bride-phone-number').textContent = data.bridePhoneNumber;
    document.querySelector('#bride-phone-number').href = `tel:${data.bridePhoneNumber}`;
}

function clearWeddingInfo() {
    // Clear DOM elements
    document.querySelector('#ceremony-date-info').classList.add('hide');
    document.querySelector('#ceremony-location-info').classList.add('hide');
    document.querySelector('#reception-location-info').classList.add('hide');
    document.querySelector('#phone-numbers-section').classList.add('hide');
}

function updateCountdown() {
    const weddingDate = new Date('2025-07-12T14:00:00');
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
        document.querySelector('.countdown').innerHTML = '<h2>Właśnie bierzemy ślub! 💒</h2>';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Update DOM and reset animation if values change
    const updateIfChanged = (selector, value) => {
        const element = document.querySelector(selector);
        const newValue = String(value).padStart(2, '0');
        if (element.textContent !== newValue) {
            element.textContent = newValue;
        }
    };

    updateIfChanged('#days .number', days);
    updateIfChanged('#hours .number', hours);
    updateIfChanged('#minutes .number', minutes);
    updateIfChanged('#seconds .number', seconds);

    // Schedule next update with 16ms buffer before next second
    const ms = now.getMilliseconds();
    const delay = 1000 - ms - 16;

    // Ensure minimum delay is respected
    const actualDelay = Math.max(0, delay);

    setTimeout(() => {
        requestAnimationFrame(updateCountdown);
    }, actualDelay);
}

// Initial update
requestAnimationFrame(updateCountdown);
