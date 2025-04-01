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
});

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
