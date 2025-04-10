const apiBaseUrl = window.location.hostname === 'annaimateusz.pl'
    ? 'https://anna-i-mateusz.azurewebsites.net'
    : 'http://localhost:5058';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize maps
    const mapToggles = document.querySelectorAll('.map-toggle');

    mapToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const mapContainer = toggle.nextElementSibling;
            const mapType = toggle.dataset.map;

            mapContainer.classList.toggle('collapsed');
            toggle.classList.toggle('active');

            // Update button text
            if (!mapContainer.classList.contains('collapsed')) {
                toggle.innerHTML = `Ukryj mapę <span class="toggle-icon">▼</span>`;
            } else {
                toggle.innerHTML = `Pokaż mapę dojazdu ${mapType === 'church' ? 'do kościoła' : 'na wesele'} <span class="toggle-icon">▼</span>`;
            }
        });
    });

    fetchWeddingInfo();
});

async function fetchWeddingInfo() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const apiKey = urlParams.get('key');

        let data = null;

        if (apiKey) {
            // Check if cached data exists
            const cacheKey = `weddingInfo_${apiKey}`;
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                data = JSON.parse(cachedData);
                console.log('Using cached data');
                updateWeddingInfo(data); // Update UI with cached data
            }

            // Fetch wedding info from the server
            const response = await fetch(`${apiBaseUrl}/info`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'X-Api-Key': apiKey
                }
            });
            if (response.ok) {
                data = await response.json();
                console.log('Fetched data from server');
                // Cache the fetched data
                localStorage.setItem(cacheKey, JSON.stringify(data));
            } else {
                console.error('Network response was not ok:', response.statusText);
            }
        } else {
            console.warn('No API key provided in URL');
        }
        updateWeddingInfo(data); // Update UI with data
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
    document.querySelector('#ceremony-location-info').classList.remove('hide');
    document.querySelector('#reception-location-info').classList.remove('hide');
    document.querySelector('#phone-numbers-section').classList.remove('hide');

    document.querySelector('#welcome h1').textContent = data.guests.greeting;
    document.querySelector('#ceremony-location-line-1').textContent = data.ceremony.locationLine1;
    document.querySelector('#ceremony-location-line-2').textContent = data.ceremony.locationLine2;
    document.querySelector('#reception-location-line-1').textContent = data.reception.locationLine1;
    document.querySelector('#reception-location-line-2').textContent = data.reception.locationLine2;

    // phone number with link to call
    document.querySelector('#groom-phone-number .phone-number').textContent = data.groomPhoneNumber;
    document.querySelector('#groom-phone-number').href = `tel:${data.groomPhoneNumber}`;
    document.querySelector('#bride-phone-number .phone-number').textContent = data.bridePhoneNumber;
    document.querySelector('#bride-phone-number').href = `tel:${data.bridePhoneNumber}`;

    document.querySelector('#reception-map-section').classList.remove('hide');
    document.querySelector('#reception-map').src = data.reception.locationMapsLink;
    document.querySelector('#church-map-section').classList.remove('hide');
    document.querySelector('#church-map').src = data.ceremony.locationMapsLink;
}

function clearWeddingInfo() {
    // Clear DOM elements
    document.querySelector('#ceremony-date-info').classList.add('hide');
    document.querySelector('#ceremony-location-info').classList.add('hide');
    document.querySelector('#reception-location-info').classList.add('hide');
    document.querySelector('#phone-numbers-section').classList.add('hide');
    document.querySelector('#reception-map-section').classList.add('hide');
    document.querySelector('#church-map-section').classList.add('hide');
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
