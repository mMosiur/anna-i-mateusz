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
    setupAboutUsButton();
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

function setupAboutUsButton() {
    document.querySelector('.about-us-toggle').addEventListener('click', function() {
        const content = document.querySelector('.about-us-content');
        const icon = this.querySelector('.toggle-icon');
        content.classList.toggle('collapsed');
        icon.textContent = content.classList.contains('collapsed') ? '▼' : '▲';
    });
}
