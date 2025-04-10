import { fetchWeddingInfo } from './api.js';
import { downloadCalendar } from './calendar.js';
import { startCountdown } from './countdown.js';
import { initializeMaps } from './maps.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    startCountdown();
});

async function initializeApp() {
    setupCalendarButton();
    initializeMaps();
    await fetchWeddingInfo();
}

function setupCalendarButton() {
    const calendarButton = document.getElementById('download-calendar');
    calendarButton.addEventListener('click', async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const apiKey = urlParams.get('key');
        if (apiKey) {
            calendarButton.classList.add('loading');
            calendarButton.disabled = true;
            await downloadCalendar(apiKey);
            calendarButton.classList.remove('loading');
            calendarButton.disabled = false;
        }
    });
}