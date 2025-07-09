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
    setupGalleryLink();
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

function setupGalleryLink() {
    const galleryLink = document.getElementById('gallery-link');
    if (galleryLink) {
        galleryLink.addEventListener('click', (e) => {
            e.preventDefault();
            const urlParams = new URLSearchParams(window.location.search);
            const apiKey = urlParams.get('key');
            if (apiKey) {
                window.location.href = `gallery.html?key=${apiKey}`;
            }
        });
    }
}

function setupAboutUsButton() {
    const aboutUsToggle = document.querySelector('.about-us-toggle');
    const aboutUsContent = document.querySelector('.about-us-content');

    if (aboutUsToggle && aboutUsContent) {
        aboutUsToggle.addEventListener('click', () => {
            const isCollapsed = aboutUsContent.classList.contains('collapsed');
            const contentWrapper = aboutUsContent.querySelector('.content-wrapper');

            if (isCollapsed) {
                // Temporarily remove transition to get the final height correctly
                aboutUsContent.style.transition = 'none';
                aboutUsContent.classList.remove('collapsed'); // Make content visible to measure
                const scrollHeight = contentWrapper.scrollHeight;
                aboutUsContent.classList.add('collapsed'); // Add back immediately before animation
                aboutUsContent.offsetHeight; // Force reflow

                // Re-enable transition and start animation
                aboutUsContent.style.transition = ''; // Use CSS defined transition
                aboutUsContent.classList.remove('collapsed');
                aboutUsContent.style.height = scrollHeight + 'px';
                aboutUsToggle.innerHTML = 'Zwiń <span class="toggle-icon">▲</span>';

                // Remove height after transition to allow content changes
                aboutUsContent.addEventListener('transitionend', () => {
                    if (!aboutUsContent.classList.contains('collapsed')) {
                        aboutUsContent.style.height = '';
                    }
                }, { once: true });

            } else {
                // Set height explicitly to its current scrollHeight so the transition starts correctly
                aboutUsContent.style.height = contentWrapper.scrollHeight + 'px';

                // Force browser repaint/reflow to register the starting height
                aboutUsContent.offsetHeight;

                // Add the class and set height to 0px to trigger the CSS transition
                aboutUsContent.classList.add('collapsed');
                aboutUsContent.style.height = '0px'; // Animate height to 0
                aboutUsToggle.innerHTML = 'Rozwiń <span class="toggle-icon">▼</span>';
                // --- End Collapse Logic ---
            }
        });
    }
}
